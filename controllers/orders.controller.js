const orderService = require('../services/orders.sevice');
const userService = require('../services/users.sevice');
const productService = require('../services/products.sevice');

const mailer = require('../utils/mailer');

module.exports = {
    getAll: async (req, res) => {
        const data = await orderService.getAll();
        res.json({ data });
    },
    getOrdersWithConditionsAdmin: async (req, res) => {
        console.log(req.query)
        const data = await orderService.getOrdersWithConditionsAdmin(req.query);
        res.json(data);
    },
    getMyOrder: async (req, res) => {
        const data = await orderService.getMyOrder(req.user._id, req.query)
        res.json(data);
    },
    getOne: async (req, res) => {
        const data = await orderService.getOne(req.params.id);
        res.json({ data });
    },
    create: async (req, res) => {
        let order = {};
        try {
            const { cart } = await userService.getCartDetail(req.user.username);
            if (!cart || (cart && cart.length < 1))
                return res.status(400).json({ err: 'Your cart is empty!' });
            const { feeShipping, phone, address, note } = req.body;

            // 1. Before create order must to check each product in order is availability in stock
            // 1.1 Remove duplicate product info
            // *********mutation listProduct*********
            let listProduct = [cart[0].productId];
            for (let i = 1; i < cart.length; i++) {
                for (let j = 0; j < listProduct.length; j++) {
                    if (cart[i].productId._id !== listProduct[j]._id) {
                        listProduct.push(cart[i].productId);
                    }
                }
            }
            let sizeIndex = 0;
            let flag = 0;
            let productInvailid = '';
            let productSold = [];
            for (let i = 0; i < cart.length; i++) {
                // save array product sold before edit 
                // *********mutation productSold*********
                productSold.push(listProduct.find(e => e._id === cart[i].productId._id).sold);
                sizeIndex = cart[i].productId.size.findIndex((element) => element.name === cart[i].size);
                productSold[i][sizeIndex].quantity += cart[i].quantity;
                console.log(cart[i].productId.size[sizeIndex].quantity)
                console.log(cart[i].productId.sold[sizeIndex].quantity)
                if (cart[i].productId.size[sizeIndex].quantity < productSold[i][sizeIndex].quantity) {
                    flag = 1;
                    let msg = cart[i].productId.name + ' - (' + cart[i].size + ') in Stock have: x ' + (cart[i].productId.size[sizeIndex].quantity - cart[i].productId.sold[sizeIndex].quantity) + 'pcs';
                    productInvailid += productInvailid ? ' and ' + msg : msg;
                }
            }
            // if flag === 0 => one or some item(s) in cart is not availabile
            if (flag) return res.status(400).json({ err: `Your order can not create! Because ${productInvailid} are not enough!` })

            // 2. Go to each product in order update quantity sold
            // if sum of size quantity === sum of sold quantity will update status to 0 (mean out of stock)
            for (let i = 0; i < cart.length; i++) {
                let status = '1';
                let sizeQty = 0;
                let soldQty = 0;
                for (let j = 0; j < cart[i].productId.size.length; j++) {
                    sizeQty += cart[i].productId.size[j].quantity;
                    soldQty += cart[i].productId.sold[j].quantity;
                }
                if (sizeQty === soldQty)
                    status = '0';
                // add await to remove version error
                productService.update(cart[i].productId._id, { sold: productSold[i], status });
                // await productService.update(cart[i].productId._id, { sold: productSold[i], status });
            }

            // 3. Create order
            // 3.1. Add price each product and calc totalPriceRaw
            let totalPriceRaw = 0;
            // let totalProducts = 0;
            if (cart && cart.length > 0) {
                for (let i = 0; i < cart.length; i++) {
                    // console.log(cart[i])
                    cart[i].price = cart[i].productId.price;
                    totalPriceRaw += cart[i].productId.price * cart[i].quantity;
                    // totalProducts += cart[i].quantity;
                }
            }
            // 3.2. Calc totalPrice with feeShipping
            totalPrice = totalPriceRaw + feeShipping;
            // 3.3. Save to order 
            let orderedDate = new Date();
            order = { feeShipping, totalPrice, phone, address, note, orderedDate };
            order.userId = req.user._id;
            order.items = cart;
            order.code = (orderedDate.getTime()).toString(16);

            const data = await orderService.create(order);
            if (data) {
                //reset cart to null
                await userService.updateCart(null, req.user.username);

                let items = '';
                for (let i = 0; i < cart.length; i++) {
                    items += `<table cellpadding="0" cellspacing="0" style="width:100%">
                        <tbody>
                            <tr>
                                <td style="width:40%">
                                    <div style="padding-right:10px">
                                        <img src=${cart[i].productId.imageList[0]} width="200px" height="200px" style="object-fit:cover">
                                    </div>
                                </td>
                                <td style="width:60%">
                                    <div class="m_6055587387245089954product-productInfo-name">
                                        <span style="font-size:14px"> ${cart[i].productId.name + ' - ' + cart[i].size + ' - ' + cart[i].color.name}</span>
                                    </div>
                                    <div class="m_6055587387245089954product-productInfo-price">
                                        <span style="font-size:14px; color:red"><b>$ ${cart[i].productId.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</b></span>
                                    </div>
                                    <div class="m_6055587387245089954product-productInfo-subInfo">
                                        <span style="font-size:14px"><b>Quantity: ${cart[i].quantity}</b></span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <hr>`;
                }

                // html body;
                let content = `<center><h1>Thanks for your order #${data.code}</h1></center>
                <h2>Hello, ${req.user.username} 👋👋👋<br/></h2>
                <h3>Your order has been received and is being processed.</h3>
                <hr>
                <h3>🧭&nbsp;Delivery Details</h3>
                <table cellpadding="2" cellspacing="0" width="100%">
                    <tbody>
                        <tr>
                            <td width="25%" valign="top" style="color:#0f146d;font-weight:bold">Name:</td>
                            <td width="75%" valign="top">${req.user.name}</td>
                        </tr>
                            <tr>
                            <td valign="top" style="color:#0f146d;font-weight:bold">Address:</td>
                            <td valign="top">${address}</td>
                        </tr>
                        <tr>
                            <td valign="top" style="color:#0f146d;font-weight:bold">Phone:</td>
                            <td valign="top">${phone}</td>
                        </tr>
                        <tr>
                            <td valign="top" style="color:#0f146d;font-weight:bold">Note:</td>
                            <td valign="top">${note}</td>
                        </tr>
                        <tr>
                            <td valign="top" style="color:#0f146d;font-weight:bold">Subtotal:</td>
                            <td valign="top">${totalPriceRaw.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        </tr>
                        <tr>
                            <td valign="top" style="color:#0f146d;font-weight:bold">Fee Shipping:</td>
                            <td valign="top">${feeShipping > 0 ? feeShipping.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'Free'}</td>
                        </tr>
                        <tr>
                            <td valign="top" style="color:#0f146d;font-weight:bold">Total Price:</td>
                            <td valign="top" style="color:##f27c24;font-weight:bold">${totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        </tr>
                    </tbody>
                </table>  
                <hr>
                <h3>🧾&nbsp;Order Details</h3>
                ${items}`;

                mailer.sendNewOrderToCutomer(req.user.username, content);
                mailer.sendNewOrderToAdmin(data.code);
                res.status(201).json({ msg: 'Create order successful!' });
            } else
                res.status(400).json({ err: 'Create order fail!' });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not create order!' });
        }
    },
    cancelOrder: async (req, res) => {
        try {
            // 1. Update status order to -1 
            // 2. Update each product
            const orderData = orderService.getOne(req.params.id);
            const order = await orderService.cancelOrder(req.user._id, req.params.id);
            if (order === 1)
                res.json({ err: 'Your order has been Completed!' });
            if (order === -1)
                res.json({ err: 'Your order has been Cancelled!' });
            else if (order) {
                const { items, code } = await orderData;
                // 2.1 Remove duplicate product info
                // *********mutation listProduct*********
                let listProduct = [items[0].productId];
                for (let i = 1; i < items.length; i++) {
                    for (let j = 0; j < listProduct.length; j++) {
                        if (items[i].productId._id !== listProduct[j]._id) {
                            listProduct.push(items[i].productId);
                        }
                    }
                }

                // 2.2 Update product.sold
                let sizeIndex = 0;
                let productSold;
                for (let i = 0; i < items.length; i++) {
                    // *********mutation productSold*********
                    productSold = listProduct.find(e => e._id === items[i].productId._id).sold;
                    sizeIndex = items[i].productId.size.findIndex((element) => element.name === items[i].size);
                    productSold[sizeIndex].quantity -= items[i].quantity;
                    await productService.update(items[i].productId._id, { sold: productSold, status: 1 });
                }

                // 2.3 send mail
                mailer.sendOrderStatusToCutomer(req.user.username, code, "Your cancellation was successful");
                mailer.sendOrderCancelToAdmin(code, " been canceled by customer");
                res.json({ msg: 'Cancel order successful!' });
            }
            else
                res.status(400).json({ err: 'Can not find your order!' });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not cancel order!' });
        }
    },
    updateStatus: async (req, res) => {
        try {
            let status = req.body.status
            //before update status = 0 (pending) must to check each product in order is availability in stock
            //after update status = 0 (pending) must go to each product in order update sold
            const order = await orderService.getOne(req.params.id);
            console.log(order.userId)
            //**************update to pending status
            if (status == 0) {
                console.log('---->Pending order')
                // 1. Check each product in order is availability
                // 1.1. Check order is Completed?
                // console.log(order.status)
                if (order.status == 0) return res.json({ err: 'This order has already been Pending' });
                if (order.status > 0) {//on delivery or complete
                    //update status
                    const data = await orderService.updateStatus(req.params.id, status);
                    if (data) {
                        mailer.sendOrderStatusToCutomer(order.userId.username, data.code, "Your order is Pending!");
                        res.json({ msg: `Order updated successfully` });
                    }
                }
                else {//cancellation order 
                    //update status pending + update each product 
                    //---------------------------------------------------------------------------
                    const { items } = order;
                    // 1.1 Remove duplicate product info
                    // *********mutation listProduct*********
                    let listProduct = [items[0].productId];
                    for (let i = 1; i < items.length; i++) {
                        for (let j = 0; j < listProduct.length; j++) {
                            if (items[i].productId._id !== listProduct[j]._id) {
                                listProduct.push(items[i].productId);
                            }
                        }
                    }
                    let sizeIndex = 0;
                    let flag = 0;
                    let productInvailid = '';
                    let productSold = [];
                    for (let i = 0; i < items.length; i++) {
                        // save array product sold before edit 
                        // *********mutation productSold*********
                        productSold.push(listProduct.find(e => e._id === items[i].productId._id).sold);
                        sizeIndex = items[i].productId.size.findIndex((element) => element.name === items[i].size);
                        productSold[i][sizeIndex].quantity += items[i].quantity;
                        // console.log(productSold[i][sizeIndex].quantity)
                        if (items[i].productId.size[sizeIndex].quantity < productSold[i][sizeIndex].quantity) {
                            flag = 1;
                            let msg = items[i].productId.name + ' - (' + items[i].size + ') - (' + items[i].color.name + ') - x ' + items[i].quantity + 'pcs';
                            productInvailid += productInvailid ? ' and ' + msg : msg;
                        }
                    }
                    // if flag === 0 => one or some item(s) in items is not availabile
                    if (flag) return res.status(400).json({ err: `Your order can not create! Because ${productInvailid} are not enough!` })

                    // 2. Go to each product in order update quantity sold
                    // if sum of size quantity === sum of sold quantity will update status to 0 (mean out of stock)
                    for (let i = 0; i < items.length; i++) {
                        let status = '1';
                        let sizeQty = 0;
                        let soldQty = 0;
                        for (let j = 0; j < items[i].productId.size.length; j++) {
                            sizeQty += items[i].productId.size[j].quantity;
                            soldQty += items[i].productId.sold[j].quantity;
                        }
                        if (sizeQty === soldQty)
                            status = '0';
                        // add await to remove version error
                        productService.update(items[i].productId._id, { sold: productSold[i], status });
                        // await productService.update(items[i].productId._id, { sold: productSold[i], status });
                    }
                    //---------------------------------------------------------------------------

                    // update status and send mail
                    const data = await orderService.updateStatus(req.params.id, status);
                    if (data) {
                        mailer.sendOrderStatusToCutomer(order.userId.username, data.code, "Your order is Pending!");
                        res.json({ msg: `Order updated successfully` });
                    }
                }
            } else if (status == -1) { //**************update to cancel status
                console.log('---->Cancel order')
                if (order.status == -1)
                    return res.json({ err: 'This order has already been Canceled' });
                if (order.status > -1) {//pending or on deliveried or complete
                    //update status to cancel + update each product 
                    const { items, code } = await order;
                    // 2.1 Remove duplicate product info
                    // *********mutation listProduct*********
                    let listProduct = [items[0].productId];
                    for (let i = 1; i < items.length; i++) {
                        for (let j = 0; j < listProduct.length; j++) {
                            if (items[i].productId._id !== listProduct[j]._id) {
                                listProduct.push(items[i].productId);
                            }
                        }
                    }
                    // 2.2 Update product.sold
                    let sizeIndex = 0;
                    let productSold;
                    for (let i = 0; i < items.length; i++) {
                        // *********mutation productSold*********
                        productSold = listProduct.find(e => e._id === items[i].productId._id).sold;
                        sizeIndex = items[i].productId.size.findIndex((element) => element.name === items[i].size);
                        productSold[sizeIndex].quantity -= items[i].quantity;
                        await productService.update(items[i].productId._id, { sold: productSold, status: 1 });
                    }
                    // 2.3 update status and send mail
                    const data = await orderService.updateStatus(req.params.id, status);
                    if (data) {
                        mailer.sendOrderStatusToCutomer(order.userId.username, data.code, "Your order has been Cancelled!");
                        res.json({ msg: `Order updated successfully` });
                    }
                }
            }
            else {//**************update to delivery or complete status
                console.log('---->delivery or complete order')
                if (order.status >= 0) {//pending or delivery or complete
                    //update status
                    const data = await orderService.updateStatus(req.params.id, status);
                    status = status == 1 ? "Your order has been Completed" : "Your order is being Delivered";
                    if (data) {
                        mailer.sendOrderStatusToCutomer(order.userId.username, data.code, status);
                        res.json({ msg: `Order updated successfully` });
                    }
                } else {//cancel
                    //update status to pending / delivery / completed + update each product 
                    //---------------------------------------------------------------------------
                    const { items } = order;
                    // 1.1 Remove duplicate product info
                    // *********mutation listProduct*********
                    let listProduct = [items[0].productId];
                    for (let i = 1; i < items.length; i++) {
                        for (let j = 0; j < listProduct.length; j++) {
                            if (items[i].productId._id !== listProduct[j]._id) {
                                listProduct.push(items[i].productId);
                            }
                        }
                    }
                    let sizeIndex = 0;
                    let flag = 0;
                    let productInvailid = '';
                    let productSold = [];
                    for (let i = 0; i < items.length; i++) {
                        // save array product sold before edit 
                        // *********mutation productSold*********
                        productSold.push(listProduct.find(e => e._id === items[i].productId._id).sold);
                        sizeIndex = items[i].productId.size.findIndex((element) => element.name === items[i].size);
                        productSold[i][sizeIndex].quantity += items[i].quantity;
                        // console.log(productSold[i][sizeIndex].quantity)
                        if (items[i].productId.size[sizeIndex].quantity < productSold[i][sizeIndex].quantity) {
                            flag = 1;
                            let msg = items[i].productId.name + ' - (' + items[i].size + ') - (' + items[i].color.name + ') - x ' + items[i].quantity + 'pcs';
                            productInvailid += productInvailid ? ' and ' + msg : msg;
                        }
                    }
                    // if flag === 0 => one or some item(s) in items is not availabile
                    if (flag) return res.status(400).json({ err: `Your order can not create! Because ${productInvailid} are not enough!` })

                    // 2. Go to each product in order update quantity sold
                    // if sum of size quantity === sum of sold quantity will update status to 0 (mean out of stock)
                    for (let i = 0; i < items.length; i++) {
                        let status = '1';
                        let sizeQty = 0;
                        let soldQty = 0;
                        for (let j = 0; j < items[i].productId.size.length; j++) {
                            sizeQty += items[i].productId.size[j].quantity;
                            soldQty += items[i].productId.sold[j].quantity;
                        }
                        if (sizeQty === soldQty)
                            status = '0';
                        // add await to remove version error
                        productService.update(items[i].productId._id, { sold: productSold[i], status });
                        // await productService.update(items[i].productId._id, { sold: productSold[i], status });
                    }
                    //---------------------------------------------------------------------------
                    //update status and send mail
                    const data = await orderService.updateStatus(req.params.id, status);
                    status = status == 1 ? "Your order has been Completed" : "Your order is being Delivered";
                    if (data) {
                        mailer.sendOrderStatusToCutomer(order.userId.username, data.code, status);
                        res.json({ msg: `Order updated successfully` });
                    }
                }
            }
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not update order!' });
        }
    },
    delete: async (req, res) => {
        try {
            const data = await orderService.delete(req.params.id);
            if (data)
                res.json({ msg: `Delete order success` });
            else
                res.status(400).json({ err: 'No order matched to delete!' });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not delete order!' });
        }
    },
}

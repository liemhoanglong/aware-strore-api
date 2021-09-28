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
            let { cart } = await userService.getCartDetail(req.user.username);
            if (!cart || (cart && cart.length < 1))
                return res.status(400).json({ err: 'Your cart is empty!' });
            const { feeShipping, phone, address, note } = req.body;

            // 1. Before create order must to check each product in order is availability in stock
            let flag = 1;
            let productInvailid = '';
            let productSold = [];
            for (let i = 0; i < cart.length; i++) {
                let sizeIndex = cart[i].productId.size.findIndex((element) => element.name === cart[i].size);
                if (cart[i].productId.size[sizeIndex].quantity - cart[i].productId.sold[sizeIndex].quantity < cart[i].quantity) {
                    flag = 0;
                    let msg = cart[i].productId.name + ' - (' + cart[i].size + ') - (' + cart[i].color.name + ') - x ' + cart[i].quantity + ' pcs';
                    productInvailid += productInvailid ? ' and ' + msg : msg;
                }
                // save array product sold before edit 
                // *********mutation*********
                productSold[i] = cart[i].productId.sold;
                // console.log(productSold[i])
                // edit only the sizeIndex in array product sold
                productSold[i][sizeIndex].quantity += cart[i].quantity;
                // console.log('--------------------+++++++++++++--------------------')
                // console.log(productSold[i])
            }
            // if flag === 0 => one or some item(s) in cart is not availabile
            if (!flag) return res.status(400).json({ err: `Your order can not create! Because ${productInvailid} are not enough!` })

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
                productService.update(cart[i].productId._id, { sold: productSold[i], status });
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
                                        <span style="font-size:14px; color:red"><b>$ ${cart[i].productId.price + '.00'}</b></span>
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
                            <td valign="top">${totalPriceRaw + '.00'}</td>
                        </tr>
                        <tr>
                            <td valign="top" style="color:#0f146d;font-weight:bold">Fee Shipping:</td>
                            <td valign="top">${feeShipping > 0 ? feeShipping + '.00' : 'Free'}</td>
                        </tr>
                        <tr>
                            <td valign="top" style="color:#0f146d;font-weight:bold">Total Price:</td>
                            <td valign="top" style="color:##f27c24;font-weight:bold">${totalPrice + '.00'}</td>
                        </tr>
                    </tbody>
                </table>  
                <hr>
                <h3>🧾&nbsp;Order Details</h3>
                ${items}`;

                mailer.sendNewOrderToCutomer(req.user.username, content);
                mailer.sendNewOrderToAdmin(data.code);
                res.status(201).json({ data });
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
            // 2. Update product.sold
            const orderData = orderService.getOne(req.params.id);
            const order = await orderService.cancelOrder(req.user._id, req.params.id);
            if (order === 1)
                res.json({ err: 'Your order has been Completed!' });
            if (order === -1)
                res.json({ err: 'Your order has been Cancelled!' });
            else if (order) {
                const { items, code } = await orderData;
                let sizeIndex = 0;
                let productSold = [];
                for (let i = 0; i < items.length; i++) {
                    // *********mutation*********
                    productSold[i] = items[i].productId.sold;
                    sizeIndex = items[i].productId.size.findIndex((element) => element.name === items[i].size);
                    productSold[i][sizeIndex].quantity -= items[i].quantity;
                    productService.update(items[i].productId._id, { sold: productSold[i], status: 1 });
                }
                //send mail
                mailer.sendOrderStatusToCutomer(req.user.username, code, "Your order has been Cancelled");
                mailer.sendOrderCancelToAdmin(code, "  been canceled by customer");
                res.json({ order });
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
            if (status == 0) {
                // 1. Check each product in order is availability
                const order = await orderService.getOne(req.params.id);
                // 1.1. Check order is Completed?
                // console.log(order.status)
                if (order.status === 1) return res.json({ err: 'Your order has been Completed' });
                const { items } = order;
                // console.log(items[0].productId.size)
                // console.log(items[0].productId.sold)
                let flag = 1;
                let productInvailid = '';
                let productSold = [];
                let sizeIndex = 0;
                for (let i = 0; i < items.length; i++) {
                    sizeIndex = items[i].productId.size.findIndex((element) => element.name === items[i].size);
                    // let sizeIndex = items[i].size === 'S' ? 0 : items[i].size === 'M' ? 1 : 2;
                    if (items[i].productId.size[sizeIndex].quantity - items[i].productId.sold[sizeIndex].quantity < items[i].quantity) {
                        flag = 0;
                        let msg = items[i].productId.name + ' - (' + items[i].size + ') - (' + items[i].color.name + ') - x ' + items[i].quantity + 'pcs';
                        productInvailid += productInvailid ? ', ' + msg : msg;
                    }
                    // save array product sold before edit
                    productSold[i] = items[i].productId.sold;
                    // console.log(productSold[i])
                    // edit only the sizeIndex in array product sold
                    productSold[i][sizeIndex].quantity += items[i].quantity;
                    // console.log('--------------------+++++++++++++--------------------')
                    // console.log(productSold[i])
                }

                // 2. if flag === 0 one or some of item(s) is not availabile
                if (!flag) return res.status(400).json({ err: `Your order can not completed cause "${productInvailid}" not enough!` })

                // 3. update each product.sold in order
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
                    productService.update(items[i].productId._id, { sold: productSold[i], status });
                }

                // 4. update order
                const data = await orderService.updateStatus(req.params.id, status);

                // 5. send mail
                status = "Your order has been Completed";
                if (data) {
                    mailer.sendOrderStatusToCutomer(req.user.username, data.code, status);
                    res.json({ msg: `Order updated successfully` });
                }
                else
                    res.status(400).json({ err: 'No order matched to update!' });
            }
            else {
                const data = await orderService.updateStatus(req.params.id, status);
                status = status == -1 ? "Your order has been Cancelled" : status == 2 ? "Your order is being Delivered" : "Your order is being Processed";
                if (data) {
                    mailer.sendOrderStatusToCutomer(req.user.username, data.code, status);
                    res.json({ msg: `Order updated successfully` });
                }
                else
                    res.status(400).json({ err: 'No order matched to update!' });
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

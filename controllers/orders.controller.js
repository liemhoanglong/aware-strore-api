const orderService = require('../services/orders.sevice');
const userService = require('../services/users.sevice');
const productService = require('../services/products.sevice');

const mailer = require('../utils/mailer');

module.exports = {
    getAll: async (req, res) => {
        const data = await orderService.getAll();
        res.json({ data });
    },
    getMyOrder: async (req, res) => {
        const data = await orderService.getMyOrder(req.user._id);
        res.json({ data });
    },
    getOne: async (req, res) => {
        const data = await orderService.getOne(req.params.id);
        res.json({ data });
    },
    create: async (req, res) => {
        let order = {};
        try {
            const { cart, totalPriceRaw } = await userService.getCartDetail(req.user.username);
            if (cart.length < 1)
                return res.status(400).json({ err: 'Your cart is empty!' });
            const { feeShipping, phone, address, note } = req.body;
            //Cal totalPrice with feeShipping
            totalPrice = totalPriceRaw + feeShipping;

            //save to order 
            order = { feeShipping, totalPrice, phone, address, note };
            order.userId = req.user._id;
            order.items = cart;

            const data = await orderService.create(order);
            if (data) {
                //reset cart to []
                userService.updateCart(null, req.user.username);
                mailer.sendNewOrderToCutomer(req.user.username, data._id);
                mailer.sendNewOrderToAdmin(data._id);
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
            const data = await orderService.cancelOrder(req.user._id, req.params.id);
            if (data === 1)
                res.json({ err: 'Your order has been Completed!' });
            if (data === -1)
                res.json({ err: 'Your order has been Cancelled!' });
            else if (data) {
                mailer.sendOrderStatusToCutomer(req.user.username, data._id, "Your order has been Cancelled");
                mailer.sendOrderCancelToAdmin(data._id, "has been canceled by customer");
                res.json({ data });
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
            //before update status = 1 (Completed) must to check each product in order is availability in stock
            //after update status = 1 (Completed) must go to each product in order update sold
            if (status === 1) {
                // 1. Check each product in order is availability
                const order = await orderService.getOne(req.params.id);

                // 1.1. Check order is Completed?
                console.log(order.status)
                if (order.status === 1) return res.json({ err: 'Your order has been Completed' });

                const { items } = order;
                console.log(items)
                let flag = 1;
                let productInvailid = [];
                let productSold = [];
                for (let i = 0; i < items.length; i++) {
                    let sizeIndex = items[i].size === 'S' ? 0 : items[i].size === 'M' ? 1 : 2;
                    if (items[i].productId.size[sizeIndex].quantity - items[i].productId.sold[sizeIndex].quantity < items[i].quantity) {
                        flag = 0;
                        productInvailid.push(items[i].productId._id);
                    }
                    // save array product sold before edit
                    productSold[i] = items[i].productId.sold;
                    // console.log(productSold[i])
                    // edit only the size index in array product sold
                    productSold[i][sizeIndex].name = items[i].size;
                    productSold[i][sizeIndex].quantity = items[i].quantity;
                    // console.log('--------------------+++++++++++++--------------------')
                    // console.log(productSold[i])
                }

                // 2. if 1 of item is not availabile return
                if (!flag) return res.json({ err: 'Your order can not Completed cause some items is out of stock!', productInvailid })

                // 3. update each product.sold in order
                for (let i = 0; i < items.length; i++) {
                    productService.update(items[i].productId._id, { sold: productSold[i] });
                }

                // 4. update order
                const data = await orderService.updateStatus(req.params.id, status);

                // 5. send mail
                status = "Your order has been Completed";
                if (data) {
                    mailer.sendOrderStatusToCutomer(req.user.username, data._id, status);
                    res.json({ data });
                }
                else
                    res.status(400).json({ err: 'No order matched to update!' });
            }
            else {
                const data = await orderService.updateStatus(req.params.id, status);
                status = status === -1 ? "Your order has been Cancelled" : "Your order is being processed";
                if (data) {
                    mailer.sendOrderStatusToCutomer(req.user.username, data._id, status);
                    res.json({ data });
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

const orderService = require('../services/orders.sevice');
const userService = require('../services/users.sevice');

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

            //save to oder 
            order = { feeShipping, totalPrice, phone, address, note };
            order.userId = req.user._id;
            order.items = cart;

            const data = await orderService.create(order);
            if (data) {
                mailer.sendOrderToCutomer(req.user.username, data._id);
                mailer.sendOrderToAdmin(data._id);
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
            const data = await orderService.updateStatus(req.params.id, status);
            status = status === -1 ? "Your order has been Cancelled" : status === 0 ? "Your order has been Completed" : "Your order is being processed";
            if (data) {
                mailer.sendOrderStatusToCutomer(req.user.username, data._id, status);
                res.json({ data });
            }
            else
                res.status(400).json({ err: 'No order matched to update!' });
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

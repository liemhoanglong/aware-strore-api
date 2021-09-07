const orderService = require('../services/orders.sevice');

module.exports = {
    getAll: async (req, res) => {
        const data = await orderService.getAll();
        res.json({ data });
    },
    getOne: async (req, res) => {
        const data = await orderService.getOne(req.params.id);
        res.json({ data });
    },
    create: async (req, res) => {
        try {
            const data = await orderService.create(req.body.name);
            res.status(201).json({ data });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not create order!' });
        }
    },
    update: async (req, res) => {
        try {
            const data = await orderService.update(req.params.id, req.body.name);
            if (data)
                res.json({ data });
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

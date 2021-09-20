const commentService = require('../services/comments.sevice');
const orderService = require('../services/orders.sevice');

module.exports = {
    getAll: async (req, res) => {
        const data = await commentService.getAll();
        res.json(data);
    },
    getRate: async (req, res) => {
        const data = await commentService.getRate(req.params.id);
        res.json(data);
    },
    getCommentsByProductId: async (req, res) => {
        const data = await commentService.getCommentsByProductId(req.params.id, req.query);
        res.json(data);
    },
    getOneByOrder: async (req, res) => {
        const data = await commentService.getOneByOrder(req.user._id, req.query);
        res.json(data);
    },
    getOne: async (req, res) => {
        const data = await commentService.getOne(req.params.id);
        res.json(data);
    },
    create: async (req, res) => {
        console.log(req.body)
        try {
            const data = await commentService.create(req.user._id, req.body);
            const order = orderService.updateIsReview(req.body.orderId, req.body.index);
            res.status(201).json({ data });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not create comment!' });
        }
    },
    update: async (req, res) => {
        try {
            const data = await commentService.update(req.params.id, req.user._id, req.body);
            if (data)
                res.json({ data });
            else
                res.status(400).json({ err: 'No comment matched to update!' });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not update comment!' });
        }
    },
    delete: async (req, res) => {
        try {
            const data = await commentService.delete(req.params.id);
            if (data)
                res.json({ msg: `Delete comment success` });
            else
                res.status(400).json({ err: 'No comment matched to delete!' });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not delete comment!' });
        }
    },
}

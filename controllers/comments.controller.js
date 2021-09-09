const commentService = require('../services/comments.sevice');

module.exports = {
    getAll: async (req, res) => {
        const data = await commentService.getAll();
        res.json({ data });
    },
    getOne: async (req, res) => {
        const data = await commentService.getOne(req.params.id);
        res.json({ data });
    },
    create: async (req, res) => {
        try {
            const data = await commentService.create(req.body.name);
            res.status(201).json({ data });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not create comment!' });
        }
    },
    update: async (req, res) => {
        try {
            const data = await commentService.update(req.params.id, req.body.name);
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

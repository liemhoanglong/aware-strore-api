const colorService = require('../services/colors.sevice');

module.exports = {
    getAll: async (req, res) => {
        const data = await colorService.getAll();
        res.json({ data });
    },
    getOne: async (req, res) => {
        const data = await colorService.getOne(req.params.id);
        res.json({ data });
    },
    create: async (req, res) => {
        try {
            const data = await colorService.create(req.body.name);
            res.status(201).json({ data });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not create color!' });
        }
    },
    update: async (req, res) => {
        try {
            const data = await colorService.update(req.params.id, req.body.name);
            if (data)
                res.json({ data });
            else
                res.status(400).json({ err: 'No color matched to update!' });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not update color!' });
        }
    },
    delete: async (req, res) => {
        try {
            const data = await colorService.delete(req.params.id);
            if (data)
                res.json({ msg: `Delete color success` });
            else
                res.status(400).json({ err: 'No color matched to delete!' });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not delete color!' });
        }
    },
}

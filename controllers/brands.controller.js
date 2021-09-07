const brandService = require('../services/brands.sevice');

module.exports = {
    getAll: async (req, res) => {
        const data = await brandService.getAll();
        res.json({ data });
    },
    getOne: async (req, res) => {
        const data = await brandService.getOne(req.params.id);
        res.json({ data });
    },
    create: async (req, res) => {
        try {
            const data = await brandService.create(req.body.name);
            res.status(201).json({ data });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not create brand!' });
        }
    },
    update: async (req, res) => {
        try {
            const data = await brandService.update(req.params.id, req.body.name);
            if (data)
                res.json({ data });
            else
                res.status(400).json({ err: 'No brand matched to update!' });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not update brand!' });
        }
    },
    delete: async (req, res) => {
        try {
            const data = await brandService.delete(req.params.id);
            if (data)
                res.json({ msg: `Delete brand success` });
            else
                res.status(400).json({ err: 'No brand matched to delete!' });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not delete brand!' });
        }
    },
}

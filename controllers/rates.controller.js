const rateService = require('../services/rates.sevice');

module.exports = {
    getAll: async (req, res) => {
        const data = await rateService.getAll();
        res.json({ data });
    },
    getOne: async (req, res) => {
        const data = await rateService.getOne(req.params.id);
        res.json({ data });
    },
    create: async (req, res) => {
        try {
            const data = await rateService.create(req.body.name);
            res.status(201).json({ data });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not create rate!' });
        }
    },
    update: async (req, res) => {
        try {
            const data = await rateService.update(req.params.id, req.body.name);
            if (data)
                res.json({ data });
            else
                res.status(400).json({ err: 'No rate matched to update!' });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not update rate!' });
        }
    },
    delete: async (req, res) => {
        try {
            const data = await rateService.delete(req.params.id);
            if (data)
                res.json({ msg: `Delete rate success` });
            else
                res.status(400).json({ err: 'No rate matched to delete!' });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not delete rate!' });
        }
    },
}

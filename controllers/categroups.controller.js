const categroupService = require('../services/categroups.sevice');

module.exports = {
    getAll: async (req, res) => {
        const data = await categroupService.getAll();
        res.json({ data });
    },
    getOne: async (req, res) => {
        const data = await categroupService.getOne(req.params.id);
        res.json({ data });
    },
    create: async (req, res) => {
        try {
            const data = await categroupService.create(req.body.name, req.body.belongCatelist);
            res.status(201).json({ data });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not create categroup!' });
        }
    },
    update: async (req, res) => {
        try {
            const data = await categroupService.update(req.params.id, req.body.name, req.body.belongCatelist);
            if (data)
                res.json({ data });
            else
                res.status(400).json({ err: 'No categroup matched to update!' });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not update categroup!' });
        }
    },
    delete: async (req, res) => {
        try {
            const data = await categroupService.delete(req.params.id);
            if (data)
                res.json({ msg: `Delete categroup success` });
            else
                res.status(400).json({ err: 'No categroup matched to delete!' });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not delete categroup!' });
        }
    },
}

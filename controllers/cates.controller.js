const cateService = require('../services/cates.sevice');

module.exports = {
    getAll: async (req, res) => {
        const data = await cateService.getAll();
        res.json({ data });
    },
    getAllByAdmin: async (req, res) => {
        const data = await cateService.getAllByAdmin();
        res.json({ data });
    },
    getByCateGroup: async (req, res) => {
        const data = await cateService.getByCateGroup(req.params.id);
        res.json({ data });
    },
    getByCategroupAndCatelist: async (req, res) => {
        const data = await cateService.getByCategroupAndCatelist(req.params.categroup, req.params.catelist);
        res.json({ data });
    },
    getByCatelist: async (req, res) => {
        const data = await cateService.getByCatelist(req.params.id);
        res.json({ data });
    },
    getOne: async (req, res) => {
        const data = await cateService.getOne(req.params.id);
        res.json({ data });
    },
    create: async (req, res) => {
        try {
            const data = await cateService.create(req.body.name, req.body.belongCategroup, req.body.belongCatelist);
            res.status(201).json({ data });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not create cate!' });
        }
    },
    update: async (req, res) => {
        try {
            const data = await cateService.update(req.params.id, req.body.name, req.body.belongCategroup, req.body.belongCatelist);
            if (data)
                res.json({ data });
            else
                res.status(400).json({ err: 'No cate matched to update!' });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not update cate!' });
        }
    },
    delete: async (req, res) => {
        try {
            const data = await cateService.delete(req.params.id);
            if (data)
                res.json({ msg: `Delete cate success` });
            else
                res.status(400).json({ err: 'No cate matched to delete!' });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not delete cate!' });
        }
    },
}

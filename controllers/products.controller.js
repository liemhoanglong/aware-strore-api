const productService = require('../services/products.sevice');

module.exports = {
    getAll: async (req, res) => {
        const data = await productService.getAll();
        res.json({ data });
    },
    getProductsWithConditions: async (req, res) => {
        console.log(req.query)
        const data = await productService.getProductsWithConditions(req.query);
        res.json({ data });
    },
    getOne: async (req, res) => {
        const data = await productService.getOne(req.params.id);
        res.json({ data });
    },
    create: async (req, res) => {
        try {
            console.log(req.body)
            const { name, price, size, brand, imageList, catelist, categroup, cate, colors } = req.body;
            const data = await productService.create(name, price, size, brand, imageList, catelist, categroup, cate, colors);
            res.status(201).json({ data });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not create product!' });
        }
    },
    update: async (req, res) => {
        try {
            const data = await productService.update(req.params.id, req.body);
            if (data)
                res.json({ data });
            else
                res.status(400).json({ err: 'No product matched to update!' });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not update product!' });
        }
    },
    delete: async (req, res) => {
        try {
            const data = await productService.delete(req.params.id);
            if (data)
                res.json({ msg: `Delete product success` });
            else
                res.status(400).json({ err: 'No product matched to delete!' });
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ err: 'Can not delete product!' });
        }
    },
}

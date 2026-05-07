let products = [
    {
        id: "1",
        name: "Naruto Vol. 1",
        description: "L'inizio del cammino di Naruto Uzumaki.",
        genre: "Manga",
        author: "Masashi Kishimoto",
        price: 5.20,
        stock_quantity: 150
    },
    {
        id: "2",
        name: "Berserk Vol. 1",
        description: "Le avventure del guerriero nero Gatsu.",
        genre: "Dark Fantasy",
        author: "Kentaro Miura",
        price: 6.50,
        stock_quantity: 80
    },
    {
        id: "3",
        name: "Spider-Man: Blue",
        description: "Peter Parker ricorda Gwen Stacy.",
        genre: "Supereroi",
        author: "Jeph Loeb",
        price: 19.00,
        stock_quantity: 40
    }
];


// INDEX 
const index = (req, res) => {
    res.json(products);
};


// SHOW 
const show = (req, res) => {
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
        return res.status(404).json({ message: "Prodotto non trovato" });
    }

    res.json(product);
};


// CREATE 
const create = (req, res) => {
    const newProduct = {
        id: Date.now().toString(),
        name: req.body.name,
        description: req.body.description,
        genre: req.body.genre,
        author: req.body.author,
        price: req.body.price,
        stock_quantity: req.body.stock_quantity || 0
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
};


// UPDATE 
const update = (req, res) => {
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
        return res.status(404).json({ message: "Prodotto non trovato" });
    }

    product.name = req.body.name ?? product.name;
    product.description = req.body.description ?? product.description;
    product.genre = req.body.genre ?? product.genre;
    product.author = req.body.author ?? product.author;
    product.price = req.body.price ?? product.price;
    product.stock_quantity = req.body.stock_quantity ?? product.stock_quantity;

    res.json(product);
};


// DESTROY 
const destroy = (req, res) => {
    products = products.filter(p => p.id !== req.params.id);

    res.json({ message: "Prodotto eliminato" });
};



module.exports = {
    index,
    show,
    create,
    update,
    destroy
};
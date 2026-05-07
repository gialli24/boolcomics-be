const orders = [
    {
        id: 1,
        first_name: "Mario",
        last_name: "Rossi",
        email: "mario.rossi@gmail.com"
    },
    {
        id: 2,
        first_name: "Luca",
        last_name: "Bianchi",
        email: "luca.bianchi@gmail.com"
    }
]

const index = (req, res) => {
    res.json(orders);
}

const show = (req, res) => {
    const id = parseInt(req.params.id);
    const order = orders.find(order => order.id === id);

    res.json(order);
}

const create = (req, res) => {
    const order = req.body;
    order.id = orders[orders.length - 1].id + 1;

    orders.push(order);

    res.json(order);
}

const update = (req, res) => {
    const id = parseInt(req.params.id);
    const { first_name, last_name, email } = req.body;

    const order = orders.find(order => order.id === id);
    order.first_name = first_name || order.first_name;
    order.last_name = last_name || order.first_name;
    order.email = email || order.first_name;

    res.json(order);
}

const destroy = (req, res) => {
    const id = parseInt(req.params.id);
    const order = orders.filter(order => order.id !== id);
    res.json(order);
}

module.exports = { index, show, create, update, destroy };
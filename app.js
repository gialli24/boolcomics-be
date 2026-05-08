const express = require('express');
const app = express();
const PORT = 3000;

const productRoutes = require('./routers/products');

app.use(express.json());
const cors = require('cors');

const ordersRouter = require('./routers/orders');

app.use(express.static('public'));

app.use(cors());

app.use('/orders', ordersRouter);

app.get('/', (req, res) => {
res.send("Hello World");
});

app.use('/products', productRoutes);

app.listen(PORT, () => {
console.log(`Server in ascolto su http://localhost:${PORT}`);
});
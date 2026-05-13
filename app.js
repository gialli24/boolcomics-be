const express = require('express');
const app = express();
const PORT = 3000;

const cors = require('cors');

/* Routers */
const ordersRouter = require('./routers/orders');
const productRoutes = require('./routers/products');
const categoriesRouter = require('./routers/categories')
const addressesRouter = require('./routers/addresses')
const cuponsRouter = require('./routers/cupons')
/* Public Assets middleware */
app.use(express.static('public'));

/* Body Parser middleware */
app.use(express.json());

/* Cors middleware */
app.use(cors());

/* Routers redirects */
app.use('/orders', ordersRouter);
app.use('/products', productRoutes);
app.use('/categories', categoriesRouter);
app.use('/addresses', addressesRouter);
app.use('/cupons', cuponsRouter);

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});
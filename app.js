const express = require('express');
const app = express();
const PORT = 3000;

const ordersRouter = require('./routers/orders');

app.use(express.static('public'));

app.use('/orders', ordersRouter);

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});
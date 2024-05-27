const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const database = require('./db');
const { specs, swaggerUi } = require('./swagger');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 8000;

app.use(cors({
  origin: 'http://localhost:3000', // replace with your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

// Use Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

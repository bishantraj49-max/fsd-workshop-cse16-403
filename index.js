const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Express server is running');
});

app.post('/api/echo', (req, res) => {
  res.json({ received: req.body });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
require('dotenv').config();

const port = process.env.PORT;
const server = require('./server');

server.listen(port, async () => {
  console.log(`App running on port ${port}`);
});


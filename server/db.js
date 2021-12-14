const { Client } = require('pg');

const client = new Client(process.env.POSTGRESQL_DATABASE);

client.connect((err) => {
  if (err) {
    return console.error('could not connect to postgres', err);
  }
});

module.exports = client;

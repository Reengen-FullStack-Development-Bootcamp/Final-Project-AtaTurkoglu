const router = require('express').Router();
const client = require('../db');

//Get all data
router.get('/getall', async (req, res) => {
  let tableName = req.query.tablename;
  let responseData = {
    columns: [],
    rows: [],
  };
  try {
    let result = await client.query(
      `SELECT a.attname, pg_catalog.format_type(a.atttypid, a.atttypmod) FROM pg_catalog.pg_attribute a WHERE a.attnum > 0 AND NOT a.attisdropped AND a.attrelid = ( SELECT c.oid FROM pg_catalog.pg_class c LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace WHERE c.relname ~ '^(${tableName})$' AND pg_catalog.pg_table_is_visible(c.oid) );`
    );
    responseData.columns = JSON.parse(JSON.stringify(result.rows));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, message: `could not get ${tableName}` });
  }
  try {
    let result = await client.query(`SELECT * FROM ${tableName} columns`);
    responseData.rows = JSON.parse(JSON.stringify(result.rows));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, message: `could not get ${tableName} rows` });
  }
  res.status(200).json(responseData);
});

//Add new row
router.post('/addnewrow', async (req, res) => {
  let tableName = req.body.tableName;
  let keys = Object.keys(req.body.row);
  let values = Object.values(req.body.row);

  let queryKeys = '';
  for (let index = 0; index < keys.length; index++) {
    if (index == keys.length - 1) {
      queryKeys += `$${index + 1}`;
    } else {
      queryKeys += `$${index + 1}, `;
    }
  }

  try {
    let result = await client.query(
      `INSERT INTO ${tableName} (${keys.join(
        ', '
      )}) VALUES(${queryKeys}) RETURNING *`,
      values
    );
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error, message: `could not add row to ${tableName}` });
  }
});

//Delete row
router.delete('/deleterow', async (req, res) => {
  let tableName = req.body.tableName;
  let id = req.body.id;
  try {
    await client.query(`DELETE FROM ${tableName} WHERE id = ${id}`);
    res.status(200).json(id);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error, message: `could not delete row from ${tableName}` });
  }
});

//Update row
router.patch('/updaterow', async (req, res) => {
  let tableName = req.body.tableName;
  let keys = Object.keys(req.body.row);
  let values = Object.values(req.body.row);
  let query = '';

  for (let i = 0; i < keys.length; i++) {
    if (i == keys.length - 1) {
      query += `${keys[i]}=$${i + 1}`;
    } else {
      query += `${keys[i]}=$${i + 1}, `;
    }
  }

  try {
    let result = await client.query(
      `UPDATE ${tableName} SET ${query} WHERE id=$1 RETURNING *`,
      values
    );
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error, message: `could not update row from ${tableName}` });
  }
});

//Add new column
router.post('/addnewcolumn', async (req, res) => {
  console.log(req.body);
  let tableName = req.body.tableName;
  let column = req.body.column;
  let query = `ALTER TABLE ${tableName} ADD COLUMN ${column.name} ${column.type}`;
  try {
    let result = await client.query(query);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error, message: `could not add column to ${tableName}` });
  }
});

//Delete column
router.delete('/deletecolumn', async (req, res) => {
  let tableName = req.body.tableName;
  let column = req.body.column;
  let query = `ALTER TABLE ${tableName} DROP COLUMN ${column}`;
  try {
    let result = await client.query(query);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error, message: `could not add column to ${tableName}` });
  }
});

module.exports = router;

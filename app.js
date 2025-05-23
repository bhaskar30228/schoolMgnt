const express = require('express');
const addSchoolRouter = require('./routes/addSchlRoute');
const db = require("./util/database");
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/school', addSchoolRouter);

// Optional: Test database connection
db.execute('SELECT 1')
  .then(() => console.log('Database connected'))
  .catch(err => console.error('DB connection failed:', err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

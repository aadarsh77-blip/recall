const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT title, LENGTH(content) as len, LEFT(content, 200) as c, source FROM notes ORDER BY created_at DESC LIMIT 3')
  .then(res => { console.log(res.rows); process.exit(0); })
  .catch(err => { console.error(err); process.exit(1); });

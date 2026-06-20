const { Client } = require('pg');
const fs = require('fs');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres.ppscjntzzhkdhyvwxufc:Aadarsh%40123456789@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
  });
  
  await client.connect();
  console.log("Connected to Supabase!");
  
  const sql = fs.readFileSync('schema.sql', 'utf8');
  await client.query(sql);
  
  console.log("Schema applied successfully!");
  await client.end();
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});

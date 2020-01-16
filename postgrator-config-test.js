require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": process.env.TEST_DATABASE_URL,
  "port": process.env.MIGRATION_DATABASE_PORT,
  "database": process.env.MIGRATION_DATABASE_NAME,
}

const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const dbPath = path.join(__dirname, "database.db");

let db;

const initilizeDBAndStartServer = async () => {
  try {
    db = await open({
      driver: sqlite3.Database,
      filename: dbPath,
    });
    app.listen(5000, () => {
      console.log(`Server started at Port 5000`);
    });
  } catch (error) {
    console.log(`db error: ${error.message}`);
    process.exit(1);
  }
};

initilizeDBAndStartServer();

app.get("/transactions", async (request, response) => {
  const getAllTransactionsQuery = "SELECT * FROM transactions;";
  const dbResponse = await db.all(getAllTransactionsQuery);
  response.send(dbResponse);
});

app.post("/transactions", async (request, response) => {
  const { amount, type, description, runningBalance, date } = request.body;
  const insertTransactionQuery = `INSERT INTO transactions (amount, type, description, running_balance, date)
VALUES (${amount}, '${type}', '${description}', ${runningBalance}, '${date}');`;
  const dbResponse = await db.run(insertTransactionQuery);
  const transactionId = dbResponse.lastID;
  response.send({ transactionId });
});

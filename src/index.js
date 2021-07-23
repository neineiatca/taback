const express = require("express");
const axios = require("axios");

const app = express();
const port = 8080;

app.get("/", async (req, res) => {
  let myres;
  try {
    myres = await axios.get(
      "https://my-json-server.typicode.com/druska/trueaccord-mock-payments-api/debts"
    );
  } catch (err) {}
  res.send(myres.data);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

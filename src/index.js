const express = require("express");
const axios = require("axios");

const app = express();
const port = 8080;

app.get("/", async (req, res) => {
  let debtsObj;
  try {
    debtsObj = (await axios.get(
      "https://my-json-server.typicode.com/druska/trueaccord-mock-payments-api/debts"
    )).data
  } catch (err) {}

  let paymentPlansObj;
  try {
    paymentPlansObj = (await axios.get(
      "https://my-json-server.typicode.com/druska/trueaccord-mock-payments-api/payment_plans"
    )).data
  } catch (err) {}

  let paymentsObj;
  try {
    paymentsObj = (await axios.get(
      "https://my-json-server.typicode.com/druska/trueaccord-mock-payments-api/payments"
    )).data
  } catch (err) {}

  // for debug
  console.log(debtsObj);
  console.log(paymentPlansObj);
  console.log(paymentsObj);

  res.send("hello hello");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

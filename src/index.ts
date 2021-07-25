import express from "express";
import axios from "axios";
import { Debt } from "./Debt";

const app = express();
const port = 8080;

app.get("/", async (req: any, res: any) => {
  let debtsObj;
  try {
    debtsObj = (
      await axios.get(
        "https://my-json-server.typicode.com/druska/trueaccord-mock-payments-api/debts"
      )
    ).data;
  } catch (err) {}

  let paymentPlansObj;
  try {
    paymentPlansObj = (
      await axios.get(
        "https://my-json-server.typicode.com/druska/trueaccord-mock-payments-api/payment_plans"
      )
    ).data;
  } catch (err) {}

  let paymentsObj;
  try {
    paymentsObj = (
      await axios.get(
        "https://my-json-server.typicode.com/druska/trueaccord-mock-payments-api/payments"
      )
    ).data;
  } catch (err) {}

  // for debug
  console.log(debtsObj);
  console.log(paymentPlansObj);
  console.log(paymentsObj);
  //
  //
  //
  const aaa = new Debt();

  aaa.debts = debtsObj;
  // for debug
  console.log(aaa.debts);
  //
  //
  //
  res.send("hello hello");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

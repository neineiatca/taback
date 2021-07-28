import express from "express";
import axios from "axios";
import { DebtHandler } from "./Debt";

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

  //
  //
  //
  const debtHandler = new DebtHandler();

  debtHandler.debts = debtsObj;
  debtHandler.payment_plans = paymentPlansObj;
  debtHandler.payments = paymentsObj;
  //
  //
  //
  debtHandler.categorizePayments();
  debtHandler.combinePayments();
  debtHandler.calculateNextPaymentDay();
  debtHandler.assembleCompositeDebtObj();
  //
  //
  //
  res.json(debtHandler.composite_debts);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

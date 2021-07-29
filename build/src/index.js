"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const DebtHandler_1 = require("./DebtHandler");
const app = express_1.default();
const port = 8080;
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let debtsObj;
    try {
        debtsObj = (yield axios_1.default.get("https://my-json-server.typicode.com/druska/trueaccord-mock-payments-api/debts")).data;
    }
    catch (err) { }
    let paymentPlansObj;
    try {
        paymentPlansObj = (yield axios_1.default.get("https://my-json-server.typicode.com/druska/trueaccord-mock-payments-api/payment_plans")).data;
    }
    catch (err) { }
    let paymentsObj;
    try {
        paymentsObj = (yield axios_1.default.get("https://my-json-server.typicode.com/druska/trueaccord-mock-payments-api/payments")).data;
    }
    catch (err) { }
    //
    //
    //
    const debtHandler = new DebtHandler_1.DebtHandler();
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
    let debtOutput = debtHandler.outputDebt();
    //
    //
    //
    res.json(debtOutput);
}));
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

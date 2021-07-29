"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DebtHandler_1 = require("./DebtHandler");
describe("test debts calculation", () => {
    let debtsObj;
    let paymentPlansObj;
    let paymentsObj;
    let expectDebtJson;
    beforeEach(() => {
        debtsObj = [
            {
                amount: 123.46,
                id: 0,
            },
            {
                amount: 100,
                id: 1,
            },
            {
                amount: 4920.34,
                id: 2,
            },
            {
                amount: 12938,
                id: 3,
            },
            {
                amount: 9238.02,
                id: 4,
            },
        ];
        paymentPlansObj = [
            {
                amount_to_pay: 102.5,
                debt_id: 0,
                id: 0,
                installment_amount: 51.25,
                installment_frequency: "WEEKLY",
                start_date: "2020-09-28",
            },
            {
                amount_to_pay: 100,
                debt_id: 1,
                id: 1,
                installment_amount: 25,
                installment_frequency: "WEEKLY",
                start_date: "2020-08-01",
            },
            {
                amount_to_pay: 4920.34,
                debt_id: 2,
                id: 2,
                installment_amount: 1230.085,
                installment_frequency: "BI_WEEKLY",
                start_date: "2020-01-01",
            },
            {
                amount_to_pay: 4312.67,
                debt_id: 3,
                id: 3,
                installment_amount: 1230.085,
                installment_frequency: "WEEKLY",
                start_date: "2020-08-01",
            },
        ];
        paymentsObj = [
            {
                amount: 51.25,
                date: "2020-09-29",
                payment_plan_id: 0,
            },
            {
                amount: 51.25,
                date: "2020-10-29",
                payment_plan_id: 0,
            },
            {
                amount: 25,
                date: "2020-08-08",
                payment_plan_id: 1,
            },
            {
                amount: 25,
                date: "2020-08-08",
                payment_plan_id: 1,
            },
            {
                amount: 4312.67,
                date: "2020-08-08",
                payment_plan_id: 2,
            },
            {
                amount: 1230.085,
                date: "2020-08-01",
                payment_plan_id: 3,
            },
            {
                amount: 1230.085,
                date: "2020-08-08",
                payment_plan_id: 3,
            },
            {
                amount: 1230.085,
                date: "2020-08-15",
                payment_plan_id: 3,
            },
        ];
        expectDebtJson = [
            {
                id: 0,
                amount: 123.46,
                remaining_amount: 0,
                next_payment_due_date: "2021-08-02",
            },
            {
                id: 1,
                amount: 100,
                remaining_amount: 50,
                next_payment_due_date: "2021-07-31",
            },
            {
                id: 2,
                amount: 4920.34,
                remaining_amount: 607.67,
                next_payment_due_date: "2021-08-11",
            },
            {
                id: 3,
                amount: 12938,
                remaining_amount: 622.41,
                next_payment_due_date: "2021-07-31",
            },
            {
                id: 4,
                amount: 9238.02,
                remaining_amount: 0,
                next_payment_due_date: undefined,
            },
        ];
    });
    it("test debts calculation", () => {
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
        expect(debtOutput).toStrictEqual(expectDebtJson);
    });
});

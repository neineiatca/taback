"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebtHandler = void 0;
class DebtHandler {
    constructor() {
        this._debts = [];
        this._composite_debts = [];
        this._payment_plans = [];
        this._payment_plans_withNext = [];
        this._payments = [];
        this._paymentsMap = new Map();
        this._paymentsTotalMap = new Map();
    }
    get debts() {
        return this._debts;
    }
    set debts(debts) {
        this._debts = debts;
    }
    get payment_plans() {
        return this._payment_plans;
    }
    set payment_plans(payment_plans) {
        this._payment_plans = payment_plans;
    }
    get payments() {
        return this._payments;
    }
    set payments(payments) {
        this._payments = payments;
    }
    get payment_plans_withNext() {
        return this._payment_plans_withNext;
    }
    get composite_debts() {
        return this._composite_debts;
    }
    // expect Map like this
    // Map(4) {
    //   0 => [
    //     { amount: 51.25, date: '2020-09-29', payment_plan_id: 0 },
    //     { amount: 51.25, date: '2020-10-29', payment_plan_id: 0 }
    //   ],
    //   1 => [
    //     { amount: 25, date: '2020-08-08', payment_plan_id: 1 },
    //     { amount: 25, date: '2020-08-08', payment_plan_id: 1 }
    //   ],
    //   2 => [ { amount: 4312.67, date: '2020-08-08', payment_plan_id: 2 } ],
    //   3 => [
    //     { amount: 1230.085, date: '2020-08-01', payment_plan_id: 3 },
    //     { amount: 1230.085, date: '2020-08-08', payment_plan_id: 3 },
    //     { amount: 1230.085, date: '2020-08-15', payment_plan_id: 3 }
    //   ]
    // }
    categorizePayments() {
        let paymentsMap = new Map();
        // construct map
        this._payments.forEach((e) => {
            let mapValue = paymentsMap.get(e.payment_plan_id);
            if (Array.isArray(mapValue)) {
                mapValue.push(e);
            }
            else {
                paymentsMap.set(e.payment_plan_id, [e]);
            }
        });
        this._paymentsMap = paymentsMap;
        // // for debug
        // console.log(this._paymentsMap);
    }
    // expect Map like this
    // 0 => { amount: 102.5, date: '2020-09-29', payment_plan_id: 0 },
    // 1 => { amount: 50, date: '2020-08-08', payment_plan_id: 1 },
    // 2 => { amount: 4312.67, date: '2020-08-08', payment_plan_id: 2 },
    // 3 => { amount: 3690.255, date: '2020-08-01', payment_plan_id: 3 }
    combinePayments() {
        this._paymentsMap.forEach((v, k) => {
            let combinedPayments = v.reduce((acc, current) => {
                return Object.assign(Object.assign({}, acc), { amount: acc.amount + current.amount });
            });
            this._paymentsTotalMap.set(k, combinedPayments);
        });
        // // for debug
        // console.log(this._paymentsTotalMap);
    }
    calculateNextPaymentDay() {
        this._payment_plans_withNext = this._payment_plans.map((paymentPlan) => {
            // get timestamps
            const installmentStartTime = new Date();
            const currentTime = new Date(installmentStartTime.getTime());
            const installDigits = paymentPlan.start_date.split("-");
            installmentStartTime.setFullYear(parseInt(installDigits[0]));
            installmentStartTime.setMonth(parseInt(installDigits[1]) - 1);
            installmentStartTime.setDate(parseInt(installDigits[2]));
            // get time distance
            let installmentDistance = (currentTime.getTime() - installmentStartTime.getTime()) /
                1000 /
                3600 /
                24;
            installmentDistance = Math.round(installmentDistance); // for day-light saving time round
            // frequency and mod
            let frequency = paymentPlan.installment_frequency === "BI_WEEKLY"
                ? 14
                : paymentPlan.installment_frequency === "WEEKLY"
                    ? 7
                    : -1;
            let nextPaymentDistance = frequency - (installmentDistance % frequency);
            let nextPaymentTime = new Date(currentTime.getTime() + nextPaymentDistance * 24 * 3600 * 1000);
            // assemble time-format for next-payment-day
            let yearPart = nextPaymentTime.getFullYear();
            let monthPart = "000" + (nextPaymentTime.getMonth() + 1);
            let datePart = "000" + nextPaymentTime.getDate();
            let nextPaymentDate = yearPart +
                "-" +
                monthPart.substring(monthPart.length - 2, monthPart.length) +
                "-" +
                datePart.substring(datePart.length - 2, datePart.length);
            return Object.assign(Object.assign({}, paymentPlan), { next_date: nextPaymentDate });
        });
    }
    assembleCompositeDebtObj() {
        this._debts.forEach((currentDebt) => {
            // set properties
            let currentCompositeDebt = {};
            currentCompositeDebt.id = currentDebt.id;
            currentCompositeDebt.amount_to_pay = currentDebt.amount;
            // set properties related to payment_plan
            const paymentPlan = this._payment_plans_withNext.find((e) => e.debt_id === currentDebt.id);
            if (paymentPlan) {
                currentCompositeDebt.debt_amount = currentDebt.amount;
                currentCompositeDebt.payment_plan_id = paymentPlan.id;
                currentCompositeDebt.amount_to_pay = paymentPlan.amount_to_pay;
                currentCompositeDebt.next_date = paymentPlan.next_date;
                currentCompositeDebt.installment = paymentPlan.installment_amount;
            }
            // set properties related to payments
            let combinedPayment;
            if ((paymentPlan === null || paymentPlan === void 0 ? void 0 : paymentPlan.id) !== undefined) {
                combinedPayment = this._paymentsTotalMap.get(paymentPlan === null || paymentPlan === void 0 ? void 0 : paymentPlan.id);
            }
            if (combinedPayment) {
                currentCompositeDebt.amount_paid = combinedPayment.amount;
                currentCompositeDebt.amount_left = parseFloat((currentCompositeDebt.amount_to_pay -
                    currentCompositeDebt.amount_paid).toFixed(2));
            }
            // push to composite_debt array
            this._composite_debts.push(currentCompositeDebt);
        });
    }
    outputDebt() {
        let result = this._composite_debts.map((e) => {
            return {
                id: e.id,
                amount: e.debt_amount,
                remaining_amount: e.amount_left,
                next_payment_due_date: e.next_date,
            };
        });
        return result;
    }
}
exports.DebtHandler = DebtHandler;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debt = void 0;
class Debt {
    constructor() {
        this._debts = [];
        this._payment_plans = [];
        this._payments = [];
        // for debug
        console.log("init");
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
    totalPayments() {
        let aaa = this._payments.reduce((acc, current) => {
            // for debug
            console.log("----------------------------------------");
            console.log(acc);
            console.log(current);
            return acc;
        });
    }
}
exports.Debt = Debt;

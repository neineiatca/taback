"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debt = void 0;
class Debt {
    constructor() {
        // for debug
        console.log("init");
    }
    get debts() {
        return this._debts;
    }
    set debts(debts) {
        this._debts = debts;
    }
}
exports.Debt = Debt;

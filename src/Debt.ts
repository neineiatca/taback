import { Payment } from "./models/Payment";
import { Payment_plan } from "./models/Payment_plan";

export class Debt {
  private _debts: Debt[] = [];
  private _payment_plans: Payment_plan[] = [];
  private _payments: Payment[] = [];

  constructor() {
    // for debug
    console.log("init");
  }

  get debts(): Debt[] {
    return this._debts;
  }

  set debts(debts: Debt[]) {
    this._debts = debts;
  }

  get payment_plans(): Payment_plan[] {
    return this._payment_plans;
  }

  set payment_plans(payment_plans: Payment_plan[]) {
    this._payment_plans = payment_plans;
  }

  get payments(): Payment[] {
    return this._payments;
  }

  set payments(payments: Payment[]) {
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

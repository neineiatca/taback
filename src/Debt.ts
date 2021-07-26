import { Payment } from "./models/Payment";
import { Payment_plan } from "./models/Payment_plan";

export class Debt {
  private _debts: Debt[] = [];
  private _payment_plans: Payment_plan[] = [];
  private _payments: Payment[] = [];
  private _paymentsMap: Map<number, Payment[]> = new Map();
  private _paymentsTotalMap: Map<number, Payment> = new Map();

  constructor() {}

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
      } else {
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
        return {
          ...acc,
          amount: acc.amount + current.amount,
        };
      });

      this._paymentsTotalMap.set(k, combinedPayments);
    });

    // // for debug
    // console.log(this._paymentsTotalMap);
  }
}

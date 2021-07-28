import { CompositeDebt, Debt } from "./models/Debt";
import { Payment } from "./models/Payment";
import { Payment_plan, Payment_plan_withNext } from "./models/Payment_plan";

export class DebtHandler {
  private _debts: Debt[] = [];
  private _composite_debts: CompositeDebt[] = [];
  private _payment_plans: Payment_plan[] = [];
  private _payment_plans_withNext: Payment_plan_withNext[] = [];
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

  get payment_plans_withNext(): Payment_plan_withNext[] {
    return this._payment_plans_withNext;
  }

  get composite_debts(): CompositeDebt[]{
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
      let installmentDistance =
        (currentTime.getTime() - installmentStartTime.getTime()) /
        1000 /
        3600 /
        24;
      installmentDistance = Math.round(installmentDistance); // for day-light saving time round

      // frequency and mod
      let frequency =
        paymentPlan.installment_frequency === "BI_WEEKLY"
          ? 14
          : paymentPlan.installment_frequency === "WEEKLY"
          ? 7
          : -1;
      let nextPaymentDistance = frequency - (installmentDistance % frequency);
      let nextPaymentTime = new Date(
        currentTime.getTime() + nextPaymentDistance * 24 * 3600 * 1000
      );

      // assemble time-format for next-payment-day
      let yearPart = nextPaymentTime.getFullYear();
      let monthPart = "000" + (nextPaymentTime.getMonth() + 1);
      let datePart = "000" + nextPaymentTime.getDate();

      let nextPaymentDate =
        yearPart +
        "-" +
        monthPart.substring(monthPart.length - 2, monthPart.length) +
        "-" +
        datePart.substring(datePart.length - 2, datePart.length);

      return {
        ...paymentPlan,
        next_date: nextPaymentDate,
      };
    });
  }

  assembleCompositeDebtObj() {
    this._debts.forEach((currentDebt: Debt) => {

      // set properties
      let currentCompositeDebt = {} as CompositeDebt;

      currentCompositeDebt.id = currentDebt.id;
      currentCompositeDebt.amount_to_pay = currentDebt.amount;

      // set properties related to payment_plan
      const paymentPlan = this._payment_plans_withNext.find(
        (e) => e.debt_id === currentDebt.id
      );

      if (paymentPlan) {
        currentCompositeDebt.debt_amount = currentDebt.amount;
        currentCompositeDebt.payment_plan_id = paymentPlan.id;
        currentCompositeDebt.amount_to_pay = paymentPlan.amount_to_pay;
        currentCompositeDebt.next_date = paymentPlan.next_date;
        currentCompositeDebt.installment = paymentPlan.installment_amount;
      }

      // set properties related to payments
      let combinedPayment;
      if (paymentPlan?.id) {
        combinedPayment = this._paymentsTotalMap.get(paymentPlan?.id);
      }

      if (combinedPayment) {
        currentCompositeDebt.amount_paid = combinedPayment.amount;
        currentCompositeDebt.amount_left =
          currentCompositeDebt.amount_to_pay - currentCompositeDebt.amount_paid;
      }

      // push to composite_debt array
      this._composite_debts.push(currentCompositeDebt);
    });
  }
}

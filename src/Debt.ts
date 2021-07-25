export class Debt {
  private _debts: any;
  private _payment_plans: any;
  private _payments: any;

  constructor() {
    // for debug
    console.log("init");
  }

  get debts(): any {
    return this._debts;
  }

  set debts(debts: any) {
    this._debts = debts;
  }
}

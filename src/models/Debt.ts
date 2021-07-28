export type Debt = {
  id: number;
  amount: number;
};

export type CompositeDebt = {
  id: number;
  debt_amount: number;
  payment_plan_id: number;
  amount_to_pay: number;
  amount_paid: number;
  amount_left: number;
  next_date: string;
  installment: number;
}

export type OutputDebt = {
  id:number;
  amount: number;
  remaining_amount: number;
  next_payment_due_date: string;
}
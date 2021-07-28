export type Payment_plan = {
  id: number;
  debt_id: number;
  amount_to_pay: number;
  installment_frequency: string;
  installment_amount: number;
  start_date: string;
};

export type Payment_plan_withNext = {
  id: number;
  debt_id: number;
  amount_to_pay: number;
  installment_frequency: string;
  installment_amount: number;
  start_date: string;
  next_date: string;
};

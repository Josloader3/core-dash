export interface Kpi {
  label: string;
  value: number;
  icon: string;
  color: string;
  trend: number;
}

export interface MonthlySales {
  month: string;
  sales: number;
}

export interface Transaction {
  id: number;
  client: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

export interface DbData {
  users: import('./user.model').User[];
  products: import('./product.model').Product[];
  kpis: Kpi[];
  monthlySales: MonthlySales[];
  transactions: Transaction[];
}

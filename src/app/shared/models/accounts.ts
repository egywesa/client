export interface IChartOfAccount {
  id: number;
  name: string;
  code: string;
  openingBalance: number;
  currentBalance: number;
  type: string;
  parentId: number | null;
  children: IChartOfAccount[];
}

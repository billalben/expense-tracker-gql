import { ECategories } from "../enums";

export type TChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor?: string[];
    borderWidth?: number;
    borderRadius: number;
    spacing: number;
    cutout: number;
  }[];
};

export type TTransactionStatistics = {
  categoryStatistics: {
    category: ECategories;
    totalAmount: number;
  }[];
};

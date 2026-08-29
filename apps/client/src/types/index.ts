import { ECategories, EPaymentTypes } from "../enums";

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

export type TUser = {
  authUser: {
    _id: string;
    username: string;
    name: string;
    profilePicture: string;
    gender?: "male" | "female";
    transactions?: TTransaction[];
  };
};

export type TTransaction = {
  transaction: {
    id: string;
    userId: string;
    description: string;
    paymentType: EPaymentTypes;
    category: ECategories;
    amount: number;
    location: string;
    date: string;
    user?: {
      _id: string;
      username: string;
      name: string;
      profilePicture: string;
      gender?: "male" | "female";
      transactions?: TTransaction[];
    };
  };
};

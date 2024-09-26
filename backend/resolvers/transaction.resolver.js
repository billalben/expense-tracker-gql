import { transactions } from "../dummyData/data.js";

const transactionResolver = {
  Query: {
    transactions: () => transactions,
  },
};

export default transactionResolver;

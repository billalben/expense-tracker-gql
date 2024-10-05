import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");
        const userId = await context.getUser()._id;

        return await Transaction.find({ userId }).sort({
          date: "desc",
        });
      } catch (error) {
        throw new Error(error?.message || "Internal server error");
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        return await Transaction.findById(transactionId);
      } catch (error) {
        throw new Error(error?.message || "Internal server error");
      }
    },
    categoryStatistics: async (_, __, context) => {
      if (!context.getUser()) throw new Error("Unauthorized");

      const userId = context.getUser()._id;
      const transactions = await Transaction.find({ userId }).select(
        "category amount"
      );
      const categoryMap = {};

      /**
       * transactions how it looks like
       * const transactions = [
          { category: "expense", amount: 50 },
          { category: "expense", amount: 75 },
          { category: "investment", amount: 100 },
          { category: "saving", amount: 30 },
          { category: "saving", amount: 20 }
        ];
      */

      transactions.forEach((transaction) => {
        if (!categoryMap[transaction.category]) {
          categoryMap[transaction.category] = 0;
        }
        categoryMap[transaction.category] += transaction.amount;
      });

      /**
       * categoryMap how it looks like
       * categoryMap = { expense: 125, investment: 100, saving: 50 }
       */

      return Object.entries(categoryMap).map(([category, totalAmount]) => ({
        category,
        totalAmount,
      }));

      /**
       * Object.entries(categoryMap) how it looks like
       * return [ { category: "expense", totalAmount: 125 }, { category: "investment", totalAmount: 100 }, { category: "saving", totalAmount: 50 } ]
       */
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");

        return await Transaction.create({
          ...input,
          userId: context.getUser()._id,
        });
      } catch (error) {
        throw new Error(error?.message || "Internal server error");
      }
    },
    updateTransaction: async (_, { input }) => {
      try {
        return await Transaction.findByIdAndUpdate(input.transactionId, input, {
          new: true,
        });
      } catch (error) {
        throw new Error(error?.message || "Internal server error");
      }
    },
    deleteTransaction: async (_, { transactionId }) => {
      try {
        return await Transaction.findByIdAndDelete(transactionId);
      } catch (error) {
        throw new Error(error?.message || "Internal server error");
      }
    },
  },
  Transaction: {
    user: async (parent) => {
      const userId = parent.userId;
      try {
        return await User.findById(userId);
      } catch (error) {
        throw new Error(error?.message || "Internal server error");
      }
    },
  },
};

export default transactionResolver;

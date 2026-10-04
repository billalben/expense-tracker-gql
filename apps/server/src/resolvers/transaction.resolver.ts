import Transaction, { ITransaction } from "../models/transaction.model.js";
import User from "../models/user.model.js";
import type { GraphQLContext } from "../types/index.js";

interface CreateTransactionInput {
  description: string;
  paymentType: "cash" | "card";
  category: "saving" | "expense" | "investment";
  amount: number;
  date: string;
  location?: string;
}

interface UpdateTransactionInput {
  transactionId: string;
  description?: string;
  paymentType?: string;
  category?: string;
  amount?: number;
  location?: string;
  date?: string;
}

const transactionResolver = {
  Query: {
    transactions: async (_: unknown, __: unknown, context: GraphQLContext) => {
      try {
        const user = context.getUser();
        if (!user) throw new Error("Unauthorized");
        const userId = user._id;

        return await Transaction.find({ userId }).sort({
          date: "desc",
        });
      } catch (error) {
        throw new Error((error as Error)?.message || "Internal server error");
      }
    },
    transaction: async (
      _: unknown,
      { transactionId }: { transactionId: string }
    ) => {
      try {
        return await Transaction.findById(transactionId);
      } catch (error) {
        throw new Error((error as Error)?.message || "Internal server error");
      }
    },
    categoryStatistics: async (
      _: unknown,
      __: unknown,
      context: GraphQLContext
    ) => {
      const user = context.getUser();
      if (!user) throw new Error("Unauthorized");

      const userId = user._id;
      const transactions = await Transaction.find({ userId }).select(
        "category amount"
      );
      const categoryMap: Record<string, number> = {};

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
    createTransaction: async (
      _: unknown,
      { input }: { input: CreateTransactionInput },
      context: GraphQLContext
    ) => {
      try {
        const user = context.getUser();
        if (!user) throw new Error("Unauthorized");

        return await Transaction.create({
          ...input,
          userId: user._id,
        });
      } catch (error) {
        throw new Error((error as Error)?.message || "Internal server error");
      }
    },
    updateTransaction: async (
      _: unknown,
      { input }: { input: UpdateTransactionInput }
    ) => {
      try {
        return await Transaction.findByIdAndUpdate(input.transactionId, input, {
          new: true,
        });
      } catch (error) {
        throw new Error((error as Error)?.message || "Internal server error");
      }
    },
    deleteTransaction: async (
      _: unknown,
      { transactionId }: { transactionId: string }
    ) => {
      try {
        return await Transaction.findByIdAndDelete(transactionId);
      } catch (error) {
        throw new Error((error as Error)?.message || "Internal server error");
      }
    },
  },
  Transaction: {
    user: async (parent: ITransaction) => {
      const userId = parent.userId;
      try {
        return await User.findById(userId);
      } catch (error) {
        throw new Error((error as Error)?.message || "Internal server error");
      }
    },
  },
};

export default transactionResolver;

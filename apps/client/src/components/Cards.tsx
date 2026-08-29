import { useQuery } from "@apollo/client/react";
import Card from "./Card";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.query";
import { GET_AUTHENTICATED_USER } from "../graphql/queries/user.query";

type TransactionType = {
  _id: string;
  description: string;
  paymentType: "card" | "cash";
  category: "saving" | "expense" | "investment";
  amount: number;
  location: string;
  date: string;
};

type TransactionsData = {
  transactions: TransactionType[];
};

type AuthUserData = {
  authUser: {
    _id: string;
    username: string;
    name: string;
    profilePicture: string;
  };
};

const Cards = () => {
  const { data, loading } = useQuery<TransactionsData>(GET_TRANSACTIONS);
  const { data: authUser } = useQuery<AuthUserData>(GET_AUTHENTICATED_USER);

  return (
    <div className="min-h-[40vh] w-full px-10">
      <p className="my-10 text-center text-5xl font-bold">History</p>
      <div className="mb-20 grid w-full grid-cols-1 justify-start gap-4 md:grid-cols-2 lg:grid-cols-3">
        {!loading &&
          data?.transactions?.map((transaction: TransactionType) => (
            <Card
              key={transaction._id}
              transaction={transaction}
              authUser={authUser?.authUser}
            />
          ))}
      </div>
      {!loading && data?.transactions?.length === 0 && (
        <p className="w-full text-center text-2xl font-bold">
          No transaction history found.
        </p>
      )}
    </div>
  );
};

export default Cards;

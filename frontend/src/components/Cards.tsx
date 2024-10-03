import { useQuery } from "@apollo/client";
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

const Cards = () => {
  const { data, loading } = useQuery(GET_TRANSACTIONS);
  const { data: authUser } = useQuery(GET_AUTHENTICATED_USER);

  return (
    <div className="min-h-[40vh] w-full px-10">
      <p className="my-10 text-5xl font-bold text-center">History</p>
      <div className="grid justify-start w-full grid-cols-1 gap-4 mb-20 md:grid-cols-2 lg:grid-cols-3">
        {!loading &&
          data.transactions.map((transaction: TransactionType) => (
            <Card
              key={transaction._id}
              transaction={transaction}
              authUser={authUser.authUser}
            />
          ))}
      </div>
      {!loading && data?.transactions?.length === 0 && (
        <p className="w-full text-2xl font-bold text-center">
          No transaction history found.
        </p>
      )}
    </div>
  );
};
export default Cards;

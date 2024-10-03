import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { DELETE_TRANSACTION } from "../graphql/mutations/transaction.mutation";

const categoryColorMap = {
  saving: "from-green-700 to-green-400",
  expense: "from-pink-800 to-pink-600",
  investment: "from-blue-700 to-blue-400",
};

type CardProps = {
  transaction: {
    _id: string;
    category: "saving" | "expense" | "investment";
    amount: number;
    location: string;
    date: string;
    paymentType: "card" | "cash";
    description: string;
  };
  authUser: {
    profilePicture: string;
  };
};

const Card = ({ transaction, authUser }: CardProps) => {
  const { category, amount, location, date, paymentType, description } =
    transaction;
  const cardClass = categoryColorMap[category];
  const [deleteTransaction, { loading, error }] = useMutation(
    DELETE_TRANSACTION,
    {
      refetchQueries: ["GetTransactions", "GetTransactionStatistics"],
    },
  );

  const formattedDate = formatDate(date);

  const handleDelete = async () => {
    try {
      await deleteTransaction({
        variables: { transactionId: transaction._id },
      });
      toast.success("Transaction deleted successfully 🎉");
    } catch {
      toast.error(`Failed to delete transaction: ${error?.message || ""}`);
    }
  };

  return (
    <div className={`rounded-md bg-gradient-to-br p-4 ${cardClass}`}>
      <div className="flex flex-col justify-between h-full gap-3">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-bold tracking-wider text-white">
            {category}
          </h2>
          <div className="flex items-center gap-2">
            {!loading && (
              <FaTrash className={"cursor-pointer"} onClick={handleDelete} />
            )}
            {loading && (
              <div className="w-6 h-6 border-t-2 border-b-2 rounded-full animate-spin"></div>
            )}
            <Link to={`/transaction/${transaction._id}`}>
              <HiPencilAlt className="cursor-pointer" size={20} />
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-center flex-1 gap-3">
          <p className="flex flex-wrap items-center gap-2 text-white capitalize">
            <BsCardText className="shrink-0" size={20} />
            <b>Description:</b> {description}
          </p>
          <p className="flex items-center gap-2 text-white capitalize">
            <MdOutlinePayments className="shrink-0" size={20} />
            <b>Payment Type:</b> {paymentType}
          </p>
          <p className="flex items-center gap-2 text-white capitalize">
            <FaSackDollar className="shrink-0" size={20} />
            <b>Amount:</b> ${amount}
          </p>
          <p className="flex items-center gap-2 text-white">
            <FaLocationDot className="shrink-0" size={20} />
            <b>Location:</b> {location || "N/A"}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-wider text-slate-800">
            {formattedDate}
          </p>
          <img
            src={authUser?.profilePicture}
            className="w-8 h-8 border rounded-full"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
export default Card;

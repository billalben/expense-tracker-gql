import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  GET_TRANSACTION,
  GET_TRANSACTION_STATISTICS,
} from "../graphql/queries/transaction.query";
import { UPDATE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import toast from "react-hot-toast";
import TransactionFormSkeleton from "../components/skeletons/TransactionFormSkeleton";
import { TTransaction } from "../types";

const EditTransactionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, error, data } = useQuery<TTransaction>(GET_TRANSACTION, {
    variables: { id: id },
  });

  const [updateTransaction, { loading: loadingUpdate, error: errorUpdate }] =
    useMutation(UPDATE_TRANSACTION, {
      refetchQueries: [{ query: GET_TRANSACTION_STATISTICS }],
    });

  const [formData, setFormData] = useState({
    description: data?.transaction?.description || "",
    paymentType: data?.transaction?.paymentType || "",
    category: data?.transaction?.category || "",
    amount: data?.transaction?.amount || "",
    location: data?.transaction?.location || "",
    date: data?.transaction?.date || "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await updateTransaction({
        variables: {
          input: {
            ...formData,
            transactionId: id,
          },
        },
      });
      toast.success("Transaction updated successfully");
      navigate("/");
    } catch {
      toast.error(
        `Failed to update transaction: ${errorUpdate?.message || ""}`,
      );
    }
  };

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (data) {
      setFormData({
        description: data?.transaction?.description,
        paymentType: data?.transaction?.paymentType,
        category: data?.transaction?.category,
        amount: data?.transaction?.amount,
        location: data?.transaction?.location,
        date: new Date(+data.transaction.date).toISOString().substr(0, 10),
      });
    }
  }, [data]);

  if (error)
    toast.error(`Failed to fetch transaction: ${error?.message || ""}`);
  if (loading) return <TransactionFormSkeleton />;

  return (
    <div className="flex flex-col items-center h-screen max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-1 sm:gap-4">
        <p className="text-xl font-bold text-center text-transparent bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 bg-clip-text md:text-4xl lg:text-4xl">
          {data?.transaction.user?.name || "Unknown User"}
        </p>
        <img
          src={
            data?.transaction?.user?.profilePicture ||
            "https://tecdn.b-cdn.net/img/new/avatars/2.webp"
          }
          className="border rounded-full h-11 w-11"
          alt="Avatar"
        />
      </div>
      <p className="my-4 text-2xl font-bold text-center text-transparent bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 bg-clip-text md:text-4xl lg:text-4xl">
        Update this transaction
      </p>
      <form
        className="flex flex-col w-full max-w-lg gap-5 px-3"
        onSubmit={handleSubmit}
      >
        {/* TRANSACTION */}
        <div className="flex flex-wrap">
          <div className="w-full">
            <label
              className="block mb-2 text-xs font-bold tracking-wide text-white uppercase"
              htmlFor="description"
            >
              Transaction
            </label>
            <input
              className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:border-gray-500 focus:bg-white focus:outline-none"
              id="description"
              name="description"
              type="text"
              placeholder="Rent, Groceries, Salary, etc."
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {/* PAYMENT TYPE */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 w-full mb-6 md:mb-0">
            <label
              className="block mb-2 text-xs font-bold tracking-wide text-white uppercase"
              htmlFor="paymentType"
            >
              Payment Type
            </label>
            <div className="relative">
              <select
                className="block w-full px-4 py-3 pr-8 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:border-gray-500 focus:bg-white focus:outline-none"
                id="paymentType"
                name="paymentType"
                onChange={handleInputChange}
                defaultValue={formData.paymentType}
              >
                <option value={"card"}>Card</option>
                <option value={"cash"}>Cash</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                <svg
                  className="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* CATEGORY */}
          <div className="flex-1 w-full mb-6 md:mb-0">
            <label
              className="block mb-2 text-xs font-bold tracking-wide text-white uppercase"
              htmlFor="category"
            >
              Category
            </label>
            <div className="relative">
              <select
                className="block w-full px-4 py-3 pr-8 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:border-gray-500 focus:bg-white focus:outline-none"
                id="category"
                name="category"
                onChange={handleInputChange}
                defaultValue={formData.category}
              >
                <option value={"saving"}>Saving</option>
                <option value={"expense"}>Expense</option>
                <option value={"investment"}>Investment</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                <svg
                  className="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* AMOUNT */}
          <div className="flex-1 w-full mb-6 md:mb-0">
            <label
              className="block mb-2 text-xs font-bold text-white uppercase"
              htmlFor="amount"
            >
              Amount($)
            </label>
            <input
              className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:border-gray-500 focus:bg-white focus:outline-none"
              id="amount"
              name="amount"
              type="number"
              placeholder="150"
              value={formData.amount}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* LOCATION */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 w-full mb-6 md:mb-0">
            <label
              className="block mb-2 text-xs font-bold tracking-wide text-white uppercase"
              htmlFor="location"
            >
              Location
            </label>
            <input
              className="block w-full px-4 py-3 mb-3 leading-tight text-gray-700 bg-gray-200 border rounded appearance-none focus:bg-white focus:outline-none"
              id="location"
              name="location"
              type="text"
              placeholder="New York"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>

          {/* DATE */}
          <div className="flex-1 w-full">
            <label
              className="block mb-2 text-xs font-bold tracking-wide text-white uppercase"
              htmlFor="date"
            >
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              className="mb-3 block w-full appearance-none rounded border bg-gray-200 px-4 py-[11px] leading-tight text-gray-700 focus:bg-white focus:outline-none"
              placeholder="Select date"
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {/* SUBMIT BUTTON */}
        <button
          className="w-full px-4 py-2 font-bold text-white rounded bg-gradient-to-br from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600"
          type="submit"
          disabled={loadingUpdate}
        >
          {loadingUpdate ? "Updating..." : "Update Transaction"}
        </button>
      </form>
    </div>
  );
};
export default EditTransactionPage;

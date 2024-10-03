import { useMutation } from "@apollo/client";
import { CREATE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import toast from "react-hot-toast";

const TransactionForm = () => {
  const [createTransaction, { loading, error }] = useMutation(
    CREATE_TRANSACTION,
    {
      refetchQueries: ["GetTransactions", "GetTransactionStatistics"],
    },
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const transactionData = {
      description: (formData.get("description") as string) || "",
      paymentType: (formData.get("paymentType") as string) || "card",
      category: (formData.get("category") as string) || "expense",
      amount: parseFloat((formData.get("amount") as string) || "0"),
      location: (formData.get("location") as string) || "",
      date: (formData.get("date") as string) || "",
    };

    try {
      await createTransaction({ variables: { input: transactionData } });
      form.reset();
      toast.success("Transaction created successfully 🎉");
    } catch {
      toast.error(`Failed to created: ${error?.message || ""}`);
    }
  };

  return (
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
            required
            placeholder="Rent, Groceries, Salary, etc."
            maxLength={100}
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
            required
            max={100000}
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
            required
            maxLength={20}
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
            required
          />
        </div>
      </div>
      {/* SUBMIT BUTTON */}
      <button
        className="w-full px-4 py-2 font-bold text-white rounded bg-gradient-to-br from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        disabled={loading}
      >
        {loading ? "Loading..." : "Add Transaction"}
      </button>
    </form>
  );
};

export default TransactionForm;

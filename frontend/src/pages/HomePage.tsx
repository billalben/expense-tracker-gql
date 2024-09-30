import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import Cards from "../components/Cards";
import TransactionForm from "../components/TransactionForm";

import { MdLogout } from "react-icons/md";
import { useMutation } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user.mutation";
import toast from "react-hot-toast";

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const [logoutFunction, { loading, error, client }] = useMutation(LOGOUT, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const chartData = {
    labels: ["Saving", "Expense", "Investment"],
    datasets: [
      {
        label: "%",
        data: [13, 8, 3],
        backgroundColor: [
          "rgba(75, 192, 192)",
          "rgba(255, 99, 132)",
          "rgba(54, 162, 235)",
        ],
        borderColor: [
          "rgba(75, 192, 192)",
          "rgba(255, 99, 132)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
        borderRadius: 30,
        spacing: 10,
        cutout: 130,
      },
    ],
  };

  const handleLogout = async () => {
    try {
      await logoutFunction();
      client.resetStore(); // This will cause the store to be cleared and all active queries to be refetched.
      toast.success("Logged out successfully 🎉");
    } catch {
      toast.error(`Failed to logout: ${error?.message}`);
    }
  };

  return (
    <>
      <div className="relative z-20 flex flex-col items-center justify-center gap-6 mx-auto max-w-7xl">
        <div className="flex items-center">
          <p className="relative z-50 inline-block mb-4 mr-4 text-2xl font-bold text-center text-transparent bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 bg-clip-text md:text-4xl lg:text-4xl">
            Spend wisely, track wisely
          </p>
          <img
            src={"https://tecdn.b-cdn.net/img/new/avatars/2.webp"}
            className="border rounded-full cursor-pointer h-11 w-11"
            alt="Avatar"
          />
          {!loading && (
            <MdLogout
              className="w-5 h-5 mx-2 cursor-pointer"
              onClick={handleLogout}
            />
          )}
          {/* loading spinner */}
          {loading && (
            <div className="w-6 h-6 mx-2 border-t-2 border-b-2 rounded-full animate-spin"></div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center w-full gap-6">
          <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]">
            <Doughnut data={chartData} />
          </div>

          <TransactionForm />
        </div>
        <Cards />
      </div>
    </>
  );
};
export default HomePage;

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import Cards from "../components/Cards";
import TransactionForm from "../components/TransactionForm";

import { MdLogout } from "react-icons/md";
import { useMutation, useQuery } from "@apollo/client/react";
import { LOGOUT } from "../graphql/mutations/user.mutation";
import toast from "react-hot-toast";
import { GET_AUTHENTICATED_USER } from "../graphql/queries/user.query";
import { GET_TRANSACTION_STATISTICS } from "../graphql/queries/transaction.query";
import { useEffect, useState } from "react";
import { TChartData, TTransactionStatistics, TUser } from "../types";
import { ECategories } from "../enums";

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const { data } = useQuery<TTransactionStatistics>(GET_TRANSACTION_STATISTICS);
  const { data: authUserData } = useQuery<TUser>(GET_AUTHENTICATED_USER);

  const [logoutFunction, { loading, error, client }] = useMutation(LOGOUT, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const [chartData, setChartData] = useState<TChartData>({
    labels: [],
    datasets: [
      {
        label: "$",
        data: [],
        backgroundColor: [],
        borderRadius: 30,
        borderWidth: 0,
        spacing: 10,
        cutout: 130,
      },
    ],
  });

  useEffect(() => {
    if (data?.categoryStatistics) {
      const categories = data.categoryStatistics.map((stat) => stat.category);
      const totalAmounts = data.categoryStatistics.map(
        (stat) => stat.totalAmount,
      );

      const backgroundColors: string[] = [];

      categories.forEach((category) => {
        if (category === ECategories.SAVING) {
          backgroundColors.push("rgba(75, 192, 192)");
        } else if (category === ECategories.EXPENSE) {
          backgroundColors.push("rgba(255, 99, 132)");
        } else if (category === ECategories.INVESTMENT) {
          backgroundColors.push("rgba(54, 162, 235)");
        }
      });

      setChartData((prev) => ({
        labels: categories,
        datasets: [
          {
            ...prev.datasets[0],
            data: totalAmounts,
            backgroundColor: backgroundColors,
          },
        ],
      }));
    }
  }, [data]);

  const handleLogout = async () => {
    try {
      await logoutFunction();
      client.resetStore(); // This will cause the store to be cleared and all active queries to be refetched.
      toast.success("Logged out successfully 🎉");
    } catch {
      toast.error(`Failed to logout: ${error?.message || ""}`);
    }
  };

  return (
    <>
      <div className="relative z-20 mx-auto flex max-w-7xl flex-col items-center justify-center gap-6">
        <div className="flex items-center justify-center gap-1 sm:gap-4">
          <p className="bg-linear-to-r from-pink-600 via-indigo-500 to-pink-400 bg-clip-text text-center text-xl font-bold text-transparent md:text-4xl lg:text-4xl">
            Spend wisely, track wisely
          </p>
          <img
            src={authUserData?.authUser.profilePicture}
            className="h-11 w-11 rounded-full border"
            alt="Avatar"
          />

          {loading ? (
            <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2"></div>
          ) : (
            <MdLogout
              className="h-8 w-8 cursor-pointer transition-colors hover:text-red-500"
              onClick={handleLogout}
            />
          )}
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-6">
          <div className="h-82.5 w-82.5 md:h-90 md:w-90">
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

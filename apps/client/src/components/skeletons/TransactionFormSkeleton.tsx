const TransactionFormSkeleton = () => {
  return (
    <div className="mx-auto h-screen max-w-xl py-10">
      <h3 className="h-6 animate-pulse rounded bg-gray-200"></h3>

      <ul className="mt-5 flex gap-3">
        <li className="h-6 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></li>
        <li className="h-6 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></li>
        <li className="h-6 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></li>
      </ul>
      <ul className="mt-5 flex gap-3">
        <li className="h-6 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></li>
        <li className="h-6 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></li>
      </ul>
      <ul className="mt-5 flex gap-3">
        <li className="h-6 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></li>
      </ul>
    </div>
  );
};
export default TransactionFormSkeleton;

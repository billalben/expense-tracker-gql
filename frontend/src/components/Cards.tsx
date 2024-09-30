import Card from "./Card";

const Cards = () => {
  return (
    <div className="min-h-[40vh] w-full px-10">
      <p className="my-10 text-center text-5xl font-bold">History</p>
      <div className="mb-20 grid w-full grid-cols-1 justify-start gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card cardType={"saving"} />
        <Card cardType={"expense"} />
        <Card cardType={"investment"} />
        <Card cardType={"investment"} />
        <Card cardType={"saving"} />
        <Card cardType={"expense"} />
      </div>
    </div>
  );
};
export default Cards;

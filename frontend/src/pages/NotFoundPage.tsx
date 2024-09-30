const NotFound = () => {
  return (
    <section>
      <div className="text-white">
        <div className="flex md:h-[90vh] lg:h-[80vh]">
          <div className="m-auto text-center">
            <div>
              <img src="/404.svg" alt="404" />
            </div>
            <p className="mb-4 p-2 text-sm text-[#F6009B] md:text-base">
              The stuff you were looking for does&apos;nt exist
            </p>
            <a
              href="/"
              className="rounded border border-[#F6009B] bg-transparent px-4 py-2 text-[#F6009B] shadow hover:border-transparent hover:bg-[#F6009B] hover:text-white hover:shadow-lg"
            >
              Take me home
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
export default NotFound;

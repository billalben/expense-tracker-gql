type TProps = {
  children: React.ReactNode;
};

const GridBackground = ({ children }: TProps) => {
  return (
    <div className="relative w-full bg-black text-white bg-grid-white/[0.2]">
      <div className="pointer-events-none absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      {children}
    </div>
  );
};

export default GridBackground;

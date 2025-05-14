const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-blue-500 animate-pulse opacity-75"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-blue-300 animate-ping"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

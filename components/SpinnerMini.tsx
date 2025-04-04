import ClipLoader from "react-spinners/ClipLoader";

const SpinnerMini = () => {
  return (
    <div className="flex justify-center items-center">
      <ClipLoader color="#3b82f6" size={24} aria-label="Loading Spinner" />
    </div>
  );
};

export default SpinnerMini;

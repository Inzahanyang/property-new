import ClipLoader from "react-spinners/ClipLoader";

const override = {
  display: "block",
  margin: "100px",
};

const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <ClipLoader
        color="#3b82f6"
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
      />
    </div>
  );
};

export default LoadingPage;

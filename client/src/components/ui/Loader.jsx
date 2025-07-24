import Lottie from "lottie-react";
import animationData from "../../assets/lottie/loader.json"; // Assuming your file is named loader.json

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="w-40 h-40">
        <Lottie animationData={animationData} loop={true} />
      </div>
    </div>
  );
};

export default Loader;

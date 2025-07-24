import { useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";

const WelcomeMessage = () => {
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    if (userInfo) {
      const lastVisit = localStorage.getItem("lastVisit");
      const now = new Date().getTime();

      // If they have visited before, and it was more than an hour ago
      if (lastVisit && now - parseInt(lastVisit) > 3600000) {
        toast.info(`Welcome back, ${userInfo.name}!`);
      }

      // Set the new last visit time
      localStorage.setItem("lastVisit", now.toString());
    }
  }, [userInfo]);

  return null; // This component does not render anything itself
};

export default WelcomeMessage;

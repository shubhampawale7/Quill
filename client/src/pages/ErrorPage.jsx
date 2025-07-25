import { useRouteError, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FiAlertTriangle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Oops! Something went wrong.
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          We're sorry for the inconvenience. Please try again later.
        </p>
        <p className="mt-2 font-mono text-sm text-gray-500">
          <i>{error.statusText || error.message}</i>
        </p>
        <Link to="/">
          <motion.button
            className="mt-8 rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white shadow-lg shadow-sky-500/30"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default ErrorPage;

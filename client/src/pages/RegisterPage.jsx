import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";
import { useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";
import { FiUser, FiMail, FiLock, FiLoader } from "react-icons/fi";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Watch the password field to validate against the confirm password field
  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/api/users", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      login(res.data);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  // --- Animation Variants ---
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" } },
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
        {/* --- Form Panel --- */}
        <div className="w-full p-8 md:w-1/2 lg:p-12">
          <motion.div
            className="w-full max-w-md"
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl"
            >
              Create an Account
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-2 text-gray-600 dark:text-gray-400"
            >
              Join our community of writers and readers.
            </motion.p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              {/* Name Input */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Full Name
                </label>
                <div className="relative mt-1">
                  <FiUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className="w-full rounded-lg border-gray-200 bg-gray-100 p-3 pl-10 text-gray-800 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  />
                </div>
                <AnimatePresence>
                  {errors.name && (
                    <motion.p
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      className="mt-1 text-sm text-red-500"
                    >
                      {errors.name.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Email Input */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </label>
                <div className="relative mt-1">
                  <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className="w-full rounded-lg border-gray-200 bg-gray-100 p-3 pl-10 text-gray-800 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      className="mt-1 text-sm text-red-500"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password Input */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <div className="relative mt-1">
                  <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="w-full rounded-lg border-gray-200 bg-gray-100 p-3 pl-10 text-gray-800 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  />
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      className="mt-1 text-sm text-red-500"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Confirm Password Input */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password.current ||
                        "The passwords do not match",
                    })}
                    className="w-full rounded-lg border-gray-200 bg-gray-100 p-3 pl-10 text-gray-800 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  />
                </div>
                <AnimatePresence>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      className="mt-1 text-sm text-red-500"
                    >
                      {errors.confirmPassword.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center rounded-lg bg-sky-500 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="loader"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <FiLoader className="animate-spin" />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="text"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        Create Account
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            </form>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-sky-500 hover:underline"
              >
                Log in
              </Link>
            </motion.p>
          </motion.div>
        </div>

        {/* --- Decorative Panel (for desktop) --- */}
        <div className="relative hidden w-1/2 items-center justify-center bg-gradient-to-tr from-sky-500 to-cyan-400 md:flex">
          <motion.div
            className="text-center text-white"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <h1 className="text-5xl font-extrabold tracking-tight">Quill</h1>
            <p className="mt-2 text-lg opacity-80">
              Join a community of curious minds.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

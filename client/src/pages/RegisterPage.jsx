import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import API from "../api"; // Use the new centralized API client
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await API.post("/api/users", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      login(res.data);
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed.";
      toast.error(message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">
        Register for Quill
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-sky-500 focus:border-sky-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-sky-500 focus:border-sky-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-semibold">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-sky-500 focus:border-sky-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-semibold">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
            })}
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-sky-500 focus:border-sky-500"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-sky-500 text-white p-3 rounded-lg hover:bg-sky-600 transition-colors font-semibold"
        >
          Register
        </button>
      </form>
      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-sky-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;

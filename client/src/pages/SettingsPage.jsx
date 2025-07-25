import { useForm } from "react-hook-form";
import { useContext, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";
import { useDropzone } from "react-dropzone";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";
import {
  FiUser,
  FiShield,
  FiUploadCloud,
  FiSave,
  FiLoader,
} from "react-icons/fi";

// --- Reusable Animated Input Field ---
const AnimatedInput = ({ register, name, label, errors, ...props }) => (
  <div>
    <div className="relative">
      <input
        id={name}
        {...register(name)}
        {...props}
        placeholder=" "
        className={`peer block w-full rounded-lg bg-gray-50 p-3 pt-6 text-sm placeholder-transparent focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-800 ${
          errors[name]
            ? "border-red-500"
            : "border-gray-300 dark:border-gray-600"
        }`}
      />
      <label
        htmlFor={name}
        className="pointer-events-none absolute top-3 left-3 origin-[0] -translate-y-2 scale-75 text-gray-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2 peer-focus:scale-75 dark:text-gray-400"
      >
        {label}
      </label>
    </div>
    <AnimatePresence>
      {errors[name] && (
        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {errors[name].message}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

// --- Profile Settings Form ---
const ProfileSettingsForm = ({ userInfo, updateUserInfo }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm();
  const [isUploading, setIsUploading] = useState(false);
  const avatarUrl = watch("avatarUrl");

  useEffect(() => {
    if (userInfo) {
      reset({
        name: userInfo.name,
        bio: userInfo.bio,
        avatarUrl: userInfo.avatarUrl,
      });
    }
  }, [userInfo, reset]);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("image", file);
    setIsUploading(true);
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await API.post("/api/upload", formData, config);
      setValue("avatarUrl", data.image, { shouldValidate: true });
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  // THE FIX: Refactor useDropzone to handle clicks manually
  const { getRootProps, getInputProps, open } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
    multiple: false,
    noClick: true, // We disable the default click handler
    noKeyboard: true,
  });

  const onSubmit = async (data) => {
    try {
      const { data: updatedData } = await API.put("/api/users/profile", data);
      updateUserInfo(updatedData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Avatar
        </label>
        <div className="mt-2 flex items-center gap-6">
          <div {...getRootProps()} className="relative group">
            <motion.div
              className="absolute inset-0 rounded-full bg-sky-500 blur-xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
            <div className="relative h-24 w-24 rounded-full">
              <AnimatePresence>
                {isUploading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50"
                  >
                    <FiLoader className="animate-spin text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
              <img
                src={avatarUrl || `https://i.pravatar.cc/150?u=${userInfo._id}`}
                alt="Avatar Preview"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={open}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <FiUploadCloud /> Change
          </button>
          <input {...getInputProps()} />
        </div>
      </motion.div>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <AnimatedInput
          register={register}
          name="name"
          label="Full Name"
          errors={{}}
        />
      </motion.div>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <textarea
          {...register("bio")}
          rows="4"
          placeholder="Tell us a little about yourself..."
          className="w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-sm focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-800"
        />
      </motion.div>
      <motion.button
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0 },
        }}
        type="submit"
        disabled={isSubmitting || isUploading}
        className="flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <AnimatePresence mode="wait">
          {isSubmitting || isUploading ? (
            <motion.div key="loader">
              <FiLoader className="animate-spin" />
            </motion.div>
          ) : (
            <motion.div key="icon">
              <FiSave />
            </motion.div>
          )}
        </AnimatePresence>
        <span>
          {isSubmitting || isUploading ? "Saving..." : "Save Changes"}
        </span>
      </motion.button>
    </motion.form>
  );
};

// --- Account Settings Form (now fully functional) ---
const AccountSettingsForm = ({ userInfo }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm();
  const newPassword = useRef({});
  newPassword.current = watch("newPassword", "");

  const onSubmitPassword = async (data) => {
    const promise = API.put("/api/users/profile/password", {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    toast.promise(promise, {
      loading: "Updating password...",
      success: () => {
        reset();
        return "Password updated successfully!";
      },
      error: (err) =>
        err.response?.data?.message || "Failed to update password.",
    });
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <h3 className="text-lg font-semibold">Email Address</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your email is used for logging in and notifications.
        </p>
        <input
          type="email"
          value={userInfo?.email || ""}
          disabled
          className="mt-2 w-full rounded-lg border-gray-300 bg-gray-100 p-3 text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
        />
      </motion.div>
      <motion.form
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0 },
        }}
        onSubmit={handleSubmit(onSubmitPassword)}
      >
        <h3 className="text-lg font-semibold">Change Password</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your current and new password to update.
        </p>
        <div className="mt-4 space-y-4">
          <AnimatedInput
            register={register}
            name="currentPassword"
            label="Current Password"
            type="password"
            errors={errors}
          />
          <AnimatedInput
            register={register}
            name="newPassword"
            label="New Password"
            type="password"
            errors={errors}
          />
          <AnimatedInput
            register={register}
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            errors={errors}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:bg-sky-600 disabled:opacity-70"
        >
          <AnimatePresence mode="wait">
            {isSubmitting ? (
              <motion.div key="loader">
                <FiLoader className="animate-spin" />
              </motion.div>
            ) : (
              <motion.div key="icon">
                <FiSave />
              </motion.div>
            )}
          </AnimatePresence>
          <span>{isSubmitting ? "Updating..." : "Update Password"}</span>
        </button>
      </motion.form>
    </motion.div>
  );
};

const SettingsPage = (
  {
    /* component is mostly unchanged, just structure */
  }
) => {
  const { userInfo, updateUserInfo } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Profile");
  const tabs = [
    {
      id: "Profile",
      label: "Profile",
      icon: <FiUser />,
      component: (
        <ProfileSettingsForm
          userInfo={userInfo}
          updateUserInfo={updateUserInfo}
        />
      ),
    },
    {
      id: "Account",
      label: "Account",
      icon: <FiShield />,
      component: <AccountSettingsForm userInfo={userInfo} />,
    },
  ];
  return (
    <motion.div
      className="container mx-auto max-w-5xl px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        Settings
      </h1>
      <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">
        Manage your profile and account settings.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-4">
        <nav className="flex flex-row md:flex-col md:space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors"
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="settings-highlight"
                  className="absolute inset-0 rounded-lg bg-sky-100 dark:bg-sky-500/10"
                />
              )}
              <span
                className={`relative z-10 ${
                  activeTab === tab.id ? "text-sky-600" : "text-gray-500"
                }`}
              >
                {tab.icon}
              </span>
              <span
                className={`relative z-10 ${
                  activeTab === tab.id
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </nav>
        <main className="md:col-span-3">
          <div className="rounded-2xl border border-white/10 bg-white/30 p-8 shadow-lg backdrop-blur-md dark:bg-black/30">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {tabs.find((tab) => tab.id === activeTab)?.component}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </motion.div>
  );
};

export default SettingsPage;

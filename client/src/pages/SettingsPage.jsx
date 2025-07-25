import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";
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

// --- Reusable Tab Button ---
const TabButton = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className="relative flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors focus:outline-none"
  >
    <span
      className={
        isActive
          ? "text-sky-500"
          : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"
      }
    >
      {icon}
    </span>
    <span
      className={
        isActive
          ? "text-gray-900 dark:text-white"
          : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"
      }
    >
      {label}
    </span>
    {isActive && (
      <motion.div
        layoutId="active-settings-tab"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500"
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
    )}
  </button>
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const avatarUrl = watch("avatarUrl");
  const progressCircle = useSpring(0, { stiffness: 200, damping: 30 });

  useEffect(() => {
    if (userInfo) {
      reset({
        name: userInfo.name,
        bio: userInfo.bio,
        avatarUrl: userInfo.avatarUrl,
      });
    }
  }, [userInfo, reset]);

  useEffect(() => {
    progressCircle.set(uploadProgress / 100);
  }, [uploadProgress, progressCircle]);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("image", file);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) =>
          setUploadProgress(Math.round((e.loaded * 100) / e.total)),
      };
      const { data } = await API.post("/api/upload", formData, config);
      setValue("avatarUrl", data.image, { shouldValidate: true });
      toast.success("Avatar updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
    multiple: false,
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Avatar Uploader */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Avatar
        </label>
        <div className="mt-2 flex items-center gap-6">
          <div className="relative">
            <motion.div className="h-24 w-24 rounded-full">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-current text-gray-200 dark:text-gray-700"
                  strokeWidth="5"
                  fill="none"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-current text-sky-500"
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray="282.6"
                  style={{
                    strokeDashoffset: useTransform(
                      progressCircle,
                      (value) => 282.6 * (1 - value)
                    ),
                  }}
                />
              </svg>
            </motion.div>
            <img
              src={avatarUrl || `https://i.pravatar.cc/150?u=${userInfo._id}`}
              alt="Avatar Preview"
              className="absolute inset-0 m-auto h-[82%] w-[82%] rounded-full object-cover"
            />
          </div>
          <div
            {...getRootProps()}
            className="cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <input {...getInputProps()} />
            <span className="flex items-center gap-2">
              <FiUploadCloud /> Change
            </span>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Name
        </label>
        <input
          {...register("name", { required: "Name is required" })}
          className="mt-1 w-full rounded-lg border-gray-300 bg-gray-50 p-2 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Bio
        </label>
        <textarea
          {...register("bio")}
          rows="3"
          placeholder="Tell us a little about yourself..."
          className="mt-1 w-full rounded-lg border-gray-300 bg-gray-50 p-2 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isUploading}
        className="flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
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
        <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
      </button>
    </form>
  );
};

// --- Account Settings Form (Placeholder) ---
const AccountSettingsForm = ({ userInfo }) => (
  <div className="space-y-8">
    <div>
      <h3 className="text-lg font-semibold">Email Address</h3>
      <p className="text-gray-500 dark:text-gray-400">
        Your email is used for logging in and notifications.
      </p>
      <input
        type="email"
        value={userInfo?.email || ""}
        disabled
        className="mt-2 w-full rounded-lg border-gray-300 bg-gray-100 p-2 text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
      />
    </div>
    <div>
      <h3 className="text-lg font-semibold">Change Password</h3>
      <p className="text-gray-500 dark:text-gray-400">
        For security, you will be logged out after changing your password.
      </p>
      <div className="mt-4 space-y-4">
        <input
          type="password"
          placeholder="Current Password"
          className="w-full rounded-lg border-gray-300 bg-gray-50 p-2 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700"
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full rounded-lg border-gray-300 bg-gray-50 p-2 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700"
        />
      </div>
      <button className="mt-4 rounded-lg bg-sky-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:bg-sky-600">
        Update Password
      </button>
    </div>
  </div>
);

const SettingsPage = () => {
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
      className="container mx-auto max-w-4xl px-4 py-8"
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

      {/* --- Tab Navigation --- */}
      <div className="mt-8 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              label={tab.label}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>
      </div>

      {/* --- Tab Content --- */}
      <div className="mt-8">
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
    </motion.div>
  );
};

export default SettingsPage;

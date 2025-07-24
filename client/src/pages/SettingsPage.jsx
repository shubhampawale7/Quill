import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import API from "../api"; // Use the new centralized API client
import { useDropzone } from "react-dropzone";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";
import { FiUploadCloud } from "react-icons/fi";

const SettingsPage = () => {
  const { userInfo, updateUserInfo } = useContext(AuthContext);
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [uploading, setUploading] = useState(false);

  const avatarUrl = watch("avatarUrl");

  useEffect(() => {
    // Populate form with current user info
    if (userInfo) {
      reset({
        name: userInfo.name,
        email: userInfo.email,
        bio: userInfo.bio,
        avatarUrl: userInfo.avatarUrl,
      });
    }
  }, [userInfo, reset]);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      const { data } = await API.post("/api/upload", formData, config);
      setValue("avatarUrl", data.image, { shouldValidate: true });
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      const message = error.response?.data?.message || "Image upload failed.";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block mb-1 font-semibold">Avatar</label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-sky-500 transition-colors"
          >
            <input {...getInputProps()} />
            <FiUploadCloud className="mx-auto text-3xl text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Drop your new avatar here, or click to select
            </p>
          </div>
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full mt-4 object-cover"
            />
          )}
        </div>
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            {...register("name")}
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Bio</label>
          <textarea
            {...register("bio")}
            rows="3"
            placeholder="Tell us a little about yourself..."
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 disabled:bg-gray-400"
        >
          {uploading ? "Uploading..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};
export default SettingsPage;

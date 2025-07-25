import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";
import { useDropzone } from "react-dropzone";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";
import RichTextEditor from "../components/shared/RichTextEditor";
import Loader from "../components/ui/Loader";
import {
  FiUploadCloud,
  FiImage,
  FiTag,
  FiFileText,
  FiSave,
  FiLoader,
} from "react-icons/fi";

const PostEditorPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      category: "",
      imageUrl: "",
      excerpt: "",
      content: "",
    },
  });

  const imageUrl = watch("imageUrl");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/api/categories");
        setCategories(data);
      } catch (error) {
        toast.error("Could not fetch categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditing && userInfo) {
      const fetchPost = async () => {
        setIsLoading(true);
        try {
          const { data } = await API.get(`/api/posts/${id}`);
          reset({ ...data, category: data.category?._id });
        } catch (error) {
          toast.error("Failed to fetch post data.");
          navigate("/admin");
        } finally {
          setIsLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, isEditing, reset, userInfo, navigate]);

  const createSlug = (title) =>
    title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("image", file);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      };
      const { data } = await API.post("/api/upload", formData, config);
      setValue("imageUrl", data.image, { shouldValidate: true });
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".png", ".gif", ".webp"] },
    onDrop,
    multiple: false,
  });

  const onSubmit = async (formData) => {
    const postData = { ...formData, slug: createSlug(formData.title) };
    try {
      const promise = isEditing
        ? API.put(`/api/posts/${id}`, postData)
        : API.post("/api/posts", postData);

      toast.promise(promise, {
        loading: "Saving post...",
        success: (res) => {
          navigate("/admin");
          return `Post ${isEditing ? "updated" : "created"} successfully!`;
        },
        error: (err) => err.response?.data?.message || "An error occurred.",
      });
    } catch (error) {
      // This catch is for non-API errors, toast.promise handles API errors
    }
  };

  if (isLoading && isEditing) return <Loader message="Loading editor..." />;

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="container mx-auto max-w-7xl px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* --- Header --- */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex flex-wrap items-center justify-between gap-4"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {isEditing ? "Edit Post" : "Create New Post"}
          </h1>
          <motion.button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isSubmitting || isUploading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <FiLoader className="animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  key="icon"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <FiSave />
                </motion.div>
              )}
            </AnimatePresence>
            <span>{isSubmitting ? "Saving..." : "Save Post"}</span>
          </motion.button>
        </motion.div>

        {/* --- Main Layout Grid --- */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* --- Main Content Area --- */}
          <motion.div
            variants={itemVariants}
            className="space-y-6 lg:col-span-2"
          >
            {/* Title */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                placeholder="Your post title..."
                className="mt-1 block w-full border-none bg-transparent p-0 text-2xl font-bold placeholder-gray-400 focus:ring-0 dark:placeholder-gray-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Content Editor */}
            <motion.div variants={itemVariants}>
              <Controller
                name="content"
                control={control}
                rules={{ required: "Content is required" }}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.content.message}
                </p>
              )}
            </motion.div>
          </motion.div>

          {/* --- Settings Sidebar --- */}
          <motion.div
            variants={itemVariants}
            className="space-y-6 lg:col-span-1"
          >
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <FiTag /> Category
              </h3>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full rounded-lg border-gray-300 bg-gray-50 p-2 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <FiImage /> Feature Image
              </h3>
              <div
                {...getRootProps()}
                className={`relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  isDragActive
                    ? "border-sky-500 bg-sky-50 dark:bg-sky-500/10"
                    : "border-gray-300 dark:border-gray-600 hover:border-sky-400"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center">
                  <FiUploadCloud className="mb-2 h-10 w-10 text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isDragActive
                      ? "Drop the image here!"
                      : "Drag & drop or click to upload"}
                  </p>
                </div>
              </div>
              <AnimatePresence>
                {isUploading && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4"
                  >
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <motion.div
                        className="absolute left-0 top-0 h-full rounded-full bg-sky-500"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {imageUrl && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4"
                >
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </motion.div>
              )}
              <input
                type="hidden"
                {...register("imageUrl", { required: "An image is required" })}
              />
              {errors.imageUrl && !imageUrl && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <FiFileText /> Excerpt
              </h3>
              <textarea
                {...register("excerpt", { required: "An excerpt is required" })}
                rows="4"
                placeholder="A short summary of your post..."
                className="w-full rounded-lg border-gray-300 bg-gray-50 p-2 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700"
              ></textarea>
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.excerpt.message}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
};

export default PostEditorPage;

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
import PostCard from "../components/shared/PostCard";
import {
  FiUploadCloud,
  FiImage,
  FiTag,
  FiFileText,
  FiSave,
  FiLoader,
  FiSettings,
  FiX,
} from "react-icons/fi";

// --- Slide-out Settings Panel ---
const SettingsPanel = ({
  isOpen,
  onClose,
  register,
  errors,
  categories,
  getRootProps,
  getInputProps,
  isDragActive,
  isUploading,
  uploadProgress,
  imageUrl,
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 z-50 h-full w-full max-w-md border-l border-white/10 bg-white/50 shadow-2xl backdrop-blur-xl dark:bg-black/50"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-800">
            <h2 className="text-xl font-bold">Post Settings</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <FiX />
            </button>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            <div>
              <h3 className="mb-2 text-sm font-semibold flex items-center gap-2">
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

            <div>
              <h3 className="mb-2 text-sm font-semibold flex items-center gap-2">
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
                <FiUploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  {isDragActive ? "Drop it!" : "Drag, drop, or click to upload"}
                </p>
              </div>
              {isUploading && (
                <div className="mt-2 h-1 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <motion.div
                    className="h-1 rounded-full bg-sky-500"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="mt-4 w-full rounded-lg"
                />
              )}
              {errors.imageUrl && !imageUrl && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold flex items-center gap-2">
                <FiFileText /> Excerpt
              </h3>
              <textarea
                {...register("excerpt", { required: "An excerpt is required" })}
                rows="4"
                placeholder="A short summary..."
                className="w-full rounded-lg border-gray-300 bg-gray-50 p-2 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700"
              ></textarea>
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.excerpt.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const PostEditorPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  const imageUrl = watch("imageUrl"); // This line was missing
  const watchedValues = watch();

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
      ? title
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "")
      : "";

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
    accept: { "image/*": [] },
    onDrop,
    multiple: false,
  });

  const onSubmit = async (formData) => {
    const postData = { ...formData, slug: createSlug(formData.title) };
    const promise = isEditing
      ? API.put(`/api/posts/${id}`, postData)
      : API.post("/api/posts", postData);

    toast.promise(promise, {
      loading: "Saving post...",
      success: () => {
        navigate("/admin");
        return `Post ${isEditing ? "updated" : "created"} successfully!`;
      },
      error: (err) => err.response?.data?.message || "An error occurred.",
    });
  };

  if (isLoading && isEditing) return <Loader message="Loading editor..." />;

  const livePreviewPost = {
    ...watchedValues,
    author: userInfo,
    category: categories.find((c) => c._id === watchedValues.category),
    createdAt: new Date().toISOString(),
    likes: [],
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl">
          <input
            {...register("title", { required: "Title is required" })}
            placeholder="Your Masterpiece Title..."
            className="w-full border-none bg-transparent text-4xl font-extrabold tracking-tight text-gray-900 placeholder-gray-400 focus:ring-0 dark:text-white dark:placeholder-gray-600 md:text-5xl"
          />
          {errors.title && (
            <p className="mt-2 text-red-500">{errors.title.message}</p>
          )}

          <div className="mt-8">
            <Controller
              name="content"
              control={control}
              rules={{ required: "Content is required" }}
              render={({ field }) => (
                <RichTextEditor value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.content && (
              <p className="mt-2 text-sm text-red-500">
                {errors.content.message}
              </p>
            )}
          </div>

          <input
            type="hidden"
            {...register("imageUrl", {
              required: "A feature image is required",
            })}
          />
        </form>
      </main>

      <aside className="hidden w-full max-w-sm flex-col border-l border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 lg:flex">
        <h3 className="text-lg font-bold">Live Preview</h3>
        <p className="text-sm text-gray-500">
          See how your post card will look.
        </p>
        <div className="mt-4 flex-1">
          <AnimatePresence>
            <motion.div
              key={JSON.stringify(livePreviewPost)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <PostCard post={livePreviewPost} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-auto flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200"
          >
            <FiSettings size={22} />
          </button>
          <motion.button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || isUploading}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-3 font-semibold text-white shadow-lg shadow-sky-500/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
              {isSubmitting || isUploading
                ? "Saving..."
                : isEditing
                ? "Update Post"
                : "Publish Post"}
            </span>
          </motion.button>
        </div>
      </aside>

      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3 lg:hidden">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg dark:bg-gray-800"
        >
          <FiSettings size={24} />
        </button>
        <button
          onClick={handleSubmit(onSubmit)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg"
        >
          <FiSave size={24} />
        </button>
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        {...{
          register,
          errors,
          categories,
          getRootProps,
          getInputProps,
          isDragActive,
          isUploading,
          uploadProgress,
          imageUrl,
          setValue,
        }}
      />
    </div>
  );
};

export default PostEditorPage;

import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import API from "../api"; // Use the new centralized API client
import { useDropzone } from "react-dropzone";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";
import RichTextEditor from "../components/shared/RichTextEditor";
import { FiUploadCloud } from "react-icons/fi";

const PostEditorPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);

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
        setLoading(true);
        try {
          const { data } = await API.get(`/api/posts/${id}`);
          reset({ ...data, category: data.category?._id });
        } catch (error) {
          toast.error("Failed to fetch post data.");
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, isEditing, reset, userInfo]);

  const createSlug = (title) => {
    if (!title) return "";
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      // The API client adds the auth token automatically, but we still need to set the Content-Type for file uploads.
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await API.post("/api/upload", formData, config);
      setValue("imageUrl", data.image, { shouldValidate: true });
      toast.success("Image uploaded successfully");
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

  const onSubmit = async (formData) => {
    setLoading(true);
    const postData = { ...formData, slug: createSlug(formData.title) };

    try {
      if (isEditing) {
        await API.put(`/api/posts/${id}`, postData);
        toast.success("Post updated successfully!");
      } else {
        await API.post("/api/posts", postData);
        toast.success("Post created successfully!");
      }
      navigate("/admin");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "An error occurred while saving the post.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <p>Loading editor...</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">
        {isEditing ? "Edit Post" : "Create New Post"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Category</label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Feature Image</label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-sky-500 transition-colors"
          >
            <input {...getInputProps()} />
            <FiUploadCloud className="mx-auto text-4xl text-gray-400 mb-2" />
            {uploading ? (
              <p>Uploading...</p>
            ) : (
              <p>Drag 'n' drop an image here, or click to select one</p>
            )}
          </div>
          {imageUrl && (
            <div className="mt-4">
              <p className="text-sm mb-2">Image Preview:</p>
              <img
                src={imageUrl}
                alt="Preview"
                className="w-48 h-auto rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
        <input
          type="hidden"
          {...register("imageUrl", { required: "An image is required" })}
        />
        {errors.imageUrl && !imageUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
        )}

        <div>
          <label className="block mb-1 font-semibold">Excerpt</label>
          <textarea
            {...register("excerpt", { required: "An excerpt is required" })}
            rows="3"
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800"
          ></textarea>
          {errors.excerpt && (
            <p className="text-red-500 text-sm mt-1">
              {errors.excerpt.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Content</label>
          <Controller
            name="content"
            control={control}
            rules={{ required: "Content is required" }}
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading || uploading ? "Saving..." : "Save Post"}
        </button>
      </form>
    </div>
  );
};

export default PostEditorPage;

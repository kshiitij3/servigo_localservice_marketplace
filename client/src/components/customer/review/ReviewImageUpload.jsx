import { useState } from "react";
import { toast } from "react-hot-toast";
import { uploadMedia } from "../../../services/upload.service";
import { HiPhoto, HiXMark } from "react-icons/hi2";

const ReviewImageUpload = ({ images, setImages }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images are allowed");
      return;
    }

    try {
      setUploading(true);
      const uploaded = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }

        const response = await uploadMedia(file);

        if (response?.data) {
          uploaded.push({
            url: response.data.url,
            publicId: response.data.publicId || "",
          });
        }
      }

      setImages((prev) => [...prev, ...uploaded]);
    } catch (error) {
      console.error("Review image upload failed:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
      /* Allows the same file to be selected again. */
      e.target.value = "";
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Add photos{" "}
        <span className="text-gray-400 font-normal">(optional, max 5)</span>
      </label>

      <label
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 text-sm font-medium text-gray-600 hover:border-[#1a7a6e] hover:text-[#1a7a6e] transition cursor-pointer ${
          uploading ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <HiPhoto className="w-4 h-4" />
        {uploading ? "Uploading..." : "Choose photos"}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
          {images.map((image, index) => (
            <div
              key={`${image.publicId}-${index}`}
              className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-xs"
            >
              <img
                src={image.url}
                alt={`Review ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
                aria-label="Remove image"
              >
                <HiXMark className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewImageUpload;

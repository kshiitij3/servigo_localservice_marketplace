import api from "./api";

export const uploadMedia = async (
  file,
  onUploadProgress
) => {
  const formData = new FormData();

  formData.append("file", file);

  return await api.post(
    "/upload/media",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },

      onUploadProgress,
    }
  );
};

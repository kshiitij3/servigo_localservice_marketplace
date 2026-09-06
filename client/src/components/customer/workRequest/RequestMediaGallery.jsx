import { HiPaperClip } from "react-icons/hi2";

const RequestMediaGallery = ({ media }) => {
  if (!media || media.length === 0) return null;

  return (
    <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <HiPaperClip className="w-5 h-5 text-[#1a7a6e]" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          Photos & Videos ({media.length})
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {media.map((item, index) => {
          const isVideo = item.mediaType === "video";
          return (
            <div
              key={item.publicId || item.url || index}
              className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs relative group"
            >
              {isVideo ? (
                <video
                  src={item.url}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={item.url}
                  alt={`Service request attachment ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RequestMediaGallery;

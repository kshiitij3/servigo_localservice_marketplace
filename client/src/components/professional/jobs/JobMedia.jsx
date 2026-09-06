import { useState } from "react";
import { HiPhoto, HiFilm, HiXMark } from "react-icons/hi2";

const JobMedia = ({ media = [] }) => {
  const [selectedPreview, setSelectedPreview] = useState(null);

  if (!media || !media.length) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <HiPhoto className="w-5 h-5 text-[#1a7a6e]" />
          <span>Photos & Videos</span>
        </h2>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-[#1a7a6e] border border-teal-200/60">
          {media.length} file{media.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-4">
        {media.map((item, index) => {
          const isVideo =
            item.mediaType === "video" ||
            (typeof item.url === "string" &&
              item.url.match(/\.(mp4|webm|mov|ogg)$/i));

          return (
            <div
              key={item.publicId || item.url || index}
              onClick={() => setSelectedPreview(item)}
              className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200/70 shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              {isVideo ? (
                <div className="w-full h-full relative">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 text-[#1a7a6e] flex items-center justify-center shadow-md">
                      <HiFilm className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={`Job media ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox / Modal for preview */}
      {selectedPreview && (
        <div
          onClick={() => setSelectedPreview(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[85vh] bg-black rounded-2xl overflow-hidden shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setSelectedPreview(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition cursor-pointer"
            >
              <HiXMark className="w-5 h-5" />
            </button>

            {selectedPreview.mediaType === "video" ||
            (typeof selectedPreview.url === "string" &&
              selectedPreview.url.match(/\.(mp4|webm|mov|ogg)$/i)) ? (
              <video
                src={selectedPreview.url}
                controls
                autoPlay
                className="max-h-[80vh] w-auto max-w-full rounded-2xl"
              />
            ) : (
              <img
                src={selectedPreview.url}
                alt="Enlarged job media"
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-2xl"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobMedia;

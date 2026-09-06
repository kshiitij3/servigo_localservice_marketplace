import { HiMapPin } from "react-icons/hi2";
import LocationMap from "../../map/LocationMap";

const RequestLocationCard = ({ location, visibilityRadius }) => {
  const coordinates = location?.coordinates || [];
  const hasCoordinates =
    coordinates.length === 2 &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number";

  // Backend stores [longitude, latitude]
  const longitude = hasCoordinates ? coordinates[0] : null;
  const latitude = hasCoordinates ? coordinates[1] : null;

  return (
    <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <HiMapPin className="w-5 h-5 text-[#1a7a6e]" />
            <span>Service Location</span>
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Exact location specified for service delivery
          </p>
        </div>

        {visibilityRadius && (
          <span className="self-start sm:self-auto text-xs font-medium bg-teal-50 text-[#1a7a6e] px-3 py-1 rounded-full border border-teal-100">
            Visible within {visibilityRadius} km
          </span>
        )}
      </div>

      {/* Leaflet Map */}
      <div className="mt-4">
        {hasCoordinates ? (
          <LocationMap latitude={latitude} longitude={longitude} />
        ) : (
          <div className="h-48 rounded-2xl bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 text-sm">
            <HiMapPin className="w-8 h-8 text-gray-300 mb-1" />
            <span>Location coordinates not available</span>
          </div>
        )}
      </div>

      {/* Address details grid */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50/80 rounded-xl border border-gray-100 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Address
          </p>
          <p className="font-medium text-gray-800 mt-1">
            {location?.address || "Not specified"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            City
          </p>
          <p className="font-medium text-gray-800 mt-1">
            {location?.city || "Not specified"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            State
          </p>
          <p className="font-medium text-gray-800 mt-1">
            {location?.state || "Not specified"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Pincode
          </p>
          <p className="font-medium text-gray-800 mt-1">
            {location?.pincode || "Not specified"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default RequestLocationCard;

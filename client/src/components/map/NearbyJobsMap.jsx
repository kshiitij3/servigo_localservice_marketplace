import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

// Fix default Leaflet marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom Modern Pin for Professional's Location
const userLocationIcon = L.divIcon({
  className: "custom-user-marker",
  html: `
    <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(26, 122, 110, 0.25); animation: pulse 2s infinite;"></div>
      <div style="width: 20px; height: 20px; border-radius: 50%; background: #1a7a6e; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.25);"></div>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

// Custom Job Marker Icon
const jobMarkerIcon = L.divIcon({
  className: "custom-job-marker",
  html: `
    <div style="background: #e76f51; color: #ffffff; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; border: 2.5px solid #ffffff; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
      🔧
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const NearbyJobsMap = ({
  jobs = [],
  latitude,
  longitude,
}) => {
  const navigate = useNavigate();

  if (!latitude || !longitude) return null;

  const professionalPosition = [latitude, longitude];

  return (
    <div className="h-[420px] sm:h-[480px] rounded-2xl overflow-hidden border border-gray-200/90 shadow-xs relative z-0">
      <MapContainer
        center={professionalPosition}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Current Professional Position */}
        <Marker position={professionalPosition} icon={userLocationIcon}>
          <Popup>
            <div className="p-1 text-center">
              <span className="text-[11px] font-bold text-[#1a7a6e] uppercase tracking-wider block">
                You Are Here
              </span>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">
                Current Location
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Nearby Job Markers */}
        {jobs.map((job) => {
          const coordinates = job.location?.coordinates;

          if (
            !Array.isArray(coordinates) ||
            coordinates.length !== 2
          ) {
            return null;
          }

          // GeoJSON in MongoDB: [longitude, latitude]
          // Leaflet expects: [latitude, longitude]
          const [jobLongitude, jobLatitude] = coordinates;

          if (typeof jobLatitude !== "number" || typeof jobLongitude !== "number") {
            return null;
          }

          const budget = job.budget;
          const budgetText =
            budget?.min && budget?.max
              ? `₹${Number(budget.min).toLocaleString("en-IN")} - ₹${Number(
                  budget.max
                ).toLocaleString("en-IN")}`
              : budget?.max
              ? `Up to ₹${Number(budget.max).toLocaleString("en-IN")}`
              : "Budget specified";

          return (
            <Marker
              key={job._id}
              position={[jobLatitude, jobLongitude]}
              icon={jobMarkerIcon}
            >
              <Popup>
                <div className="min-w-[180px] p-1">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-teal-50 text-[#1a7a6e] text-[10px] font-bold uppercase mb-1">
                    {job.category?.name || "Service Lead"}
                  </span>

                  <p className="font-bold text-gray-900 text-sm leading-tight">
                    {job.title}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    📍 {job.location?.city || "Nearby location"}
                  </p>

                  <p className="text-xs font-bold text-[#1a7a6e] mt-1.5">
                    {budgetText}
                  </p>

                  <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => navigate(`/professional/jobs/${job._id}`)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[11px] text-center cursor-pointer transition"
                    >
                      Details
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/professional/jobs/${job._id}/quote`)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#1a7a6e] hover:bg-[#155f55] text-white font-bold text-[11px] text-center cursor-pointer transition shadow-xs"
                    >
                      Quote
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default NearbyJobsMap;

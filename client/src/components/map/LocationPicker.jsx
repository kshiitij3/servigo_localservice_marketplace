import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HiMapPin, HiCheckCircle } from "react-icons/hi2";

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

const DEFAULT_POSITION = [20.5937, 78.9629]; // India default

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(event) {
      onLocationSelect(
        event.latlng.lat,
        event.latlng.lng
      );
    },
  });

  return null;
};

const MapCenterUpdater = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);

  return null;
};

const LocationPicker = ({ value, onChange }) => {
  const [gettingLocation, setGettingLocation] = useState(false);

  const position =
    value?.latitude && value?.longitude
      ? [value.latitude, value.longitude]
      : DEFAULT_POSITION;

  const handleLocationSelect = (latitude, longitude) => {
    onChange({
      ...value,
      latitude,
      longitude,
    });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;

        handleLocationSelect(latitude, longitude);
        setGettingLocation(false);
      },
      (error) => {
        console.error("Location error:", error);
        alert(
          "Unable to get your location. Please allow location access."
        );
        setGettingLocation(false);
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#1a7a6e] flex items-center justify-center shrink-0 border border-teal-100 shadow-xs">
            <HiMapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base">
              Service Location Pin
            </h3>
            <p className="text-xs text-gray-500">
              Click anywhere on the map or tap the location button below.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={gettingLocation}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1a7a6e] to-[#2a9d8f] text-white text-xs sm:text-sm font-medium hover:from-[#145f56] hover:to-[#1a7a6e] transition-all shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer active:scale-98 shrink-0"
        >
          <HiMapPin className={`w-4 h-4 ${gettingLocation ? "animate-spin" : ""}`} />
          <span>{gettingLocation ? "Detecting location..." : "Use My Current Location"}</span>
        </button>
      </div>

      {/* Map Container */}
      <div className="relative h-[340px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner group">
        <MapContainer
          center={position}
          zoom={value?.latitude ? 15 : 5}
          scrollWheelZoom
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onLocationSelect={handleLocationSelect} />
          <MapCenterUpdater position={position} />

          {value?.latitude && value?.longitude && (
            <Marker position={position} />
          )}
        </MapContainer>

        {/* Floating helper hint */}
        {!value?.latitude && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-900/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full shadow-lg pointer-events-none z-[400] flex items-center gap-1.5">
            <HiMapPin className="w-3.5 h-3.5 text-teal-400" />
            <span>Tap on the map to place location pin</span>
          </div>
        )}
      </div>

      {/* Selected Coordinates Status */}
      {value?.latitude && value?.longitude ? (
        <div className="rounded-xl bg-teal-50/70 border border-teal-100 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-teal-900">
          <div className="flex items-center gap-2">
            <HiCheckCircle className="w-5 h-5 text-[#1a7a6e] shrink-0" />
            <span className="font-semibold text-gray-800">Pin Location Set</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-gray-600">
            <span className="bg-white px-2.5 py-1 rounded-md border border-teal-100">
              Lat: <strong className="text-gray-900">{value.latitude.toFixed(6)}</strong>
            </span>
            <span className="bg-white px-2.5 py-1 rounded-md border border-teal-100">
              Lng: <strong className="text-gray-900">{value.longitude.toFixed(6)}</strong>
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>Location pin is required for service requests.</span>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;

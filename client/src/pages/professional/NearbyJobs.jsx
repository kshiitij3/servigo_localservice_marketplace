import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  HiMapPin,
  HiArrowPath,
  HiExclamationTriangle,
  HiMagnifyingGlass,
  HiSparkles,
  HiViewColumns,
  HiMap,
} from "react-icons/hi2";

import { getNearbyWorkRequests } from "../../services/workRequest.service";
import { getCategories } from "../../services/category.service";
import { updateProfessionalLocation } from "../../services/professional.service";

import ProfessionalNavbar from "../../components/professional/ProfessionalNavbar";
import JobCard from "../../components/professional/jobs/JobCard";
import JobFilters from "../../components/professional/jobs/JobFilters";
import NearbyJobsMap from "../../components/map/NearbyJobsMap";

// Haversine formula for calculating distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const NearbyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [radius, setRadius] = useState(25);
  const [categoryId, setCategoryId] = useState("");
  const [showMap, setShowMap] = useState(true);

  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      setLoadingLocation(false);
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const nextLatitude = position.coords.latitude;
        const nextLongitude = position.coords.longitude;

        setLatitude(nextLatitude);
        setLongitude(nextLongitude);

        try {
          await updateProfessionalLocation({
            type: "Point",
            coordinates: [nextLongitude, nextLatitude],
            address: "",
            city: "",
            state: "",
            pincode: "",
          });
        } catch (error) {
          console.error("Failed to save professional location:", error);
        }

        setLoadingLocation(false);
      },
      (error) => {
        console.error("Location error:", error);
        toast.error("Please allow location access to discover nearby jobs.");
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 300000,
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        const raw = response?.data;
        const list = Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw)
          ? raw
          : [];
        setCategories(list);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (latitude === null || longitude === null) {
      return;
    }

    const loadJobs = async () => {
      try {
        setLoadingJobs(true);

        const params = {
          latitude,
          longitude,
        };

        if (categoryId) {
          params.categories = categoryId;
        }

        const response = await getNearbyWorkRequests(params);
        const raw = response?.data;
        const list = Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.requests)
          ? raw.requests
          : Array.isArray(raw)
          ? raw
          : [];

        setJobs(list);
      } catch (error) {
        console.error("Failed to load nearby jobs:", error);
        toast.error(error?.response?.data?.message || error?.message || "Failed to load nearby jobs.");
        setJobs([]);
      } finally {
        setLoadingJobs(false);
      }
    };

    loadJobs();
  }, [latitude, longitude, categoryId]);

  // Attach distance and filter by UI radius preference
  const processedJobs = useMemo(() => {
    return jobs
      .map((job) => {
        const coords = job.location?.coordinates;
        let distanceKm = null;
        if (Array.isArray(coords) && coords.length === 2 && latitude && longitude) {
          const [jobLon, jobLat] = coords;
          distanceKm = calculateDistance(latitude, longitude, jobLat, jobLon);
        }
        return {
          ...job,
          distanceKm,
        };
      })
      .filter((job) => {
        if (job.distanceKm === null) return true;
        return job.distanceKm <= radius;
      })
      .sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
  }, [jobs, latitude, longitude, radius]);

  const handleResetFilters = () => {
    setRadius(25);
    setCategoryId("");
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <ProfessionalNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Hero Section */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Opportunity Radar
              </p>

              <h1 className="text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">
                Nearby Service Jobs
              </h1>

              <p className="text-gray-500 text-sm mt-1.5">
                Discover active customer service requests near your current location.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-xs hover:bg-gray-50 transition cursor-pointer shadow-xs"
              >
                {showMap ? <HiViewColumns className="w-4 h-4" /> : <HiMap className="w-4 h-4 text-[#1a7a6e]" />}
                <span>{showMap ? "Hide Map" : "Show Map"}</span>
              </button>

              <button
                type="button"
                onClick={getCurrentLocation}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200/80 text-[#1a7a6e] font-semibold text-xs hover:bg-teal-100/70 transition cursor-pointer"
              >
                <HiArrowPath className={`w-4 h-4 ${loadingLocation ? "animate-spin" : ""}`} />
                <span>Refresh Location</span>
              </button>
            </div>
          </div>
        </section>

        {/* Location Status Bar */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-5 mb-8 shadow-xs">
          {loadingLocation ? (
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-[#1a7a6e] border-t-transparent rounded-full animate-spin shrink-0" />
              <span>Detecting your current GPS coordinates...</span>
            </div>
          ) : latitude !== null && longitude !== null ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <HiMapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    GPS Locked
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Scanning Radius: {radius} km</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <HiExclamationTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    Location permission required
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    We match service requests based on real-time proximity.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={getCurrentLocation}
                className="px-4 py-2 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-semibold text-xs shadow-xs transition cursor-pointer"
              >
                Enable Location Access
              </button>
            </div>
          )}
        </section>

        {/* Main Grid: Sidebar + Jobs Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <JobFilters
              radius={radius}
              setRadius={setRadius}
              categoryId={categoryId}
              setCategoryId={setCategoryId}
              categories={categories}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Jobs Listing & Map Column */}
          <section className="lg:col-span-3 space-y-6">
            {/* Map Preview */}
            {showMap && latitude !== null && longitude !== null && (
              <div>
                <NearbyJobsMap
                  jobs={processedJobs}
                  latitude={latitude}
                  longitude={longitude}
                />
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span>Available Leads</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-[#1a7a6e] font-bold">
                    {processedJobs.length}
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Showing work requests within {radius} km of your position
                </p>
              </div>
            </div>

            {/* Loading Skeleton */}
            {loadingJobs && (
              <div className="bg-white border border-gray-200/80 rounded-2xl p-12 text-center shadow-xs">
                <div className="w-8 h-8 border-3 border-[#1a7a6e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-700">
                  Scanning for nearby requests...
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Querying verified customer postings in your area
                </p>
              </div>
            )}

            {/* Empty State */}
            {!loadingJobs && processedJobs.length === 0 && (
              <div className="bg-white border border-gray-200/80 rounded-2xl p-12 text-center shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#1a7a6e] flex items-center justify-center mx-auto mb-4">
                  <HiMagnifyingGlass className="w-7 h-7" />
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  No nearby jobs found
                </h3>

                <p className="text-sm text-gray-500 mt-1.5 max-w-sm mx-auto">
                  There are currently no active service requests within {radius} km. Try expanding your search radius or selecting another category.
                </p>

                <div className="flex items-center justify-center gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => setRadius(50)}
                    className="px-4 py-2 rounded-xl bg-[#1a7a6e] hover:bg-[#155f55] text-white font-semibold text-xs shadow-xs transition cursor-pointer"
                  >
                    Expand Radius to 50 km
                  </button>

                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-xs hover:bg-gray-50 transition cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {/* Jobs Cards Grid */}
            {!loadingJobs && processedJobs.length > 0 && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {processedJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    distanceKm={job.distanceKm}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default NearbyJobs;

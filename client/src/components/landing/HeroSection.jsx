import ServiceSearch from "./ServiceSearch";
import { FaArrowRight } from "react-icons/fa6";
import heroBg from "../../assets/hero-bg.jpg";

const HeroSection = (props) => (
  <section className="relative overflow-hidden bg-gray-950 px-5 pb-20 pt-16 sm:pb-28 sm:pt-24 min-h-[640px] flex items-center">
    {/* Background Image */}
    <div className="absolute inset-0">
      <img
        src={heroBg}
        alt="Servigo Local Service Professionals"
        className="w-full h-full object-cover object-center brightness-[1.05]"
      />
      {/* Softer, brighter gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/70 via-gray-950/50 to-gray-950/20 sm:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-gray-950/15" />
    </div>

    {/* Hero Content */}
    <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] w-full">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 backdrop-blur-md mb-4">
          <span className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-pulse" />
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-300">
            Services made simple
          </p>
        </div>

        <h1 className="max-w-xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-sm">
          Get the help you need, from{" "}
          <span className="text-[#2dd4bf]">trusted professionals.</span>
        </h1>

        <p className="mt-6 max-w-lg text-lg leading-8 text-gray-200 drop-shadow-xs">
          Find reliable professionals near you for repairs, maintenance, and everyday services.
        </p>

        <button
          onClick={props.onPostRequest}
          className="mt-8 inline-flex items-center rounded-xl bg-[#1a7a6e] hover:bg-[#145f56] px-7 py-4 font-bold text-white shadow-xl shadow-teal-950/30 transition active:scale-[0.98] cursor-pointer"
        >
          <span>Post a Service Request</span>
          <FaArrowRight className="ml-2.5" size={14} />
        </button>
      </div>

      <div className="w-full">
        <ServiceSearch {...props} />
      </div>
    </div>
  </section>
);

export default HeroSection;


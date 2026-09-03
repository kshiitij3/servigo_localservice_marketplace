import ServiceSearch from "./ServiceSearch";
import { FaArrowRight } from "react-icons/fa6";

const HeroSection = (props) => <section className="bg-[#f0faf8] px-5 pb-16 pt-16 sm:pb-24 sm:pt-24"><div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]"><div><p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#1a7a6e]">Services made simple</p><h1 className="max-w-xl text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-950 sm:text-6xl">Get the help you need, from <span className="text-[#1a7a6e]">trusted professionals.</span></h1><p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">Find reliable professionals near you for repairs, maintenance, and everyday services.</p><button onClick={props.onPostRequest} className="mt-8 inline-flex items-center rounded-lg bg-[#1a7a6e] px-6 py-3.5 font-bold text-white shadow-lg shadow-teal-900/10 hover:bg-[#145f56]">Post a Service Request <FaArrowRight className="ml-2" size={14} /></button></div><ServiceSearch {...props} /></div></section>;

export default HeroSection;

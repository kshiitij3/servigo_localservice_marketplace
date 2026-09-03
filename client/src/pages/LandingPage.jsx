import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaBars, FaBolt, FaBroom, FaBrush, FaCheck, FaChevronRight, FaLocationDot, FaMagnifyingGlass, FaPlug, FaScrewdriverWrench, FaSnowflake, FaXmark } from "react-icons/fa6";
import { getCategories } from "../services/category.service";

const icons = { plumbing: FaScrewdriverWrench, electrician: FaBolt, electrical: FaBolt, "ac-repair": FaSnowflake, ac: FaSnowflake, cleaning: FaBroom, carpenter: FaScrewdriverWrench, painting: FaBrush, appliance: FaPlug, default: FaScrewdriverWrench };
const steps = [["01", "Post Request", "Tell us what service you need"], ["02", "Get Quotes", "Professionals send you their prices"], ["03", "Choose Professional", "Compare and select the best one"], ["04", "Pay Securely", "Complete the job and pay securely"]];
const features = [[FaLocationDot, "Local Professionals", "Get matched with professionals based on location and service radius."], [FaChevronRight, "Multiple Quotes", "Compare offers from professionals instead of accepting the first one."], [FaCheck, "Secure Payments", "Pay through Servigo's integrated payment system with confidence."], [FaArrowRight, "Transparent Process", "Request, quote, booking, work, and payment in one clear flow."]];

const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getCategories().then((response) => {
      if (mounted) setCategories(response?.data?.data || []);
    }).catch(() => {
      if (mounted) setCategories([]);
    }).finally(() => {
      if (mounted) setCategoriesLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const goToLogin = () => { closeMenu(); navigate("/login"); };
  const goToRegister = () => { closeMenu(); navigate("/register"); };
  const findProfessionals = () => navigate("/login", { state: { service, location } });
  const useCurrentLocation = () => {
    if (!navigator.geolocation) return setLocation("Location unavailable");
    navigator.geolocation.getCurrentPosition(() => setLocation("Current location"), () => setLocation("Unable to get location"));
  };

  return <div className="min-h-screen bg-white text-gray-900 font-['Inter']">
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-6">
        <button onClick={() => navigate("/")} className="text-xl font-extrabold tracking-[0.2em] text-[#1a7a6e]">SERVIGO</button>
        <div className="hidden items-center gap-9 text-sm font-medium text-gray-600 md:flex"><a href="#services" className="hover:text-[#1a7a6e]">Find Services</a><a href="#how-it-works" className="hover:text-[#1a7a6e]">How It Works</a><a href="#about" className="hover:text-[#1a7a6e]">About</a></div>
        <div className="hidden items-center gap-3 md:flex"><button onClick={goToLogin} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#1a7a6e]">Login</button><button onClick={goToRegister} className="rounded-lg bg-[#1a7a6e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#145f56]">Register</button></div>
        <button aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden">{menuOpen ? <FaXmark size={20} /> : <FaBars size={20} />}</button>
      </div>
      {menuOpen && <div className="space-y-1 border-t border-gray-100 bg-white px-5 pb-5 pt-3 md:hidden"><a onClick={closeMenu} href="#services" className="block py-2 font-medium text-gray-700">Find Services</a><a onClick={closeMenu} href="#how-it-works" className="block py-2 font-medium text-gray-700">How It Works</a><a onClick={closeMenu} href="#about" className="block py-2 font-medium text-gray-700">About</a><button onClick={goToLogin} className="block w-full py-2 text-left font-medium text-gray-700">Login</button><button onClick={goToRegister} className="mt-2 w-full rounded-lg bg-[#1a7a6e] py-2.5 font-semibold text-white">Register</button></div>}
    </nav>

    <main>
      <section className="bg-[#f0faf8] px-5 pb-16 pt-16 sm:pb-24 sm:pt-24"><div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]"><div><p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#1a7a6e]">Services made simple</p><h1 className="max-w-xl text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-950 sm:text-6xl">Get the help you need, from <span className="text-[#1a7a6e]">trusted professionals.</span></h1><p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">Find reliable professionals near you for repairs, maintenance, and everyday services.</p><button onClick={goToLogin} className="mt-8 inline-flex items-center rounded-lg bg-[#1a7a6e] px-6 py-3.5 font-bold text-white shadow-lg shadow-teal-900/10 hover:bg-[#145f56]">Post a Service Request <FaArrowRight className="ml-2" size={14} /></button></div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xl sm:p-7"><p className="mb-5 text-lg font-bold">Find the right professional</p><label className="mb-2 block text-sm font-medium text-gray-600">What service do you need?</label><div className="mb-5 flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 focus-within:border-[#1a7a6e] focus-within:ring-2 focus-within:ring-[#1a7a6e]/20"><FaMagnifyingGlass className="shrink-0 text-gray-400" aria-hidden="true" /><input value={service} onChange={(e) => setService(e.target.value)} placeholder="e.g. Plumbing or Cleaning" className="w-full outline-none" /></div><label className="mb-2 block text-sm font-medium text-gray-600">Where do you need it?</label><div className="mb-2 flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 focus-within:border-[#1a7a6e] focus-within:ring-2 focus-within:ring-[#1a7a6e]/20"><FaLocationDot className="shrink-0 text-gray-400" aria-hidden="true" /><input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or neighbourhood" className="w-full outline-none" /></div><button onClick={useCurrentLocation} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1a7a6e] hover:underline"><FaLocationDot size={13} /> Use my current location</button><button onClick={findProfessionals} className="inline-flex w-full items-center justify-center rounded-lg bg-[#1a7a6e] py-3.5 font-bold text-white hover:bg-[#145f56]">Find Professionals <FaArrowRight className="ml-2" size={14} /></button></div>
      </div></section>

      <section id="how-it-works" className="px-5 py-20 sm:py-24"><div className="mx-auto max-w-6xl"><p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-[#1a7a6e]">Simple from start to finish</p><h2 className="mt-3 text-center text-3xl font-extrabold sm:text-4xl">How Servigo Works</h2><div className="mt-14 grid gap-8 md:grid-cols-4">{steps.map(([number, title, desc]) => <div key={number} className="text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f5f3] text-lg font-extrabold text-[#1a7a6e]">{number}</div><h3 className="mt-5 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-500">{desc}</p></div>)}</div></div></section>

      <section id="services" className="bg-gray-50 px-5 py-20 sm:py-24"><div className="mx-auto max-w-6xl"><h2 className="text-3xl font-extrabold sm:text-4xl">Popular Services</h2><p className="mt-3 text-gray-600">Start with a service category and find help nearby.</p>{categoriesLoading ? <p className="mt-10 text-gray-500">Loading services...</p> : categories.length ? <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{categories.slice(0, 6).map((category) => { const Icon = icons[category.slug] || icons.default; return <button key={category._id || category.slug} onClick={() => { setService(category.name); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#1a7a6e] hover:shadow-md"><Icon className="text-3xl text-[#1a7a6e]" aria-hidden="true" /><span className="mt-4 block font-bold">{category.name}</span></button>; })}</div> : <p className="mt-10 rounded-lg bg-white p-5 text-gray-500">Services will appear here soon.</p>}</div></section>

      <section id="about" className="px-5 py-20 sm:py-24"><div className="mx-auto max-w-6xl"><h2 className="text-center text-3xl font-extrabold sm:text-4xl">Why Choose Servigo?</h2><div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">{features.map(([Icon, title, desc]) => <div key={title}><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f5f3] text-xl text-[#1a7a6e]"><Icon aria-hidden="true" /></div><h3 className="mt-5 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-500">{desc}</p></div>)}</div></div></section>
      <section className="bg-[#e8f5f3] px-5 py-16"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-7 rounded-2xl bg-[#1a7a6e] p-8 text-white sm:p-12 md:flex-row md:items-center"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-100">Grow with Servigo</p><h2 className="mt-3 text-3xl font-extrabold">Are you a service professional?</h2><p className="mt-3 text-teal-50">Get more customers near you.</p></div><button onClick={() => navigate("/register?role=professional")} className="inline-flex shrink-0 items-center rounded-lg bg-white px-6 py-3.5 font-bold text-[#1a7a6e] hover:bg-teal-50">Become a Professional <FaArrowRight className="ml-2" size={14} /></button></div></section>
      <section className="px-5 py-16 text-center"><div className="mx-auto max-w-2xl"><FaCheck className="mx-auto text-3xl text-[#1a7a6e]" aria-hidden="true" /><h2 className="mt-3 text-2xl font-extrabold">Trusted by customers and professionals</h2><p className="mt-3 text-gray-600">A transparent marketplace built to make everyday services easier.</p></div></section>
    </main>

    <footer className="bg-gray-950 px-5 pb-7 pt-14 text-gray-300"><div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4"><div><p className="text-xl font-extrabold tracking-[0.2em] text-white">SERVIGO</p><p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">Reliable local professionals for repairs, maintenance, and everyday services.</p></div><div><h3 className="font-bold text-white">Services</h3><a href="#services" className="mt-4 block text-sm hover:text-white">Find Services</a><a href="#how-it-works" className="mt-2 block text-sm hover:text-white">How It Works</a><button onClick={() => navigate("/register?role=professional")} className="mt-2 block text-sm hover:text-white">Become a Professional</button><a href="#about" className="mt-2 block text-sm hover:text-white">About Us</a></div><div><h3 className="font-bold text-white">Support</h3><p className="mt-4 text-sm text-gray-400">Contact</p><p className="mt-2 text-sm text-gray-400">FAQ</p></div><div><h3 className="font-bold text-white">Legal</h3><p className="mt-4 text-sm text-gray-400">Privacy Policy</p><p className="mt-2 text-sm text-gray-400">Terms & Conditions</p></div></div><div className="mx-auto mt-12 max-w-6xl border-t border-gray-800 pt-6 text-sm text-gray-500">© 2026 Servigo</div></footer>
  </div>;
};

export default LandingPage;

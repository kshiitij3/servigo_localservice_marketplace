import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../services/category.service";
import Navbar from "../../components/landing/Navbar";
import HeroSection from "../../components/landing/HeroSection";
import HowItWorks from "../../components/landing/HowItWorks";
import PopularServices from "../../components/landing/PopularServices";
import WhyServigo from "../../components/landing/WhyServigo";
import ProfessionalCTA from "../../components/landing/ProfessionalCTA";
import Testimonials from "../../components/landing/Testimonials";
import Footer from "../../components/landing/Footer";

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

  const goToLogin = () => { setMenuOpen(false); navigate("/login"); };
  const goToRegister = () => { setMenuOpen(false); navigate("/register"); };
  const findProfessionals = () => navigate("/login", { state: { service, location } });
  const useCurrentLocation = () => {
    if (!navigator.geolocation) return setLocation("Location unavailable");
    navigator.geolocation.getCurrentPosition(() => setLocation("Current location"), () => setLocation("Unable to get location"));
  };

  return <div id="top" className="min-h-screen bg-white text-gray-900 font-['Inter']">
    <Navbar menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((open) => !open)} onLogin={goToLogin} onRegister={goToRegister} />
    <main>
      <HeroSection service={service} location={location} setService={setService} setLocation={setLocation} onFind={findProfessionals} onUseLocation={useCurrentLocation} onPostRequest={goToLogin} />
      <HowItWorks />
      <PopularServices categories={categories} loading={categoriesLoading} onSelect={(name) => { setService(name); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
      <WhyServigo />
      <ProfessionalCTA onBecomeProfessional={() => navigate("/register?role=professional")} />
      <Testimonials />
    </main>
    <Footer onBecomeProfessional={() => navigate("/register?role=professional")} />
  </div>;
};

export default LandingPage;

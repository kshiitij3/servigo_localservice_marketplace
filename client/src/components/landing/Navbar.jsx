const Navbar = ({ menuOpen, onToggleMenu, onLogin, onRegister }) => {
  const closeAnd = (action) => { action(); };
  return <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
    <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-6">
      <a href="#top" className="text-xl font-extrabold tracking-[0.2em] text-[#1a7a6e]">SERVIGO</a>
      <div className="hidden items-center gap-9 text-sm font-medium text-gray-600 md:flex"><a href="#services" className="hover:text-[#1a7a6e]">Find Services</a><a href="#how-it-works" className="hover:text-[#1a7a6e]">How It Works</a><a href="#about" className="hover:text-[#1a7a6e]">About</a></div>
      <div className="hidden items-center gap-3 md:flex"><button onClick={onLogin} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#1a7a6e]">Login</button><button onClick={onRegister} className="rounded-lg bg-[#1a7a6e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#145f56]">Register</button></div>
      <button aria-label="Toggle menu" onClick={onToggleMenu} className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"><span className="text-2xl">{menuOpen ? "×" : "☰"}</span></button>
    </div>
    {menuOpen && <div className="space-y-1 border-t border-gray-100 bg-white px-5 pb-5 pt-3 md:hidden"><a href="#services" className="block py-2 font-medium text-gray-700" onClick={() => closeAnd(onToggleMenu)}>Find Services</a><a href="#how-it-works" className="block py-2 font-medium text-gray-700" onClick={() => closeAnd(onToggleMenu)}>How It Works</a><a href="#about" className="block py-2 font-medium text-gray-700" onClick={() => closeAnd(onToggleMenu)}>About</a><button onClick={onLogin} className="block w-full py-2 text-left font-medium text-gray-700">Login</button><button onClick={onRegister} className="mt-2 w-full rounded-lg bg-[#1a7a6e] py-2.5 font-semibold text-white">Register</button></div>}
  </nav>;
};

export default Navbar;

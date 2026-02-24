import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";
import logo from "@/assets/church-cross-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const navLinks = [
    { to: "/about", label: t.nav_about },
    { to: "/events", label: t.nav_events },
    { to: "/projects", label: t.nav_projects },
    { to: "/gallery", label: t.nav_gallery },
    { to: "/downloads", label: t.nav_downloads },
    { to: "/livestream", label: t.nav_livestream },
    { to: "/preaching-schedule", label: "Preaching Plan" },
    { to: "/home-prayers", label: "Home Prayers" },
    { to: "/contact", label: t.nav_contact },
    { to: "/admin/login", label: t.nav_admin },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <img src={logo} alt="Mzilikazi North Parish Logo" className="h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] lg:h-[70px] lg:w-[70px] object-contain shrink-0" />
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-xl sm:text-2xl lg:text-3xl font-serif font-extrabold tracking-wide text-primary truncate">Mzilikazi</span>
              <span className="text-[10px] sm:text-xs font-serif tracking-[0.15em] sm:tracking-[0.2em] uppercase text-muted-foreground truncate">North Parish · Bulawayo</span>
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${location.pathname === link.to ? "text-primary font-semibold" : "text-foreground/80 hover:text-primary hover:bg-muted"}`}>
                {link.label}
              </Link>
            ))}
            <LanguageSelector />
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        {isOpen && (
          <div className="lg:hidden pb-4 animate-fade-in">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-sm font-medium rounded-md transition-colors ${location.pathname === link.to ? "text-primary bg-primary/5 font-semibold" : "text-foreground/80 hover:text-primary hover:bg-muted"}`}>
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-2"><LanguageSelector /></div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

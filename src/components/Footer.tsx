import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Youtube } from "lucide-react";
import logo from "@/assets/umplogo2.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Mzilikazi ELCZ Logo" className="h-10 w-10 object-contain" />
              <span className="font-display text-lg font-bold">Mzilikazi ELCZ</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              A welcoming community of faith rooted in the Lutheran tradition. Come as you are and grow with us.
            </p>
          </div>

          {/* Service Times */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-accent">Service Times</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Sunday Worship: 9:00 AM</li>
              <li>Sunday School: 10:30 AM</li>
              <li>Midweek Service: Wed 6:00 PM</li>
              <li>Youth Service: Fri 5:00 PM</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-accent">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/about", label: "About Us" },
                { to: "/events", label: "Events" },
                { to: "/ministries", label: "Ministries" },
                { to: "/livestream", label: "Livestream" },
                { to: "/appointments", label: "Book Appointment" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-primary-foreground/70 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-accent">Contact Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                <span>123 Faith Avenue, Mzilikazi, Bulawayo, Zimbabwe</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <span>+263 29 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <span>info@mzilikazielcz.org</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} Mzilikazi Evangelical Lutheran Church Parish. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

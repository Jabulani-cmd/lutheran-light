import { Link } from "react-router-dom";
import { Clock, MapPin, Calendar, Users, Video, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslation } from "@/hooks/useTranslation";
import heroImage1 from "@/assets/hero-church.jpg";
import heroImage2 from "@/assets/hero-church-2.jpg";
import heroImage3 from "@/assets/hero-church-3.jpg";
import heroImage4 from "@/assets/hero-church-4.jpg";
import roseLogo from "@/assets/umplogo2.png";

const heroSlides = [
  { image: heroImage1, alt: "Mzilikazi North Parish church exterior" },
  { image: heroImage2, alt: "Beautiful church interior with stained glass" },
  { image: heroImage3, alt: "Congregation worshipping together" },
  { image: heroImage4, alt: "Community outreach and fellowship" },
];

const upcomingEvents = [
  { title: "Sunday Worship Service", date: "Every Sunday", time: "9:00 AM", category: "Worship" },
  { title: "Youth Fellowship Retreat", date: "March 15, 2026", time: "8:00 AM", category: "Fellowship" },
  { title: "Women's League Prayer Breakfast", date: "March 22, 2026", time: "7:00 AM", category: "Fellowship" },
  { title: "Community Outreach Day", date: "March 29, 2026", time: "10:00 AM", category: "Outreach" },
];

const Index = () => {
  const { t } = useTranslation();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const quickLinks = [
    { icon: Users, label: t.home_explore_ministries, desc: t.home_explore_ministries_desc, to: "/ministries" },
    { icon: Video, label: t.home_explore_livestream, desc: t.home_explore_livestream_desc, to: "/livestream" },
    { icon: BookOpen, label: t.home_explore_appointments, desc: t.home_explore_appointments_desc, to: "/appointments" },
    { icon: Calendar, label: t.home_explore_events, desc: t.home_explore_events_desc, to: "/events" },
  ];

  return (
    <Layout>
      {/* Hero Carousel */}
      <section className="relative h-[85vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0" ref={emblaRef}>
          <div className="flex h-full">
            {heroSlides.map((slide, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full">
                <img src={slide.image} alt={slide.alt} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-hero z-10" />
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="text-center px-4 max-w-3xl animate-fade-in">
            <img src={roseLogo} alt="Mzilikazi North Parish Rose Logo" className="h-[120px] w-auto mx-auto mb-4 object-contain" />
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
              {t.home_hero_title_prefix} <span className="text-gradient-purple">Mzilikazi</span> {t.home_hero_title_suffix}
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl mb-8 leading-relaxed">{t.home_hero_subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-purple-light font-semibold text-base px-8">
                <Link to="/about">{t.home_learn_more}</Link>
              </Button>
              <Button asChild size="lg" className="border-2 border-accent text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 text-base px-8">
                <Link to="/livestream">{t.home_watch_live}</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, index) => (
            <button key={index} onClick={() => emblaApi?.scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all ${selectedIndex === index ? "bg-primary-foreground scale-110" : "bg-primary-foreground/40 hover:bg-primary-foreground/60"}`}
              aria-label={`Go to slide ${index + 1}`} />
          ))}
        </div>
      </section>

      {/* Service Times */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <SectionHeading title={t.home_worship_title} subtitle={t.home_worship_subtitle} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { day: t.home_sunday_worship, time: "9:00 AM" },
              { day: t.home_sunday_school, time: "10:30 AM" },
              { day: t.home_midweek_service, time: "Wed 6:00 PM" },
              { day: t.home_youth_service, time: "Fri 5:00 PM" },
            ].map((s) => (
              <Card key={s.day} className="text-center shadow-soft border-border hover:shadow-medium transition-shadow">
                <CardContent className="pt-6">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-display font-semibold text-foreground">{s.day}</h3>
                  <p className="text-muted-foreground mt-1">{s.time}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8 flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>123 Faith Avenue, Mzilikazi, Bulawayo, Zimbabwe</span>
          </div>
        </div>
      </section>

      {/* Pastor Welcome */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <SectionHeading title={t.home_pastor_title} />
          <blockquote className="text-lg md:text-xl text-muted-foreground italic leading-relaxed">{t.home_pastor_quote}</blockquote>
          <p className="mt-6 font-display font-semibold text-foreground">{t.home_pastor_name}</p>
          <p className="text-sm text-muted-foreground">{t.home_senior_pastor}</p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <SectionHeading title={t.home_events_title} subtitle={t.home_events_subtitle} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {upcomingEvents.map((e) => (
              <Card key={e.title} className="shadow-soft hover:shadow-medium transition-shadow border-border">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="bg-primary/10 rounded-lg p-3 shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{e.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{e.date} · {e.time}</p>
                    <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{e.category}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline"><Link to="/events">{t.home_view_all_events}</Link></Button>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading title={t.home_explore_title} subtitle={t.home_explore_subtitle} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {quickLinks.map((l) => (
              <Link key={l.to} to={l.to} className="group">
                <Card className="text-center shadow-soft hover:shadow-purple transition-all border-border group-hover:border-primary/30 h-full">
                  <CardContent className="pt-6">
                    <l.icon className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-display font-semibold text-foreground text-sm">{l.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{l.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

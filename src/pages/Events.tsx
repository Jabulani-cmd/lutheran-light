import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const events = [
  { title: "Sunday Worship Service", date: "Every Sunday", time: "9:00 AM", location: "Main Sanctuary", desc: "Join us for our weekly worship service with hymns, prayer, and the Word.", category: "Worship" },
  { title: "Youth Fellowship Retreat", date: "March 15, 2026", time: "8:00 AM – 4:00 PM", location: "Matopos Hills Camp", desc: "A day of spiritual growth, team building, and outdoor activities for young people aged 13–25.", category: "Youth" },
  { title: "Women's League Prayer Breakfast", date: "March 22, 2026", time: "7:00 AM", location: "Church Hall", desc: "A morning of fellowship, prayer, and a shared meal with the Women's League.", category: "Fellowship" },
  { title: "Community Outreach Day", date: "March 29, 2026", time: "10:00 AM", location: "Mzilikazi Community Center", desc: "Serving our neighbours with food parcels, clothing donations, and health checks.", category: "Outreach" },
  { title: "Midweek Bible Study", date: "Every Wednesday", time: "6:00 PM", location: "Fellowship Room", desc: "Deepen your understanding of Scripture in a small group setting.", category: "Worship" },
  { title: "Men's League Sports Day", date: "April 5, 2026", time: "9:00 AM", location: "Community Sports Ground", desc: "A fun day of soccer, volleyball, and fellowship for men of all ages.", category: "Fellowship" },
  { title: "Easter Sunrise Service", date: "April 5, 2026", time: "5:30 AM", location: "Church Garden", desc: "Celebrate the resurrection of our Lord with a beautiful sunrise service.", category: "Worship" },
  { title: "Sunday School Teachers Workshop", date: "April 12, 2026", time: "2:00 PM", location: "Church Hall", desc: "Training and resources for our Sunday School teachers.", category: "Youth" },
];

const Events = () => {
  const { t } = useTranslation();
  const categoryMap: Record<string, string> = {
    All: t.events_all,
    Worship: t.events_worship,
    Fellowship: t.events_fellowship,
    Outreach: t.events_outreach,
    Youth: t.events_youth,
  };
  const categories = ["All", "Worship", "Fellowship", "Outreach", "Youth"];
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? events : events.filter((e) => e.category === filter);

  return (
    <Layout>
      <section className="bg-gradient-purple py-12 sm:py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">{t.events_title}</h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">{t.events_subtitle}</p>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <Button key={cat} variant={filter === cat ? "default" : "outline"} size="sm" onClick={() => setFilter(cat)}
                className={filter === cat ? "bg-primary text-primary-foreground hover:bg-purple-dark" : ""}>
                {categoryMap[cat]}
              </Button>
            ))}
          </div>
          <div className="space-y-4">
            {filtered.map((e, i) => (
              <Card key={i} className="shadow-soft border-border hover:shadow-medium transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-3 shrink-0 self-start">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-semibold text-foreground">{e.title}</h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{e.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{e.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{e.location}</span>
                      </div>
                      <p className="mt-3 text-muted-foreground">{e.desc}</p>
                      <span className="inline-block mt-3 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{categoryMap[e.category]}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Events;

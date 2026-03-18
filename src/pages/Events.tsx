import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Calendar, FileText } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";

const formatDateOrdinal = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate();
  const suffix = [11,12,13].includes(day % 100) ? "th" : {1:"st",2:"nd",3:"rd"}[day % 10] || "th";
  const month = d.toLocaleString("en", { month: "long" });
  return `${day}${suffix} ${month} ${d.getFullYear()}`;
};

const Events = () => {
  const { t } = useTranslation();
  const [dbEvents, setDbEvents] = useState<any[]>([]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const fetch = async () => {
      const { data } = await supabase.from("events").select("*").gte("event_date", today).order("event_date", { ascending: true });
      if (data) setDbEvents(data);
    };
    fetch();
  }, []);

  const allEvents = dbEvents.map((e) => ({
    title: e.title,
    date: e.event_date,
    time: e.event_time || "",
    location: e.location || "",
    desc: e.description || "",
    category: e.category,
    poster_image_url: e.poster_image_url || "",
    programme_document_url: e.programme_document_url || "",
  }));

  const categoryMap: Record<string, string> = {
    All: t.events_all,
    Worship: t.events_worship,
    Fellowship: t.events_fellowship,
    Outreach: t.events_outreach,
    Youth: t.events_youth,
  };
  const categories = ["All", "Worship", "Fellowship", "Outreach", "Youth"];
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? allEvents : allEvents.filter((e) => e.category === filter);

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
              <Card key={i} className="shadow-soft border-border hover:shadow-medium transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Poster Image */}
                    {e.poster_image_url && (
                      <div className="md:w-48 shrink-0">
                        <img src={e.poster_image_url} alt={e.title} className="w-full h-48 md:h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6 flex-1">
                      <div className="flex items-start gap-4">
                        {(() => {
                          const parsedDate = new Date(e.date);
                          const hasDate = !isNaN(parsedDate.getTime());
                          const monthStr = hasDate ? parsedDate.toLocaleString("en", { month: "short" }).toUpperCase() : "";
                          const dayStr = hasDate ? parsedDate.getDate().toString() : "";
                          return (
                            <div className="bg-primary/10 rounded-xl w-14 h-14 shrink-0 flex flex-col items-center justify-center overflow-hidden">
                              {hasDate ? (
                                <>
                                  <span className="text-[10px] font-bold text-primary-foreground bg-primary w-full text-center py-0.5">{monthStr}</span>
                                  <span className="text-lg font-bold text-primary leading-none mt-0.5">{dayStr}</span>
                                </>
                              ) : (
                                <span className="text-2xl">☀️</span>
                              )}
                            </div>
                          );
                        })()}
                        <div className="flex-1">
                          <h3 className="font-display text-xl font-semibold text-foreground">{e.title}</h3>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDateOrdinal(e.date)}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{e.time}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{e.location}</span>
                          </div>
                          <p className="mt-3 text-muted-foreground">{e.desc}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{categoryMap[e.category]}</span>
                            {e.programme_document_url && (
                              <a href={e.programme_document_url} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs bg-accent/10 text-accent px-3 py-1 rounded-full hover:bg-accent/20 transition-colors font-medium">
                                <FileText className="h-3 w-3" /> View Programme
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
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

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, User } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";
import roseLogo from "@/assets/umplogo2.png";

const Ministries = () => {
  const { t } = useTranslation();
  const [ministryPhotos, setMinistryPhotos] = useState<Record<string, any[]>>({});

  useEffect(() => {
    supabase.from("ministry_photos").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) {
        const grouped: Record<string, any[]> = {};
        data.forEach((p: any) => {
          if (!grouped[p.ministry]) grouped[p.ministry] = [];
          grouped[p.ministry].push(p);
        });
        setMinistryPhotos(grouped);
      }
    });
  }, []);

  const leagues = [
    {
      key: "youth", name: t.ministries_youth, desc: t.ministries_youth_desc,
      meetingTime: "Fridays at 5:00 PM", contact: "Deacon S. Ndlovu",
      events: ["Youth Fellowship Retreat – March 15", "Sports & Games Night – April 3"],
    },
    {
      key: "men", name: t.ministries_men, desc: t.ministries_men_desc,
      meetingTime: "1st & 3rd Saturday at 8:00 AM", contact: "Elder J. Moyo",
      events: ["Men's Sports Day – April 5", "Leadership Workshop – April 19"],
    },
    {
      key: "women", name: t.ministries_women, desc: t.ministries_women_desc,
      meetingTime: "2nd & 4th Saturday at 9:00 AM", contact: "Sister M. Sibanda",
      events: ["Prayer Breakfast – March 22", "Community Outreach – April 11"],
    },
    {
      key: "sunday_school", name: t.ministries_sunday_school, desc: t.ministries_sunday_school_desc,
      meetingTime: "Sundays at 10:30 AM", contact: "Teacher P. Khumalo",
      events: ["Easter Program – April 5", "Teachers Workshop – April 12"],
    },
  ];

  return (
    <Layout>
      <section className="bg-gradient-purple py-12 sm:py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">{t.ministries_title}</h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">{t.ministries_subtitle}</p>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {leagues.map((l) => {
              const photos = ministryPhotos[l.key] || [];
              return (
                <Card key={l.name} className="shadow-soft border-border hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 rounded-lg p-3">
                        <img src={roseLogo} alt="" className="h-20 w-20 object-contain" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground">{l.name}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">{l.desc}</p>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2 text-foreground"><Clock className="h-4 w-4 text-primary" /> {l.meetingTime}</p>
                      <p className="flex items-center gap-2 text-foreground"><User className="h-4 w-4 text-primary" /> {t.ministries_contact}: {l.contact}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t.ministries_upcoming}</p>
                      <ul className="space-y-1">
                        {l.events.map((ev) => (<li key={ev} className="text-sm text-muted-foreground">• {ev}</li>))}
                      </ul>
                    </div>
                    {/* Ministry Photos */}
                    {photos.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Photos</p>
                        <div className="grid grid-cols-3 gap-2">
                          {photos.slice(0, 6).map((p) => (
                            <img key={p.id} src={p.image_url} alt="" className="w-full h-20 object-cover rounded" />
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Ministries;

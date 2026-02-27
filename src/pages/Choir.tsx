import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Music, Play, Clock, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

const getEmbedUrl = (url: string) => {
  const ytMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  if (url.includes("facebook.com")) return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
  return url;
};

const Choir = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [groupPhoto, setGroupPhoto] = useState<string | null>(null);
  const [choirPhotos, setChoirPhotos] = useState<any[]>([]);
  const [performances, setPerformances] = useState<any[]>([]);
  const [practiceSchedule, setPracticeSchedule] = useState<any[]>([]);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    voice_part: "soprano",
  });

  useEffect(() => {
    supabase.from("choir_members").select("*").eq("is_approved", true).order("first_name").then(({ data }) => {
      if (data) setMembers(data);
    });
    supabase.from("choir_photos").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) {
        const group = data.find((p: any) => p.is_group_photo);
        if (group) setGroupPhoto(group.image_url);
        setChoirPhotos(data);
      }
    });
    supabase.from("gallery_videos").select("*").eq("category", "choir").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setPerformances(data);
    });
    supabase.from("choir_practice_schedule").select("*").eq("is_active", true).order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setPracticeSchedule(data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("choir_members").insert([form]);
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: t.choir_submitted_title, description: t.choir_submitted_desc });
    }
  };

  return (
    <Layout>
      <section className="bg-gradient-purple py-12 sm:py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">{t.choir_title}</h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">{t.choir_subtitle}</p>
        </div>
      </section>

      {/* Group Photo */}
      {groupPhoto && (
        <section className="py-10 bg-card">
          <div className="container mx-auto px-4 max-w-4xl">
            <SectionHeading title={t.choir_group_title} subtitle={t.choir_group_subtitle} />
            <div className="rounded-lg overflow-hidden shadow-medium">
              <img src={groupPhoto} alt="Choir group photo" className="w-full h-auto object-cover" />
            </div>
          </div>
        </section>
      )}

      {/* Practice Schedule */}
      {practiceSchedule.length > 0 && (
        <section className="py-10 bg-muted">
          <div className="container mx-auto px-4 max-w-4xl">
            <SectionHeading title="Choir Practice Schedule" subtitle="Join us for rehearsals during the week" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {practiceSchedule.map((s) => (
                <Card key={s.id} className="shadow-soft border-border">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <h3 className="font-display font-semibold text-foreground">{s.practice_day}</h3>
                    </div>
                    <p className="text-sm text-foreground font-medium mb-1">{s.practice_time}</p>
                    {s.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{s.location}</span>
                      </div>
                    )}
                    {s.notes && <p className="text-xs text-muted-foreground mt-2 italic">{s.notes}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Choir Story */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <SectionHeading title={t.choir_story_title} />
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p>{t.choir_story_p1}</p>
            <p>{t.choir_story_p2}</p>
          </div>
          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-purple-light font-semibold" onClick={() => document.getElementById("join-form")?.scrollIntoView({ behavior: "smooth" })}>
              <Music className="h-4 w-4 mr-2" /> {t.choir_apply}
            </Button>
            {performances.length > 0 && (
              <Button size="lg" variant="outline" onClick={() => document.getElementById("performances")?.scrollIntoView({ behavior: "smooth" })}>
                <Play className="h-4 w-4 mr-2" /> {t.choir_performances_title}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Choir Photos Gallery */}
      {choirPhotos.filter(p => !p.is_group_photo).length > 0 && (
        <section className="py-10 bg-card">
          <div className="container mx-auto px-4 max-w-5xl">
            <SectionHeading title={t.choir_gallery_title} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {choirPhotos.filter(p => !p.is_group_photo).map((photo) => (
                <div key={photo.id} className="rounded-lg overflow-hidden shadow-soft">
                  <img src={photo.image_url} alt={photo.caption || "Choir"} className="w-full h-48 object-cover" />
                  {photo.caption && <p className="p-2 text-xs text-muted-foreground">{photo.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Past Performances */}
      <section id="performances" className="py-10 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeading title={t.choir_performances_title} subtitle={t.choir_performances_subtitle} />
          {performances.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {performances.map((v) => (
                <div key={v.id} className="rounded-lg overflow-hidden border border-border shadow-soft">
                  <div className="aspect-video">
                    <iframe src={getEmbedUrl(v.video_url)} title={v.title} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-display font-semibold text-foreground text-sm">{v.title}</h3>
                    {v.caption && <p className="text-xs text-muted-foreground mt-1">{v.caption}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground italic py-8">{t.choir_no_performances}</p>
          )}
        </div>
      </section>

      {/* Members */}
      {members.length > 0 && (
        <section className="py-10 bg-card">
          <div className="container mx-auto px-4 max-w-4xl">
            <SectionHeading title={t.choir_members_title} subtitle={t.choir_members_subtitle} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {members.map((m) => (
                <Card key={m.id} className="shadow-soft border-border text-center">
                  <CardContent className="p-4">
                    <Music className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="font-semibold text-foreground text-sm">{m.first_name} {m.last_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{m.voice_part}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Join Form */}
      <section id="join-form" className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-lg">
          <SectionHeading title={t.choir_join_title} subtitle={t.choir_join_subtitle} />
          {submitted ? (
            <Card className="shadow-soft border-border">
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground">{t.choir_submitted_title}</h3>
                <p className="text-muted-foreground mt-2">{t.choir_submitted_desc}</p>
                <Button className="mt-6" variant="outline" onClick={() => { setSubmitted(false); setForm({ first_name: "", last_name: "", phone: "", email: "", voice_part: "soprano" }); }}>
                  {t.choir_submit_another}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-soft border-border">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>{t.choir_first_name}</Label><Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required /></div>
                    <div><Label>{t.choir_last_name}</Label><Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required /></div>
                  </div>
                  <div><Label>{t.choir_phone}</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                  <div><Label>{t.choir_email}</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                  <div>
                    <Label>{t.choir_voice_part}</Label>
                    <Select value={form.voice_part} onValueChange={(v) => setForm({ ...form, voice_part: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="soprano">{t.choir_soprano}</SelectItem>
                        <SelectItem value="alto">{t.choir_alto}</SelectItem>
                        <SelectItem value="tenor">{t.choir_tenor}</SelectItem>
                        <SelectItem value="bass">{t.choir_bass}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={loading}>
                    {loading ? t.choir_submitting : t.choir_apply}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Choir;

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Music } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Choir = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [groupPhoto, setGroupPhoto] = useState<string | null>(null);
  const [choirPhotos, setChoirPhotos] = useState<any[]>([]);

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
      toast({ title: "Application Submitted!", description: "Thank you for your interest in joining the choir." });
    }
  };

  return (
    <Layout>
      <section className="bg-gradient-purple py-12 sm:py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">Church Choir</h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">Praising God through song and harmony</p>
        </div>
      </section>

      {/* Group Photo */}
      {groupPhoto && (
        <section className="py-10 bg-card">
          <div className="container mx-auto px-4 max-w-4xl">
            <SectionHeading title="Our Choir" subtitle="The voices of Mzilikazi North Congregation" />
            <div className="rounded-lg overflow-hidden shadow-medium">
              <img src={groupPhoto} alt="Choir group photo" className="w-full h-auto object-cover" />
            </div>
          </div>
        </section>
      )}

      {/* Choir Photos Gallery */}
      {choirPhotos.filter(p => !p.is_group_photo).length > 0 && (
        <section className="py-10 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <SectionHeading title="Choir Gallery" />
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

      {/* Members */}
      {members.length > 0 && (
        <section className="py-10 bg-card">
          <div className="container mx-auto px-4 max-w-4xl">
            <SectionHeading title="Choir Members" subtitle="Our dedicated singers" />
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
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-lg">
          <SectionHeading title="Join the Choir" subtitle="Fill in the form below to express your interest in joining our choir." />
          {submitted ? (
            <Card className="shadow-soft border-border">
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground">Application Submitted!</h3>
                <p className="text-muted-foreground mt-2">We will review your application and get back to you.</p>
                <Button className="mt-6" variant="outline" onClick={() => { setSubmitted(false); setForm({ first_name: "", last_name: "", phone: "", email: "", voice_part: "soprano" }); }}>
                  Submit Another
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-soft border-border">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>First Name</Label><Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required /></div>
                    <div><Label>Last Name</Label><Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required /></div>
                  </div>
                  <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                  <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                  <div>
                    <Label>Voice Part</Label>
                    <Select value={form.voice_part} onValueChange={(v) => setForm({ ...form, voice_part: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="soprano">Soprano</SelectItem>
                        <SelectItem value="alto">Alto</SelectItem>
                        <SelectItem value="tenor">Tenor</SelectItem>
                        <SelectItem value="bass">Bass</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={loading}>
                    {loading ? "Submitting..." : "Apply to Join"}
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

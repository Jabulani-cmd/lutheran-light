import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";

interface Photo {
  id: string;
  title: string;
  caption: string | null;
  image_url: string;
  category: string;
  created_at: string;
}

const Gallery = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data } = await supabase
        .from("gallery_photos")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setPhotos(data as Photo[]);
    };
    fetchPhotos();
  }, []);

  const filtered = filter === "all" ? photos : photos.filter((p) => p.category === filter);

  const albums = [
    { name: t.gallery_worship, category: "worship" },
    { name: t.gallery_fellowship, category: "fellowship" },
    { name: t.gallery_outreach, category: "outreach" },
    { name: t.gallery_league, category: "league" },
  ];

  return (
    <Layout>
      <section className="bg-gradient-purple py-12 sm:py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">{t.gallery_title}</h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">{t.gallery_subtitle}</p>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-primary text-primary-foreground hover:bg-purple-dark" : ""}>{t.gallery_all}</Button>
            {albums.map((a) => (
              <Button key={a.category} variant={filter === a.category ? "default" : "outline"} size="sm"
                onClick={() => setFilter(a.category)}
                className={filter === a.category ? "bg-primary text-primary-foreground hover:bg-purple-dark" : ""}>{a.name}</Button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No photos in this category yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {filtered.map((item) => (
                <button key={item.id} onClick={() => setSelected(item)}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform relative group">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 left-0 right-0 text-sm font-medium text-white bg-black/50 px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          {selected && (
            <div>
              <img src={selected.image_url} alt={selected.title} className="w-full max-h-[70vh] object-contain bg-black" />
              <div className="p-4">
                <h3 className="font-display text-xl font-bold">{selected.title}</h3>
                {selected.caption && <p className="text-muted-foreground mt-1">{selected.caption}</p>}
                <p className="text-xs text-muted-foreground capitalize mt-2">{selected.category}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Gallery;

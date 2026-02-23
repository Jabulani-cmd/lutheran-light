import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/useTranslation";

const galleryItems = [
  { id: 1, category: "worship", title: "Sunday Worship", color: "from-navy to-navy-light" },
  { id: 2, category: "worship", title: "Christmas Service", color: "from-gold-dark to-gold" },
  { id: 3, category: "fellowship", title: "Church Picnic", color: "from-green-700 to-green-500" },
  { id: 4, category: "fellowship", title: "New Year Celebration", color: "from-navy to-gold-dark" },
  { id: 5, category: "outreach", title: "Community Feeding", color: "from-amber-700 to-amber-500" },
  { id: 6, category: "outreach", title: "Hospital Visits", color: "from-blue-700 to-blue-500" },
  { id: 7, category: "league", title: "Youth Camp", color: "from-emerald-700 to-emerald-500" },
  { id: 8, category: "league", title: "Women's Day", color: "from-rose-700 to-rose-500" },
  { id: 9, category: "worship", title: "Good Friday Service", color: "from-navy-dark to-navy" },
  { id: 10, category: "league", title: "Men's Sports Day", color: "from-sky-700 to-sky-500" },
  { id: 11, category: "fellowship", title: "Easter Breakfast", color: "from-gold to-amber-400" },
  { id: 12, category: "outreach", title: "School Donations", color: "from-teal-700 to-teal-500" },
];

const Gallery = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<typeof galleryItems[0] | null>(null);
  const filtered = filter === "all" ? galleryItems : galleryItems.filter((i) => i.category === filter);

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {filtered.map((item) => (
              <button key={item.id} onClick={() => setSelected(item)}
                className={`aspect-square rounded-lg bg-gradient-to-br ${item.color} flex items-end p-3 cursor-pointer hover:scale-[1.02] transition-transform`}>
                <span className="text-sm font-medium text-white/90 bg-black/30 px-2 py-1 rounded">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          {selected && (
            <div className={`aspect-video bg-gradient-to-br ${selected.color} flex items-center justify-center`}>
              <div className="text-center text-white">
                <h3 className="font-display text-2xl font-bold">{selected.title}</h3>
                <p className="text-white/70 mt-2 capitalize">{selected.category}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Gallery;

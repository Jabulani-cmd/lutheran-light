import { useState } from "react";
import { Download, BookOpen, Book, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { languageNames, type Language } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

const Downloads = () => {
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<Language>("en");

  const categoryLabels: Record<string, { label: string; icon: typeof BookOpen }> = {
    hymn_book: { label: t.downloads_hymn_book, icon: BookOpen },
    bible: { label: t.downloads_bible, icon: Book },
    other: { label: t.downloads_other, icon: FileText },
  };

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["downloadable-resources"],
    queryFn: async () => {
      const { data, error } = await supabase.from("downloadable_resources").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = resources.filter((r: any) => r.language === selectedLang);
  const grouped = filtered.reduce((acc: Record<string, any[]>, r: any) => {
    const cat = r.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(r);
    return acc;
  }, {});

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Layout>
      <section className="bg-primary text-primary-foreground py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{t.downloads_title}</h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">{t.downloads_subtitle}</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <Tabs value={selectedLang} onValueChange={(v) => setSelectedLang(v as Language)}>
            <TabsList className="flex flex-wrap justify-center mb-8">
              {(Object.entries(languageNames) as [Language, string][]).map(([code, name]) => (
                <TabsTrigger key={code} value={code}>{name}</TabsTrigger>
              ))}
            </TabsList>
            {(Object.keys(languageNames) as Language[]).map((lang) => (
              <TabsContent key={lang} value={lang}>
                {isLoading ? (
                  <p className="text-center text-muted-foreground">Loading...</p>
                ) : filtered.length === 0 ? (
                  <Card className="border-border">
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-40" />
                      <p className="text-lg font-medium">{t.downloads_no_resources}</p>
                      <p className="text-sm mt-1">{t.downloads_no_resources_desc}</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-8">
                    {Object.entries(grouped).map(([category, items]) => {
                      const catInfo = categoryLabels[category] || categoryLabels.other;
                      const Icon = catInfo.icon;
                      return (
                        <div key={category}>
                          <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Icon className="h-5 w-5 text-primary" />{catInfo.label}
                          </h2>
                          <div className="grid gap-3">
                            {(items as any[]).map((r) => (
                              <Card key={r.id} className="border-border shadow-soft hover:shadow-medium transition-shadow">
                                <CardContent className="p-4 flex items-center justify-between gap-4">
                                  <div className="min-w-0">
                                    <h3 className="font-semibold text-foreground truncate">{r.title}</h3>
                                    {r.description && <p className="text-sm text-muted-foreground mt-1">{r.description}</p>}
                                    {r.file_size_bytes && <span className="text-xs text-muted-foreground">{formatSize(r.file_size_bytes)}</span>}
                                  </div>
                                  <Button asChild size="sm" className="shrink-0">
                                    <a href={r.file_url} download target="_blank" rel="noopener noreferrer">
                                      <Download className="h-4 w-4 mr-1" />{t.downloads_download}
                                    </a>
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Downloads;

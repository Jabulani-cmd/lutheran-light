import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { useTranslation } from "@/hooks/useTranslation";
import { Heart, Building2, RefreshCw, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Giving = () => {
  const { t } = useTranslation();

  const handleComingSoon = () => {
    toast.info(t.giving_coming_soon);
  };

  const givingOptions = [
    {
      icon: Heart,
      title: t.giving_one_time_title,
      description: t.giving_one_time_desc,
      buttonLabel: t.giving_give_now,
    },
    {
      icon: Building2,
      title: t.giving_project_title,
      description: t.giving_project_desc,
      buttonLabel: t.giving_donate,
    },
    {
      icon: RefreshCw,
      title: t.giving_recurring_title,
      description: t.giving_recurring_desc,
      buttonLabel: t.giving_setup_tithe,
    },
  ];

  return (
    <Layout>
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            title={t.giving_title}
            subtitle={t.giving_subtitle}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mt-10">
            {givingOptions.map((option, index) => (
              <Card key={index} className="text-center border-border/50 shadow-soft hover:shadow-medium transition-shadow">
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <option.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="font-display text-lg">{option.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleComingSoon} className="w-full gap-2">
                    <CreditCard className="h-4 w-4" />
                    {option.buttonLabel}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 max-w-2xl mx-auto text-center">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t.giving_note}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Giving;

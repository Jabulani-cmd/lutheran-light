import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Cross, BookOpen, Heart, Users } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const leaders = [
  { name: "Pastor N. Dlamini", role: "Senior Pastor", bio: "Pastor Dlamini has served the parish for over 15 years, guiding the congregation with wisdom and compassion." },
  { name: "Elder J. Moyo", role: "Church Elder", bio: "A dedicated servant leader who oversees church administration and community outreach programs." },
  { name: "Elder T. Ncube", role: "Church Elder", bio: "Elder Ncube leads the worship committee and coordinates midweek prayer services." },
  { name: "Deacon S. Ndlovu", role: "Deacon", bio: "Deacon Ndlovu is passionate about youth ministry and mentoring the next generation of believers." },
];

const About = () => {
  const { t } = useTranslation();

  const beliefs = [
    { icon: Cross, title: t.about_grace, desc: t.about_grace_desc },
    { icon: BookOpen, title: t.about_scripture, desc: t.about_scripture_desc },
    { icon: Heart, title: t.about_faith, desc: t.about_faith_desc },
    { icon: Users, title: t.about_community, desc: t.about_community_desc },
  ];

  return (
    <Layout>
      <section className="bg-gradient-purple py-12 sm:py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">{t.about_title}</h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">{t.about_subtitle}</p>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-3xl">
          <SectionHeading title={t.about_history_title} />
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p>{t.about_history_p1}</p>
            <p>{t.about_history_p2}</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading title={t.about_beliefs_title} subtitle={t.about_beliefs_subtitle} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {beliefs.map((b) => (
              <Card key={b.title} className="text-center shadow-soft border-border">
                <CardContent className="pt-6">
                  <b.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-display font-semibold text-foreground mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <SectionHeading title={t.about_leadership_title} subtitle={t.about_leadership_subtitle} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {leaders.map((l) => (
              <Card key={l.name} className="shadow-soft border-border">
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground">{l.name}</h3>
                  <p className="text-sm text-primary font-medium">{l.role}</p>
                  <p className="text-sm text-muted-foreground mt-2">{l.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;

import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Cross, BookOpen, Heart, Users } from "lucide-react";

const beliefs = [
  { icon: Cross, title: "Grace Alone", desc: "We believe salvation comes through God's grace, not human effort." },
  { icon: BookOpen, title: "Scripture Alone", desc: "The Bible is the ultimate authority for faith and life." },
  { icon: Heart, title: "Faith Alone", desc: "Justification is received through faith in Jesus Christ." },
  { icon: Users, title: "Community", desc: "We are called to serve one another in love and fellowship." },
];

const leaders = [
  { name: "Pastor N. Dlamini", role: "Senior Pastor", bio: "Pastor Dlamini has served Mzilikazi ELCZ for over 15 years, guiding the congregation with wisdom and compassion." },
  { name: "Elder J. Moyo", role: "Church Elder", bio: "A dedicated servant leader who oversees church administration and community outreach programs." },
  { name: "Elder T. Ncube", role: "Church Elder", bio: "Elder Ncube leads the worship committee and coordinates midweek prayer services." },
  { name: "Deacon S. Ndlovu", role: "Deacon", bio: "Deacon Ndlovu is passionate about youth ministry and mentoring the next generation of believers." },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Banner */}
      <section className="bg-gradient-purple py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">About Our Parish</h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Rooted in the Lutheran tradition since 1952, Mzilikazi ELCZ has been a beacon of faith, hope, and community.
          </p>
        </div>
      </section>

      {/* History */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-3xl">
          <SectionHeading title="Our History" />
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p>
              Mzilikazi Evangelical Lutheran Church Parish was founded in 1952 in the heart of Bulawayo, Zimbabwe.
              What began as a small group of faithful believers gathering under a tree has grown into a vibrant congregation
              serving hundreds of families across the community.
            </p>
            <p>
              Over the decades, our parish has remained steadfast in its commitment to the Gospel, establishing schools,
              community outreach programs, and ministries that touch lives across all ages. We continue to be guided by the
              principles of the Lutheran Reformation — grace, faith, and Scripture.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Beliefs */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading title="Our Beliefs" subtitle="The core pillars of our Lutheran faith." />
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

      {/* Leadership */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <SectionHeading title="Our Leadership" subtitle="Meet the faithful servants who guide our congregation." />
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

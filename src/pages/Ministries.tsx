import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Star, BookOpen, Clock, User } from "lucide-react";

const leagues = [
  {
    icon: Star,
    name: "Youth League",
    desc: "Empowering young people (ages 13–30) to grow in faith through fellowship, Bible study, community service, and fun activities.",
    meetingTime: "Fridays at 5:00 PM",
    contact: "Deacon S. Ndlovu",
    events: ["Youth Fellowship Retreat – March 15", "Sports & Games Night – April 3"],
  },
  {
    icon: Users,
    name: "Men's League",
    desc: "A brotherhood committed to spiritual growth, family leadership, and community service. All men are welcome.",
    meetingTime: "1st & 3rd Saturday at 8:00 AM",
    contact: "Elder J. Moyo",
    events: ["Men's Sports Day – April 5", "Leadership Workshop – April 19"],
  },
  {
    icon: Heart,
    name: "Women's League",
    desc: "A sisterhood of faith dedicated to prayer, fellowship, and outreach. We support each other and serve the community together.",
    meetingTime: "2nd & 4th Saturday at 9:00 AM",
    contact: "Sister M. Sibanda",
    events: ["Prayer Breakfast – March 22", "Community Outreach – April 11"],
  },
  {
    icon: BookOpen,
    name: "Sunday School",
    desc: "Biblical education for children and young people. Our trained teachers nurture faith through engaging lessons and activities.",
    meetingTime: "Sundays at 10:30 AM",
    contact: "Teacher P. Khumalo",
    events: ["Easter Program – April 5", "Teachers Workshop – April 12"],
  },
];

const Ministries = () => {
  return (
    <Layout>
      <section className="bg-gradient-navy py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Ministries & Leagues</h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Get involved and grow in faith through our vibrant ministries.
          </p>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {leagues.map((l) => (
              <Card key={l.name} className="shadow-soft border-border hover:shadow-medium transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-secondary/10 rounded-lg p-3">
                      <l.icon className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground">{l.name}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{l.desc}</p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-foreground">
                      <Clock className="h-4 w-4 text-secondary" /> {l.meetingTime}
                    </p>
                    <p className="flex items-center gap-2 text-foreground">
                      <User className="h-4 w-4 text-secondary" /> Contact: {l.contact}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Upcoming</p>
                    <ul className="space-y-1">
                      {l.events.map((ev) => (
                        <li key={ev} className="text-sm text-muted-foreground">• {ev}</li>
                      ))}
                    </ul>
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

export default Ministries;

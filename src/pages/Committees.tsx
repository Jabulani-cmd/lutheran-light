import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { Users } from "lucide-react";

interface CommitteeMember {
  id: string;
  full_name: string;
  title: string | null;
  description: string | null;
  photo_url: string | null;
  sort_order: number;
}

interface Committee {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  members: CommitteeMember[];
}

const Committees = () => {
  const { t } = useTranslation();
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommittees = async () => {
      const { data: committeeData } = await supabase
        .from("committees")
        .select("*")
        .order("sort_order");

      const { data: memberData } = await supabase
        .from("committee_members")
        .select("*")
        .order("sort_order");

      const merged = (committeeData || []).map((c: any) => ({
        ...c,
        members: (memberData || []).filter((m: any) => m.committee_id === c.id),
      }));

      setCommittees(merged);
      setLoading(false);
    };
    fetchCommittees();
  }, []);

  return (
    <Layout>
      <section className="bg-gradient-purple py-12 sm:py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            {t.nav_committees || "Committees"}
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Meet the dedicated members who serve on our various church committees.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-card">
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : committees.length === 0 ? (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No committees have been added yet.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {committees.map((committee) => (
                <div key={committee.id}>
                  <SectionHeading
                    title={committee.name}
                    subtitle={committee.description || ""}
                  />
                  {committee.members.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm">No members added yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                      {committee.members.map((member) => (
                        <Card key={member.id} className="shadow-soft border-border overflow-hidden hover:shadow-md transition-shadow">
                          <CardContent className="p-6 text-center">
                            <Avatar className="h-24 w-24 mx-auto mb-4">
                              <AvatarImage src={member.photo_url || ""} alt={member.full_name} className="object-cover" />
                              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                {member.full_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <h3 className="font-display font-semibold text-foreground">{member.full_name}</h3>
                            {member.title && (
                              <p className="text-sm text-primary font-medium mt-1">{member.title}</p>
                            )}
                            {member.description && (
                              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{member.description}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Committees;

import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";

const Projects = () => {
  const { t } = useTranslation();

  const projects = [
    {
      title: "Church Building Renovation",
      description: "Ongoing renovation and maintenance of the parish church building to preserve our heritage and provide a welcoming space for worship.",
      status: "In Progress",
    },
    {
      title: "Community Hall Construction",
      description: "Building a multi-purpose community hall for fellowship gatherings, youth activities, and community outreach programs.",
      status: "Planning",
    },
    {
      title: "Education Support Fund",
      description: "Supporting underprivileged children in the community with school fees, uniforms, and learning materials.",
      status: "Ongoing",
    },
  ];

  return (
    <Layout>
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading title={t.nav_projects} subtitle={t.home_explore_projects_desc} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {projects.map((project) => (
              <Card key={project.title} className="shadow-soft border-border hover:shadow-medium transition-shadow">
                <CardContent className="p-6">
                  <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mb-3">
                    {project.status}
                  </span>
                  <h3 className="font-display font-semibold text-foreground text-lg mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;

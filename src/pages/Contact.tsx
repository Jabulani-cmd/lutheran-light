import { useState } from "react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Facebook, Youtube, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({ title: "Message Sent!", description: "We'll get back to you soon." });
  };

  return (
    <Layout>
      <section className="bg-gradient-navy py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            We'd love to hear from you. Reach out anytime.
          </p>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Info + Map */}
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Address</p>
                    <p className="text-muted-foreground text-sm">123 Faith Avenue, Mzilikazi, Bulawayo, Zimbabwe</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <p className="text-muted-foreground text-sm">+263 29 123 4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-muted-foreground text-sm">info@mzilikazielcp.org</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mb-8">
                <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors" aria-label="Facebook">
                  <Facebook className="h-5 w-5" /> Facebook
                </a>
                <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors" aria-label="YouTube">
                  <Youtube className="h-5 w-5" /> YouTube
                </a>
              </div>

              {/* Map */}
              <div className="rounded-lg overflow-hidden border border-border shadow-soft">
                <iframe
                  title="Mzilikazi ELCP Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3776.123456789!2d28.58!3d-20.16!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDA5JzM2LjAiUyAyOMKwMzQnNDguMCJF!5e0!3m2!1sen!2szw!4v1234567890"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Send a Message</h2>
              {submitted ? (
                <Card className="shadow-soft border-border">
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="h-12 w-12 text-secondary mx-auto mb-4" />
                    <h3 className="font-display text-xl font-semibold text-foreground">Thank You!</h3>
                    <p className="text-muted-foreground mt-2">Your message has been received. We'll respond shortly.</p>
                    <Button className="mt-6" variant="outline" onClick={() => setSubmitted(false)}>Send Another</Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-soft border-border">
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Your full name" required />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="your@email.com" required />
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="What is this about?" required />
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Your message..." rows={5} required />
                      </div>
                      <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-gold-dark">
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;

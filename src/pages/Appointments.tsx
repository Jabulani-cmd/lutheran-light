import { useState } from "react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar, Heart, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Appointments = () => {
  const { toast } = useToast();
  const [appointmentSubmitted, setAppointmentSubmitted] = useState(false);
  const [counsellingSubmitted, setCounsellingSubmitted] = useState(false);

  const handleAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentSubmitted(true);
    toast({ title: "Appointment Requested", description: "We'll confirm your appointment shortly." });
  };

  const handleCounselling = (e: React.FormEvent) => {
    e.preventDefault();
    setCounsellingSubmitted(true);
    toast({ title: "Counselling Request Sent", description: "A counsellor will reach out to you soon. All submissions are confidential." });
  };

  return (
    <Layout>
      <section className="bg-gradient-purple py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Appointments & Counselling</h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Schedule a meeting with our pastor or request confidential counselling support.
          </p>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Appointment Booking */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="font-display text-2xl font-bold text-foreground">Book an Appointment</h2>
              </div>
              {appointmentSubmitted ? (
                <Card className="shadow-soft border-border">
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-display text-xl font-semibold text-foreground">Request Submitted</h3>
                    <p className="text-muted-foreground mt-2">We will contact you to confirm your appointment.</p>
                    <Button className="mt-6" variant="outline" onClick={() => setAppointmentSubmitted(false)}>Book Another</Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-soft border-border">
                  <CardContent className="p-6">
                    <form onSubmit={handleAppointment} className="space-y-4">
                      <div>
                        <Label htmlFor="apt-name">Full Name</Label>
                        <Input id="apt-name" placeholder="Your full name" required />
                      </div>
                      <div>
                        <Label htmlFor="apt-email">Email</Label>
                        <Input id="apt-email" type="email" placeholder="your@email.com" required />
                      </div>
                      <div>
                        <Label htmlFor="apt-phone">Phone Number</Label>
                        <Input id="apt-phone" type="tel" placeholder="+263..." required />
                      </div>
                      <div>
                        <Label htmlFor="apt-with">Appointment With</Label>
                        <Select required>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pastor">Pastor N. Dlamini</SelectItem>
                            <SelectItem value="elder-moyo">Elder J. Moyo</SelectItem>
                            <SelectItem value="elder-ncube">Elder T. Ncube</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="apt-date">Preferred Date</Label>
                        <Input id="apt-date" type="date" required />
                      </div>
                      <div>
                        <Label htmlFor="apt-reason">Reason for Appointment</Label>
                        <Textarea id="apt-reason" placeholder="Briefly describe the purpose..." rows={3} />
                      </div>
                      <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-purple-dark">
                        Request Appointment
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Counselling */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Heart className="h-6 w-6 text-primary" />
                <h2 className="font-display text-2xl font-bold text-foreground">Counselling Request</h2>
              </div>
              <p className="text-muted-foreground mb-4 text-sm">All counselling submissions are handled with strict confidentiality.</p>
              {counsellingSubmitted ? (
                <Card className="shadow-soft border-border">
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-display text-xl font-semibold text-foreground">Request Received</h3>
                    <p className="text-muted-foreground mt-2">A counsellor will contact you confidentially.</p>
                    <Button className="mt-6" variant="outline" onClick={() => setCounsellingSubmitted(false)}>Submit Another</Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-soft border-border">
                  <CardContent className="p-6">
                    <form onSubmit={handleCounselling} className="space-y-4">
                      <div>
                        <Label htmlFor="c-name">Full Name</Label>
                        <Input id="c-name" placeholder="Your full name" required />
                      </div>
                      <div>
                        <Label htmlFor="c-contact">Phone or Email</Label>
                        <Input id="c-contact" placeholder="How should we reach you?" required />
                      </div>
                      <div>
                        <Label htmlFor="c-type">Type of Counselling</Label>
                        <Select required>
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grief">Grief & Bereavement</SelectItem>
                            <SelectItem value="marriage">Marriage & Family</SelectItem>
                            <SelectItem value="spiritual">Spiritual Guidance</SelectItem>
                            <SelectItem value="youth">Youth Counselling</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="c-dates">Preferred Dates</Label>
                        <Input id="c-dates" placeholder="e.g. Weekdays after 2 PM" required />
                      </div>
                      <div>
                        <Label htmlFor="c-message">Message</Label>
                        <Textarea id="c-message" placeholder="Share what's on your heart (confidential)..." rows={4} required />
                      </div>
                      <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-purple-dark">
                        Submit Request
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

export default Appointments;

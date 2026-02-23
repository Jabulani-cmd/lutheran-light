import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Image, Megaphone, CalendarDays, HandHeart } from "lucide-react";
import logo from "@/assets/umplogo2.png";
import AdminGallery from "@/components/admin/AdminGallery";
import AdminAnnouncements from "@/components/admin/AdminAnnouncements";
import AdminEvents from "@/components/admin/AdminEvents";
import AdminPrayerRequests from "@/components/admin/AdminPrayerRequests";

const Admin = () => {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8 w-8" />
            <span className="font-display text-lg font-bold text-primary">Admin Portal</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      {/* Dashboard */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="gallery">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="gallery" className="flex items-center gap-2"><Image className="h-4 w-4" /> Gallery</TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center gap-2"><Megaphone className="h-4 w-4" /> Announcements</TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Events</TabsTrigger>
            <TabsTrigger value="prayers" className="flex items-center gap-2"><HandHeart className="h-4 w-4" /> Prayer Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="gallery"><AdminGallery /></TabsContent>
          <TabsContent value="announcements"><AdminAnnouncements /></TabsContent>
          <TabsContent value="events"><AdminEvents /></TabsContent>
          <TabsContent value="prayers"><AdminPrayerRequests /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Calendar, ImageIcon, FileText } from "lucide-react";

const eventCategories = ["Worship", "Fellowship", "Outreach", "Youth"];

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  end_date: string | null;
  end_time: string | null;
  location: string | null;
  category: string;
  poster_image_url: string | null;
  programme_document_url: string | null;
  created_at: string;
}

const AdminEvents = () => {
  const [items, setItems] = useState<Event[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Worship");
  const [loading, setLoading] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [programmeFile, setProgrammeFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [programmeFileName, setProgrammeFileName] = useState<string | null>(null);
  const posterRef = useRef<HTMLInputElement>(null);
  const programmeRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: true });
    if (data) setItems(data as Event[]);
  };

  useEffect(() => { fetchItems(); }, []);

  const reset = () => {
    setTitle(""); setDescription(""); setEventDate(""); setEventTime(""); setEndDate(""); setEndTime(""); setLocation(""); setCategory("Worship"); setEditing(null);
    setPosterFile(null); setProgrammeFile(null); setPosterPreview(null); setProgrammeFileName(null);
  };

  const openEdit = (item: Event) => {
    setEditing(item); setTitle(item.title); setDescription(item.description || ""); setEventDate(item.event_date); setEventTime(item.event_time || ""); setEndDate(item.end_date || ""); setEndTime(item.end_time || ""); setLocation(item.location || ""); setCategory(item.category);
    setPosterPreview(item.poster_image_url || null);
    setProgrammeFileName(item.programme_document_url ? item.programme_document_url.split("/").pop() || "Document" : null);
    setPosterFile(null); setProgrammeFile(null);
    setOpen(true);
  };

  const uploadFile = async (file: File, bucket: string, folder: string): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let posterUrl = editing?.poster_image_url || null;
      let programmeUrl = editing?.programme_document_url || null;

      if (posterFile) {
        posterUrl = await uploadFile(posterFile, "event-posters", "posters");
      }
      if (programmeFile) {
        programmeUrl = await uploadFile(programmeFile, "event-programmes", "programmes");
      }

      const payload = {
        title, description, event_date: eventDate, event_time: eventTime,
        end_date: endDate || null, end_time: endTime || null,
        location, category,
        poster_image_url: posterUrl, programme_document_url: programmeUrl,
      };

      if (editing) {
        const { error } = await supabase.from("events").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast({ title: "Event updated" });
      } else {
        const { error } = await supabase.from("events").insert(payload);
        if (error) throw error;
        toast({ title: "Event added" });
      }
      setOpen(false); reset(); fetchItems();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); fetchItems(); }
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleProgrammeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProgrammeFile(file);
      setProgrammeFileName(file.name);
    }
  };

  const formatDateRange = (item: Event) => {
    const start = item.event_date;
    const end = item.end_date;
    const startTime = item.event_time || "";
    const endTime = item.end_time || "";
    
    let result = start;
    if (startTime) result += ` ${startTime}`;
    if (end) {
      result += ` → ${end}`;
      if (endTime) result += ` ${endTime}`;
    } else if (endTime) {
      result += ` → ${endTime}`;
    }
    if (item.location) result += ` • ${item.location}`;
    return result;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Events Management</h2>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Add Event</Button></DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Event</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
              <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></div>
              
              {/* Start Date & Time */}
              <div className="space-y-1">
                <Label className="text-sm font-semibold">Start Date & Time</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-xs text-muted-foreground">Start Date</Label><Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required /></div>
                  <div><Label className="text-xs text-muted-foreground">Start Time</Label><Input value={eventTime} onChange={(e) => setEventTime(e.target.value)} placeholder="e.g. 9:00 AM" /></div>
                </div>
              </div>

              {/* End Date & Time */}
              <div className="space-y-1">
                <Label className="text-sm font-semibold">End Date & Time</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-xs text-muted-foreground">End Date</Label><Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
                  <div><Label className="text-xs text-muted-foreground">End Time</Label><Input value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="e.g. 5:00 PM" /></div>
                </div>
                <p className="text-xs text-muted-foreground">Leave blank if the event is a single day/time. Events disappear after end date/time passes.</p>
              </div>

              <div><Label>Location</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} /></div>
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {eventCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {/* Poster Upload */}
              <div>
                <Label>Event Poster Image</Label>
                <input ref={posterRef} type="file" accept="image/*" onChange={handlePosterChange} className="hidden" />
                <Button type="button" variant="outline" className="w-full mt-1" onClick={() => posterRef.current?.click()}>
                  <ImageIcon className="h-4 w-4 mr-2" /> {posterFile ? posterFile.name : posterPreview ? "Change Poster" : "Upload Poster"}
                </Button>
                {posterPreview && (
                  <img src={posterPreview} alt="Poster preview" className="mt-2 rounded-lg max-h-40 object-contain mx-auto" />
                )}
              </div>
              {/* Programme Document Upload */}
              <div>
                <Label>Programme Document (PDF)</Label>
                <input ref={programmeRef} type="file" accept=".pdf,.doc,.docx" onChange={handleProgrammeChange} className="hidden" />
                <Button type="button" variant="outline" className="w-full mt-1" onClick={() => programmeRef.current?.click()}>
                  <FileText className="h-4 w-4 mr-2" /> {programmeFile ? programmeFile.name : programmeFileName ? "Change Document" : "Upload Programme"}
                </Button>
                {programmeFileName && !programmeFile && (
                  <p className="text-xs text-muted-foreground mt-1">Current: {programmeFileName}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No events yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {item.poster_image_url ? (
                    <img src={item.poster_image_url} alt={item.title} className="w-14 h-14 object-cover rounded-lg shrink-0" />
                  ) : (
                    <div className="bg-primary/10 rounded-lg p-2 shrink-0"><Calendar className="h-5 w-5 text-primary" /></div>
                  )}
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{formatDateRange(item)}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{item.category}</span>
                      {item.poster_image_url && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1"><ImageIcon className="h-3 w-3" />Poster</span>}
                      {item.programme_document_url && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1"><FileText className="h-3 w-3" />Programme</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => openEdit(item)}><Pencil className="h-3 w-3" /></Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEvents;

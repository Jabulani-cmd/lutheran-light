import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Trash2, Check, X, Upload, Plus } from "lucide-react";

const AdminChoir = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [newMember, setNewMember] = useState({ first_name: "", last_name: "", phone: "", email: "", voice_part: "soprano" });
  const [uploading, setUploading] = useState(false);

  const fetchMembers = async () => {
    const { data } = await supabase.from("choir_members").select("*").order("created_at", { ascending: false });
    if (data) setMembers(data);
  };

  const fetchPhotos = async () => {
    const { data } = await supabase.from("choir_photos").select("*").order("created_at", { ascending: false });
    if (data) setPhotos(data);
  };

  useEffect(() => { fetchMembers(); fetchPhotos(); }, []);

  const toggleApproval = async (id: string, current: boolean) => {
    await supabase.from("choir_members").update({ is_approved: !current }).eq("id", id);
    fetchMembers();
    toast({ title: !current ? "Member approved" : "Member unapproved" });
  };

  const deleteMember = async (id: string) => {
    await supabase.from("choir_members").delete().eq("id", id);
    fetchMembers();
    toast({ title: "Member removed" });
  };

  const addMember = async () => {
    if (!newMember.first_name || !newMember.last_name) return;
    await supabase.from("choir_members").insert([{ ...newMember, is_approved: true }]);
    setNewMember({ first_name: "", last_name: "", phone: "", email: "", voice_part: "soprano" });
    fetchMembers();
    toast({ title: "Member added" });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGroupPhoto: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const filePath = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("choir-photos").upload(filePath, file);
    if (uploadError) { toast({ title: "Upload failed", variant: "destructive" }); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("choir-photos").getPublicUrl(filePath);
    await supabase.from("choir_photos").insert([{ image_url: urlData.publicUrl, is_group_photo: isGroupPhoto, caption: isGroupPhoto ? "Choir group photo" : "" }]);
    fetchPhotos();
    setUploading(false);
    toast({ title: "Photo uploaded" });
  };

  const deletePhoto = async (id: string) => {
    await supabase.from("choir_photos").delete().eq("id", id);
    fetchPhotos();
    toast({ title: "Photo deleted" });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          {/* Add Member */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Add Choir Member</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Input placeholder="First Name" value={newMember.first_name} onChange={(e) => setNewMember({ ...newMember, first_name: e.target.value })} />
                <Input placeholder="Last Name" value={newMember.last_name} onChange={(e) => setNewMember({ ...newMember, last_name: e.target.value })} />
                <Input placeholder="Phone" value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} />
                <Select value={newMember.voice_part} onValueChange={(v) => setNewMember({ ...newMember, voice_part: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soprano">Soprano</SelectItem>
                    <SelectItem value="alto">Alto</SelectItem>
                    <SelectItem value="tenor">Tenor</SelectItem>
                    <SelectItem value="bass">Bass</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addMember}><Plus className="h-4 w-4 mr-1" /> Add</Button>
              </div>
            </CardContent>
          </Card>

          {/* Members Table */}
          <Card>
            <CardHeader><CardTitle className="text-lg">All Choir Members ({members.length})</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Voice Part</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{m.first_name} {m.last_name}</TableCell>
                      <TableCell className="capitalize">{m.voice_part}</TableCell>
                      <TableCell>{m.phone || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={m.is_approved ? "default" : "secondary"}>{m.is_approved ? "Approved" : "Pending"}</Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => toggleApproval(m.id, m.is_approved)}>
                          {m.is_approved ? <X className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteMember(m.id)}><Trash2 className="h-3 w-3" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos" className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Upload Photos</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Group Photo</Label>
                <Input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, true)} disabled={uploading} />
              </div>
              <div>
                <Label>Additional Photo</Label>
                <Input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, false)} disabled={uploading} />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((p) => (
              <div key={p.id} className="relative group">
                <img src={p.image_url} alt={p.caption || "Choir"} className="w-full h-32 object-cover rounded-lg" />
                {p.is_group_photo && <Badge className="absolute top-1 left-1">Group</Badge>}
                <Button size="sm" variant="destructive" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deletePhoto(p.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminChoir;

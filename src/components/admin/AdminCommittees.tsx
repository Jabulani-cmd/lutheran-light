import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Plus, Users, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ImageCropDialog from "./ImageCropDialog";

interface CommitteeMember {
  id: string;
  committee_id: string;
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
}

const AdminCommittees = () => {
  const { toast } = useToast();
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [expandedCommittee, setExpandedCommittee] = useState<string | null>(null);

  // Committee form
  const [newCommitteeName, setNewCommitteeName] = useState("");
  const [newCommitteeDesc, setNewCommitteeDesc] = useState("");

  // Member form
  const [memberName, setMemberName] = useState("");
  const [memberTitle, setMemberTitle] = useState("");
  const [memberDesc, setMemberDesc] = useState("");
  const [memberPhoto, setMemberPhoto] = useState<File | null>(null);
  const [addingMemberTo, setAddingMemberTo] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Crop
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const fetchAll = async () => {
    const { data: c } = await supabase.from("committees").select("*").order("sort_order");
    const { data: m } = await supabase.from("committee_members").select("*").order("sort_order");
    setCommittees(c || []);
    setMembers(m || []);
  };

  useEffect(() => { fetchAll(); }, []);

  const addCommittee = async () => {
    if (!newCommitteeName.trim()) return;
    const { error } = await supabase.from("committees").insert({
      name: newCommitteeName.trim(),
      description: newCommitteeDesc.trim() || null,
      sort_order: committees.length,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Committee added" });
    setNewCommitteeName(""); setNewCommitteeDesc("");
    fetchAll();
  };

  const deleteCommittee = async (id: string) => {
    if (!confirm("Delete this committee and all its members?")) return;
    await supabase.from("committees").delete().eq("id", id);
    toast({ title: "Committee deleted" });
    fetchAll();
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    const reader = new FileReader();
    reader.onload = () => setCropImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    const file = new File([croppedBlob], pendingFile?.name || "photo.jpg", { type: "image/jpeg" });
    setMemberPhoto(file);
    setCropImage(null);
    setPendingFile(null);
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `members/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("committee-photos").upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from("committee-photos").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const addMember = async (committeeId: string) => {
    if (!memberName.trim()) return;
    setSaving(true);
    try {
      let photoUrl: string | null = null;
      if (memberPhoto) photoUrl = await uploadPhoto(memberPhoto);

      const committeeMembers = members.filter(m => m.committee_id === committeeId);
      const { error } = await supabase.from("committee_members").insert({
        committee_id: committeeId,
        full_name: memberName.trim(),
        title: memberTitle.trim() || null,
        description: memberDesc.trim() || null,
        photo_url: photoUrl,
        sort_order: committeeMembers.length,
      });
      if (error) throw error;
      toast({ title: "Member added" });
      setMemberName(""); setMemberTitle(""); setMemberDesc(""); setMemberPhoto(null);
      setAddingMemberTo(null);
      fetchAll();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const deleteMember = async (id: string) => {
    if (!confirm("Delete this member?")) return;
    await supabase.from("committee_members").delete().eq("id", id);
    toast({ title: "Member deleted" });
    fetchAll();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Add New Committee</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Committee Name</Label><Input value={newCommitteeName} onChange={e => setNewCommitteeName(e.target.value)} placeholder="e.g. Church Council" /></div>
          <div><Label>Description (optional)</Label><Textarea value={newCommitteeDesc} onChange={e => setNewCommitteeDesc(e.target.value)} placeholder="Brief description..." rows={2} /></div>
          <Button onClick={addCommittee} disabled={!newCommitteeName.trim()}><Plus className="h-4 w-4 mr-2" /> Add Committee</Button>
        </CardContent>
      </Card>

      {committees.map((committee) => {
        const committeeMembers = members.filter(m => m.committee_id === committee.id);
        const isExpanded = expandedCommittee === committee.id;
        return (
          <Card key={committee.id}>
            <CardHeader className="cursor-pointer" onClick={() => setExpandedCommittee(isExpanded ? null : committee.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{committee.name}</CardTitle>
                  <span className="text-sm text-muted-foreground">({committeeMembers.length} members)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); deleteCommittee(committee.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </div>
              {committee.description && <p className="text-sm text-muted-foreground mt-1">{committee.description}</p>}
            </CardHeader>
            {isExpanded && (
              <CardContent className="space-y-4">
                {/* Existing members */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {committeeMembers.map((member) => (
                    <div key={member.id} className="border border-border rounded-lg p-4 text-center relative group">
                      <Button variant="ghost" size="icon" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteMember(member.id)}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                      <Avatar className="h-16 w-16 mx-auto mb-2">
                        <AvatarImage src={member.photo_url || ""} alt={member.full_name} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary">{member.full_name.split(" ").map(n => n[0]).join("").slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-sm">{member.full_name}</p>
                      {member.title && <p className="text-xs text-primary">{member.title}</p>}
                      {member.description && <p className="text-xs text-muted-foreground mt-1">{member.description}</p>}
                    </div>
                  ))}
                </div>

                {/* Add member form */}
                {addingMemberTo === committee.id ? (
                  <div className="border border-border rounded-lg p-4 space-y-3">
                    <div><Label>Full Name</Label><Input value={memberName} onChange={e => setMemberName(e.target.value)} placeholder="Full name" /></div>
                    <div><Label>Title / Role</Label><Input value={memberTitle} onChange={e => setMemberTitle(e.target.value)} placeholder="e.g. Chairperson" /></div>
                    <div><Label>Brief Description</Label><Textarea value={memberDesc} onChange={e => setMemberDesc(e.target.value)} placeholder="Brief description..." rows={2} /></div>
                    <div><Label>Photo</Label><Input type="file" accept="image/*" onChange={handlePhotoSelect} /></div>
                    {memberPhoto && <p className="text-xs text-muted-foreground">Photo ready: {memberPhoto.name}</p>}
                    <div className="flex gap-2">
                      <Button onClick={() => addMember(committee.id)} disabled={saving || !memberName.trim()}>{saving ? "Saving..." : "Add Member"}</Button>
                      <Button variant="outline" onClick={() => { setAddingMemberTo(null); setMemberName(""); setMemberTitle(""); setMemberDesc(""); setMemberPhoto(null); }}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => setAddingMemberTo(committee.id)}><Plus className="h-4 w-4 mr-2" /> Add Member</Button>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}

      {cropImage && (
        <ImageCropDialog
          open={!!cropImage}
          onOpenChange={(open) => { if (!open) { setCropImage(null); setPendingFile(null); } }}
          imageSrc={cropImage}
          onCropComplete={handleCropComplete}
          aspect={1}
        />
      )}
    </div>
  );
};

export default AdminCommittees;

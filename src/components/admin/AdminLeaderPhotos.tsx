import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import ImageCropDialog, { useImageCrop } from "./ImageCropDialog";

const leaders = [
  "Rev. M. Ndlovu",
  "Mrs. P. Ngwenya",
  "Mr. P. Ndou",
  "Mrs. T. Dube",
  "Mrs. T. Ncube",
  "Mr. L. Jamela",
  "Mrs. S. Jamela",
  "Miss M. Mangena",
];

interface LeaderPhoto {
  name: string;
  fileName: string;
  url: string;
}

const AdminLeaderPhotos = () => {
  const [photos, setPhotos] = useState<LeaderPhoto[]>([]);
  const [selectedLeader, setSelectedLeader] = useState("");
  const [loading, setLoading] = useState(false);
  const { cropDialogOpen, setCropDialogOpen, imageSrc, openCropDialog, resetCrop } = useImageCrop();

  const fetchPhotos = async () => {
    const { data } = await supabase.storage.from("leader-photos").list();
    if (data) {
      const items: LeaderPhoto[] = data
        .filter((f) => f.name !== ".emptyFolderPlaceholder")
        .map((f) => {
          const name = f.name.replace(/\.[^/.]+$/, "").replace(/-/g, " ");
          const { data: urlData } = supabase.storage.from("leader-photos").getPublicUrl(f.name);
          return { name, fileName: f.name, url: `${urlData.publicUrl}?t=${Date.now()}` };
        });
      setPhotos(items);
    }
  };

  useEffect(() => { fetchPhotos(); }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!selectedLeader) {
      toast({ title: "Please select a leader first", variant: "destructive" });
      return;
    }
    openCropDialog(file);
  };

  const handleCropDone = async (blob: Blob) => {
    setCropDialogOpen(false);
    setLoading(true);
    try {
      const fileName = `${selectedLeader.replace(/\s+/g, "-").replace(/\./g, "")}.jpeg`;
      const existing = photos.find((p) => p.name.toLowerCase() === selectedLeader.toLowerCase());
      if (existing) {
        await supabase.storage.from("leader-photos").remove([existing.fileName]);
      }
      const { error } = await supabase.storage.from("leader-photos").upload(fileName, blob, {
        upsert: true,
        contentType: "image/jpeg",
      });
      if (error) throw error;
      toast({ title: "Photo uploaded successfully" });
      setSelectedLeader("");
      fetchPhotos();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
      resetCrop();
    }
  };

  const handleDelete = async (photo: LeaderPhoto) => {
    if (!confirm(`Remove photo for ${photo.name}?`)) return;
    const { error } = await supabase.storage.from("leader-photos").remove([photo.fileName]);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Photo removed" });
      fetchPhotos();
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Leader Photos</h2>

      <Card className="mb-6">
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label>Select Leader</Label>
            <Select value={selectedLeader} onValueChange={setSelectedLeader}>
              <SelectTrigger><SelectValue placeholder="Choose a leader..." /></SelectTrigger>
              <SelectContent>
                {leaders.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Photo (opens crop tool)</Label>
            <Input type="file" accept="image/*" onChange={handleFileSelect} disabled={loading} />
            {loading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
          </div>
        </CardContent>
      </Card>

      <ImageCropDialog
        open={cropDialogOpen}
        onOpenChange={setCropDialogOpen}
        imageSrc={imageSrc}
        onCropComplete={handleCropDone}
        aspect={1}
        cropShape="round"
        title="Crop Leader Photo"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <Card key={photo.fileName} className="overflow-hidden">
            <CardContent className="p-4 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-3">
                <AvatarImage src={photo.url} alt={photo.name} />
                <AvatarFallback>{photo.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <p className="font-medium text-sm text-foreground capitalize">{photo.name}</p>
              <Button size="sm" variant="destructive" className="mt-2" onClick={() => handleDelete(photo)}>
                <Trash2 className="h-3 w-3 mr-1" /> Remove
              </Button>
            </CardContent>
          </Card>
        ))}
        {photos.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">No leader photos uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminLeaderPhotos;

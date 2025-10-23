import { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { trpc } from '@/lib/trpc';
import { Plus, Trash2, Loader2, Music } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAudio() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
  });

  const { data: tracks, isLoading, refetch } = trpc.audio.getAll.useQuery();
  const createTrack = trpc.audio.create.useMutation();
  const deleteTrack = trpc.audio.delete.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTrack.mutateAsync(formData);
      toast.success('Audio track added successfully');
      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      toast.error('Failed to add audio track');
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this audio track?')) return;

    try {
      await deleteTrack.mutateAsync({ id });
      toast.success('Audio track deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete audio track');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold glow-text">Background Audio</h1>
            <p className="text-muted-foreground mt-2">
              Manage background music tracks that play on the website
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="glow-box">
                <Plus className="mr-2 h-5 w-5" />
                Add Track
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Audio Track</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Track Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Ambient Track 1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="url">Audio URL *</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com/audio.mp3"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: MP3, WAV, OGG
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={createTrack.isPending}>
                    {createTrack.isPending ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Adding...</>
                    ) : (
                      'Add Track'
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : tracks && tracks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <Card key={track.id} className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Music className="mr-2 h-5 w-5 text-primary" />
                    {track.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <audio controls className="w-full">
                    <source src={track.url} />
                    Your browser does not support the audio element.
                  </audio>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(track.id)}
                    disabled={deleteTrack.isPending}
                    className="w-full"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Track
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-primary/20">
            <CardContent className="py-12 text-center">
              <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No audio tracks yet.</p>
              <p className="text-sm text-muted-foreground">
                Add background music tracks to enhance the shopping experience.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}


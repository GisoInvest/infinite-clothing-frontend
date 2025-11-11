import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Music, Volume2, VolumeX } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminSettings() {
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Query current music state
  const { data: currentMusicState, refetch } = trpc.audio.getMusicEnabled.useQuery();
  
  // Mutation to update music state
  const setMusicMutation = trpc.audio.setMusicEnabled.useMutation({
    onSuccess: (data) => {
      setMusicEnabled(data.enabled);
      toast.success(data.enabled ? "Background music enabled globally" : "Background music disabled globally");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update music setting: ${error.message}`);
    },
  });

  useEffect(() => {
    if (currentMusicState !== undefined) {
      setMusicEnabled(currentMusicState);
    }
  }, [currentMusicState]);

  const handleMusicToggle = async (enabled: boolean) => {
    setIsLoading(true);
    try {
      await setMusicMutation.mutateAsync({ enabled });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Admin Settings</h1>
          <p className="text-muted-foreground">
            Manage global website settings and configurations
          </p>
        </div>

        {/* Music Control Card */}
        <Card className="p-6 border-primary/20 glow-box">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Background Music Control</h2>
                <p className="text-sm text-muted-foreground">
                  Control background music playback across the entire website
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="music-toggle" className="text-base font-medium">
                    Global Music Playback
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {musicEnabled 
                      ? "Music is currently playing for all visitors" 
                      : "Music is currently stopped for all visitors"}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  {musicEnabled ? (
                    <Volume2 className="w-5 h-5 text-primary animate-pulse" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-muted-foreground" />
                  )}
                  
                  <Switch
                    id="music-toggle"
                    checked={musicEnabled}
                    onCheckedChange={handleMusicToggle}
                    disabled={isLoading}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm font-bold">ℹ</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">How it works:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>When enabled, background music plays automatically for all website visitors</li>
                      <li>When disabled, music stops globally across the entire website</li>
                      <li>Changes take effect immediately for all active sessions</li>
                      <li>Visitors can still control their own volume or mute individually</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <Button
                  onClick={() => handleMusicToggle(true)}
                  disabled={musicEnabled || isLoading}
                  variant="default"
                  className="flex-1"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Start Music
                </Button>
                <Button
                  onClick={() => handleMusicToggle(false)}
                  disabled={!musicEnabled || isLoading}
                  variant="outline"
                  className="flex-1"
                >
                  <VolumeX className="w-4 h-4 mr-2" />
                  Stop Music
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Additional Settings Cards can be added here */}
      </div>
    </div>
  );
}

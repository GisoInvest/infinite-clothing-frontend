import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { data: tracks } = trpc.audio.getActive.useQuery();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !tracks || tracks.length === 0) return;

    // Set initial volume
    audio.volume = 0.3;

    const handleEnded = () => {
      // Move to next track
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [tracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !tracks || tracks.length === 0) return;

    // Load new track
    audio.src = tracks[currentTrackIndex].url;
    if (isPlaying) {
      audio.play().catch(console.error);
    }
  }, [currentTrackIndex, tracks]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  if (!tracks || tracks.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="icon"
        onClick={togglePlay}
        className="h-14 w-14 rounded-full glow-box shadow-lg"
        title={isPlaying ? 'Mute background music' : 'Play background music'}
      >
        {isPlaying ? (
          <Volume2 className="h-6 w-6" />
        ) : (
          <VolumeX className="h-6 w-6" />
        )}
      </Button>
      <audio
        ref={audioRef}
        loop={false}
        preload="auto"
      />
    </div>
  );
}


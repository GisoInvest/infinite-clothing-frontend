import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Share2, Copy, Check, Facebook, Instagram } from "lucide-react";

interface SocialMediaCopyProps {
  post: {
    title: string;
    excerpt?: string;
    coverImage?: string;
    tags?: string[];
    slug: string;
  };
}

export default function SocialMediaCopy({ post }: SocialMediaCopyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

  const baseUrl = window.location.origin;
  const postUrl = `${baseUrl}/blog/${post.slug}`;

  // Generate platform-specific content
  const generateContent = (platform: 'facebook' | 'instagram' | 'tiktok') => {
    const hashtags = post.tags?.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ') || '';
    
    switch (platform) {
      case 'facebook':
        return `${post.title}

${post.excerpt || ''}

Read the full article: ${postUrl}

${hashtags}

#InfiniteClothing #Streetwear #Fashion`;

      case 'instagram':
        // Instagram has character limits and hashtag best practices
        const instagramHashtags = post.tags?.slice(0, 10).map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ') || '';
        return `${post.title}

${post.excerpt || ''}

🔗 Link in bio or visit: ${postUrl}

${instagramHashtags}
#InfiniteClothing #Streetwear #Fashion #Style #OOTD #StreetStyle #FashionBlogger #Cyberpunk #UrbanFashion #InfiniteCl07hing`;

      case 'tiktok':
        // TikTok prefers shorter captions with trending hashtags
        const tiktokHashtags = post.tags?.slice(0, 5).map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ') || '';
        return `${post.title} ✨

${post.excerpt?.substring(0, 100) || ''}...

Full post: ${postUrl}

${tiktokHashtags}
#InfiniteClothing #Streetwear #Fashion #FYP #ForYou #Viral #TikTokFashion`;

      default:
        return '';
    }
  };

  const handleCopy = async (platform: 'facebook' | 'instagram' | 'tiktok') => {
    const content = generateContent(platform);
    try {
      await navigator.clipboard.writeText(content);
      setCopiedPlatform(platform);
      toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} post copied to clipboard!`);
      setTimeout(() => setCopiedPlatform(null), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const platforms = [
    {
      id: 'facebook' as const,
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-500',
      description: 'Optimized for Facebook posts with full details'
    },
    {
      id: 'instagram' as const,
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-500',
      description: 'Instagram-ready with hashtags and emoji'
    },
    {
      id: 'tiktok' as const,
      name: 'TikTok',
      icon: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      color: 'text-cyan-400',
      description: 'Short and catchy for TikTok captions'
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Share2 className="w-4 h-4" />
          Copy for Social Media
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Copy Content for Social Media</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Click "Copy" to copy pre-formatted content for each platform, then paste it into your social media post.
          </p>

          {platforms.map((platform) => {
            const Icon = platform.icon;
            const content = generateContent(platform.id);
            const isCopied = copiedPlatform === platform.id;

            return (
              <Card key={platform.id} className="p-4 border-primary/20 glow-box">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${platform.color}`} />
                    <div>
                      <h3 className="font-semibold">{platform.name}</h3>
                      <p className="text-xs text-muted-foreground">{platform.description}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isCopied ? "default" : "outline"}
                    onClick={() => handleCopy(platform.id)}
                    className="gap-2"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                
                <Textarea
                  value={content}
                  readOnly
                  className="font-mono text-sm min-h-[150px] bg-muted/50"
                  onClick={(e) => e.currentTarget.select()}
                />
                
                <div className="mt-2 text-xs text-muted-foreground">
                  {content.length} characters
                </div>
              </Card>
            );
          })}

          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="font-semibold mb-2">Tips for Social Media Posting:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li><strong>Facebook:</strong> Post during peak hours (1-4 PM) for maximum engagement</li>
              <li><strong>Instagram:</strong> Upload your cover image first, then paste the caption</li>
              <li><strong>TikTok:</strong> Create a video showcasing the blog content, then use this as the caption</li>
              <li>Consider scheduling posts across different times for each platform</li>
              <li>Engage with comments to boost visibility</li>
            </ul>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

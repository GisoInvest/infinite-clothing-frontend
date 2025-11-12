import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { trpc } from '@/lib/trpc';
import { Loader2, Mail, Send, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function EmailCampaigns() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'newsletter' as 'newsletter' | 'promotion' | 'blog_notification' | 'welcome',
  });

  const { data: campaigns = [], isLoading, refetch } = trpc.emailCampaigns.getAll.useQuery();
  
  const createCampaign = trpc.emailCampaigns.create.useMutation({
    onSuccess: () => {
      toast.success('Campaign created successfully!');
      setFormData({ name: '', subject: '', content: '', type: 'newsletter' });
      setIsOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create campaign');
    },
  });

  const sendCampaign = trpc.emailCampaigns.send.useMutation({
    onSuccess: (data) => {
      toast.success(`Campaign sent to ${data.recipientCount} subscribers!`);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send campaign');
    },
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.subject || !formData.content) {
      toast.error('Please fill in all fields');
      return;
    }

    createCampaign.mutate(formData);
  };

  const handleSend = (id: number) => {
    if (confirm('Are you sure you want to send this campaign to all active subscribers?')) {
      sendCampaign.mutate({ id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Campaigns</h1>
          <p className="text-muted-foreground mt-2">
            Create and send email campaigns to your subscribers
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="glow-box">
              <Mail className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Email Campaign</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name *</Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g., Summer Sale 2024"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-type">Campaign Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="blog_notification">Blog Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-subject">Email Subject *</Label>
                <Input
                  id="campaign-subject"
                  placeholder="e.g., Get 30% Off This Summer!"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-content">Email Content (HTML) *</Label>
                <Textarea
                  id="campaign-content"
                  placeholder="Enter HTML email content..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Use HTML for rich formatting. Include inline styles for best compatibility.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={createCampaign.isPending}
                  className="glow-box"
                >
                  {createCampaign.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Campaign
                </Button>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : campaigns.length === 0 ? (
          <Card className="p-12 border-primary/20 bg-card/50 text-center">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No email campaigns yet. Create your first campaign to get started!
            </p>
          </Card>
        ) : (
          campaigns.map((campaign) => (
            <Card key={campaign.id} className="p-6 border-primary/20 bg-card/50">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold">{campaign.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      campaign.status === 'sent' ? 'bg-green-500/20 text-green-500' :
                      campaign.status === 'scheduled' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-gray-500/20 text-gray-500'
                    }`}>
                      {campaign.status}
                    </span>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {campaign.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Subject:</strong> {campaign.subject}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
                    {campaign.sentAt && (
                      <span>Sent: {new Date(campaign.sentAt).toLocaleDateString()}</span>
                    )}
                    {campaign.recipientCount > 0 && (
                      <span>Recipients: {campaign.recipientCount}</span>
                    )}
                  </div>
                </div>

                {campaign.status === 'draft' && (
                  <Button
                    onClick={() => handleSend(campaign.id)}
                    disabled={sendCampaign.isPending}
                    className="glow-box"
                  >
                    {sendCampaign.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Send Now
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

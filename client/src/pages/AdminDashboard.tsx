'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { FileText, MessageSquare, TrendingUp, Download } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('customization');
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [status, setStatus] = useState('');
  const [partnershipTier, setPartnershipTier] = useState('');

  // Fetch customization enquiries
  const { data: customizationEnquiries, isLoading: customLoading, refetch: refetchCustom } = trpc.customizationEnquiries.getAll.useQuery(undefined, {
    enabled: activeTab === 'customization',
  });

  // Fetch business enquiries
  const { data: businessEnquiries, isLoading: businessLoading, refetch: refetchBusiness } = trpc.businessEnquiries.getAll.useQuery(undefined, {
    enabled: activeTab === 'business',
  });

  // Update customization enquiry
  const updateCustomMutation = trpc.customizationEnquiries.update.useMutation({
    onSuccess: () => {
      toast.success('Customization enquiry updated successfully');
      refetchCustom();
      setSelectedEnquiry(null);
      setAdminNotes('');
      setEstimatedPrice('');
      setStatus('');
    },
    onError: () => {
      toast.error('Failed to update enquiry');
    },
  });

  // Update business enquiry
  const updateBusinessMutation = trpc.businessEnquiries.update.useMutation({
    onSuccess: () => {
      toast.success('Business enquiry updated successfully');
      refetchBusiness();
      setSelectedEnquiry(null);
      setAdminNotes('');
      setPartnershipTier('');
      setStatus('');
    },
    onError: () => {
      toast.error('Failed to update enquiry');
    },
  });

  const handleUpdateCustomization = async () => {
    if (!selectedEnquiry) return;

    const updates: any = {};
    if (status) updates.status = status;
    if (adminNotes) updates.adminNotes = adminNotes;
    if (estimatedPrice) updates.estimatedPrice = parseInt(estimatedPrice) * 100; // Convert to cents

    await updateCustomMutation.mutateAsync({
      id: selectedEnquiry.id,
      ...updates,
    });
  };

  const handleUpdateBusiness = async () => {
    if (!selectedEnquiry) return;

    const updates: any = {};
    if (status) updates.status = status;
    if (adminNotes) updates.adminNotes = adminNotes;
    if (partnershipTier) updates.partnershipTier = partnershipTier;

    await updateBusinessMutation.mutateAsync({
      id: selectedEnquiry.id,
      ...updates,
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500',
      reviewed: 'bg-blue-500',
      quoted: 'bg-purple-500',
      in_production: 'bg-orange-500',
      completed: 'bg-green-500',
      cancelled: 'bg-red-500',
      contacted: 'bg-blue-500',
      negotiating: 'bg-purple-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500',
      archived: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage customization and business enquiries</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customization">Customization Enquiries</TabsTrigger>
            <TabsTrigger value="business">Business Enquiries</TabsTrigger>
          </TabsList>

          {/* Customization Enquiries Tab */}
          <TabsContent value="customization" className="space-y-6">
            {customLoading ? (
              <div className="text-center py-12">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Enquiries List */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Enquiries ({customizationEnquiries?.length || 0})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                      {customizationEnquiries?.map((enquiry: any) => (
                        <button
                          key={enquiry.id}
                          onClick={() => {
                            setSelectedEnquiry(enquiry);
                            setStatus(enquiry.status);
                            setAdminNotes(enquiry.adminNotes || '');
                            setEstimatedPrice(enquiry.estimatedPrice ? (enquiry.estimatedPrice / 100).toString() : '');
                          }}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            selectedEnquiry?.id === enquiry.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:bg-accent'
                          }`}
                        >
                          <div className="font-semibold text-sm">{enquiry.enquiryNumber}</div>
                          <div className="text-xs text-muted-foreground">{enquiry.fullName}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={`${getStatusColor(enquiry.status)} text-white text-xs`}>
                              {enquiry.status}
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Enquiry Details */}
                {selectedEnquiry && activeTab === 'customization' && (
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Enquiry Details</CardTitle>
                        <CardDescription>{selectedEnquiry.enquiryNumber}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-semibold">Customer Name</label>
                            <p className="text-sm text-muted-foreground">{selectedEnquiry.fullName}</p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold">Email</label>
                            <p className="text-sm text-muted-foreground">{selectedEnquiry.email}</p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold">Phone</label>
                            <p className="text-sm text-muted-foreground">{selectedEnquiry.phone}</p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold">Product Type</label>
                            <p className="text-sm text-muted-foreground">{selectedEnquiry.productType}</p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold">Quantity</label>
                            <p className="text-sm text-muted-foreground">{selectedEnquiry.quantity}</p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold">Fabric Quality</label>
                            <p className="text-sm text-muted-foreground">{selectedEnquiry.fabricQuality} GSM</p>
                          </div>
                        </div>

                        {selectedEnquiry.designDescription && (
                          <div>
                            <label className="text-sm font-semibold">Design Description</label>
                            <p className="text-sm text-muted-foreground">{selectedEnquiry.designDescription}</p>
                          </div>
                        )}

                        {selectedEnquiry.specialRequests && (
                          <div>
                            <label className="text-sm font-semibold">Special Requests</label>
                            <p className="text-sm text-muted-foreground">{selectedEnquiry.specialRequests}</p>
                          </div>
                        )}

                        {selectedEnquiry.designFileUrl && (
                          <div>
                            <a
                              href={selectedEnquiry.designFileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Download Design File
                            </a>
                          </div>
                        )}

                        <div className="pt-4 border-t">
                          <label className="text-sm font-semibold">Status</label>
                          <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full mt-2 px-3 py-2 border rounded-lg bg-background"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="quoted">Quoted</option>
                            <option value="in_production">In Production</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-semibold">Estimated Price (£)</label>
                          <Input
                            type="number"
                            value={estimatedPrice}
                            onChange={(e) => setEstimatedPrice(e.target.value)}
                            placeholder="0.00"
                            step="0.01"
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold">Admin Notes</label>
                          <Textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Add internal notes..."
                            className="mt-2"
                            rows={4}
                          />
                        </div>

                        <Button
                          onClick={handleUpdateCustomization}
                          disabled={updateCustomMutation.isPending}
                          className="w-full"
                        >
                          {updateCustomMutation.isPending ? 'Updating...' : 'Update Enquiry'}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Business Enquiries Tab */}
          <TabsContent value="business" className="space-y-6">
            {businessLoading ? (
              <div className="text-center py-12">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Enquiries List */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Enquiries ({businessEnquiries?.length || 0})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                      {businessEnquiries?.map((enquiry: any) => (
                        <button
                          key={enquiry.id}
                          onClick={() => {
                            setSelectedEnquiry(enquiry);
                            setStatus(enquiry.status);
                            setPartnershipTier(enquiry.partnershipTier || 'none');
                            setAdminNotes(enquiry.adminNotes || '');
                          }}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            selectedEnquiry?.id === enquiry.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:bg-accent'
                          }`}
                        >
                          <div className="font-semibold text-sm">{enquiry.enquiryNumber}</div>
                          <div className="text-xs text-muted-foreground">{enquiry.companyName}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={`${getStatusColor(enquiry.status)} text-white text-xs`}>
                              {enquiry.status}
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Enquiry Details */}
                {selectedEnquiry && activeTab === 'business' && (
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Enquiry Details</CardTitle>
                        <CardDescription>{selectedEnquiry.enquiryNumber}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-semibold">Company Name</label>
                            <p className="text-sm text-muted-foreground">{selectedEnquiry.companyName}</p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold">Contact Name</label>
                            <p className="text-sm text-muted-foreground">{selectedEnquiry.contactName}</p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold">Email</label>
                            <p className="text-sm text-muted-foreground">{selectedEnquiry.email}</p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold">Phone</label>
                            <p className="text-sm text-muted-foreground">{selectedEnquiry.phone}</p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold">Business Type</label>
                            <p className="text-sm text-muted-foreground">{selectedEnquiry.businessType}</p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold">Country</label>
                            <p className="text-sm text-muted-foreground">{selectedEnquiry.country}</p>
                          </div>
                        </div>

                        {selectedEnquiry.website && (
                          <div>
                            <label className="text-sm font-semibold">Website</label>
                            <a
                              href={selectedEnquiry.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              {selectedEnquiry.website}
                            </a>
                          </div>
                        )}

                        {selectedEnquiry.annualRevenue && (
                          <div>
                            <label className="text-sm font-semibold">Annual Revenue</label>
                            <p className="text-sm text-muted-foreground">{selectedEnquiry.annualRevenue}</p>
                          </div>
                        )}

                        <div>
                          <label className="text-sm font-semibold">Product Interest</label>
                          <p className="text-sm text-muted-foreground">{selectedEnquiry.productInterest}</p>
                        </div>

                        <div>
                          <label className="text-sm font-semibold">Business Background</label>
                          <p className="text-sm text-muted-foreground">{selectedEnquiry.businessBackground}</p>
                        </div>

                        {selectedEnquiry.marketingStrategy && (
                          <div>
                            <label className="text-sm font-semibold">Marketing Strategy</label>
                            <p className="text-sm text-muted-foreground">{selectedEnquiry.marketingStrategy}</p>
                          </div>
                        )}

                        <div className="pt-4 border-t">
                          <label className="text-sm font-semibold">Status</label>
                          <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full mt-2 px-3 py-2 border rounded-lg bg-background"
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="negotiating">Negotiating</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-semibold">Partnership Tier</label>
                          <select
                            value={partnershipTier}
                            onChange={(e) => setPartnershipTier(e.target.value)}
                            className="w-full mt-2 px-3 py-2 border rounded-lg bg-background"
                          >
                            <option value="none">None</option>
                            <option value="retail">Retail Partner</option>
                            <option value="distribution">Distribution Partner</option>
                            <option value="online">Online Partner</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-semibold">Admin Notes</label>
                          <Textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Add internal notes..."
                            className="mt-2"
                            rows={4}
                          />
                        </div>

                        <Button
                          onClick={handleUpdateBusiness}
                          disabled={updateBusinessMutation.isPending}
                          className="w-full"
                        >
                          {updateBusinessMutation.isPending ? 'Updating...' : 'Update Enquiry'}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

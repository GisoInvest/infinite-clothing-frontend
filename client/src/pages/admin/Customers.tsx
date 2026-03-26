import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Download, Trash2, Mail, Loader2, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  
  const customersQuery = trpc.customers.getAll.useQuery();
  const statsQuery = trpc.customers.getStats.useQuery();
  const deleteMutation = trpc.customers.delete.useMutation();

  const customers = customersQuery.data || [];
  const stats = statsQuery.data;

  const filteredCustomers = customers.filter(customer =>
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (email: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      await deleteMutation.mutateAsync({ email });
      toast.success('Customer deleted successfully');
      customersQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete customer');
    }
  };

  const handleExportCSV = () => {
    if (customers.length === 0) {
      toast.error('No customers to export');
      return;
    }

    const headers = ['Email', 'First Name', 'Last Name', 'Phone', 'Age Group', 'Country', 'City', 'Newsletter', 'Marketing Consent', 'Registered Date'];
    const rows = customers.map(c => [
      c.email,
      c.firstName,
      c.lastName,
      c.phone || '-',
      c.ageGroup || '-',
      c.country || '-',
      c.city || '-',
      c.newsletter ? 'Yes' : 'No',
      c.marketingConsent ? 'Yes' : 'No',
      new Date(c.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Customers exported successfully');
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(filteredCustomers.map(c => c.email));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (email: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, email]);
    } else {
      setSelectedCustomers(selectedCustomers.filter(e => e !== email));
    }
  };

  const handleSendNewsletter = async () => {
    if (selectedCustomers.length === 0) {
      toast.error('Please select at least one customer');
      return;
    }

    // This would typically open a modal or navigate to email campaign creation
    toast.success(`Ready to send newsletter to ${selectedCustomers.length} customers`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Customer Management</h1>
        <p className="text-gray-400 mt-2">Manage your customer database and email marketing campaigns</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalCustomers}</div>
              <p className="text-xs text-gray-500 mt-1">Registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Newsletter Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-400">{stats.newsletterSubscribers}</div>
              <p className="text-xs text-gray-500 mt-1">Opted in</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Marketing Consent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{stats.marketingConsent}</div>
              <p className="text-xs text-gray-500 mt-1">Agreed to marketing</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Top Country</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">
                {stats.topCountries.length > 0 ? stats.topCountries[0].country : 'N/A'}
              </div>
              <p className="text-xs text-gray-500 mt-1">Most customers</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-gray-900 border-gray-800">
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          <TabsTrigger value="marketing">Marketing Consent</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-800 text-white placeholder-gray-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleExportCSV}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={handleSendNewsletter}
                disabled={selectedCustomers.length === 0}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Campaign ({selectedCustomers.length})
              </Button>
            </div>
          </div>

          {/* Customers Table */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-0">
              {customersQuery.isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No customers found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800 hover:bg-transparent">
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="w-4 h-4 rounded bg-gray-800 border-gray-700"
                          />
                        </TableHead>
                        <TableHead className="text-gray-400">Email</TableHead>
                        <TableHead className="text-gray-400">Name</TableHead>
                        <TableHead className="text-gray-400">Country</TableHead>
                        <TableHead className="text-gray-400">Newsletter</TableHead>
                        <TableHead className="text-gray-400">Registered</TableHead>
                        <TableHead className="text-gray-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.map((customer) => (
                        <TableRow key={customer.email} className="border-gray-800 hover:bg-gray-800/50">
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedCustomers.includes(customer.email)}
                              onChange={(e) => handleSelectCustomer(customer.email, e.target.checked)}
                              className="w-4 h-4 rounded bg-gray-800 border-gray-700"
                            />
                          </TableCell>
                          <TableCell className="text-gray-300">{customer.email}</TableCell>
                          <TableCell className="text-gray-300">{customer.firstName} {customer.lastName}</TableCell>
                          <TableCell className="text-gray-400">{customer.country || '-'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              customer.newsletter
                                ? 'bg-green-900/30 text-green-400'
                                : 'bg-gray-800 text-gray-400'
                            }`}>
                              {customer.newsletter ? 'Yes' : 'No'}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleDelete(customer.email)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="newsletter" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Newsletter Subscribers</CardTitle>
              <CardDescription className="text-gray-400">
                {customers.filter(c => c.newsletter).length} customers subscribed to newsletter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                Newsletter subscriber management coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Marketing Consent</CardTitle>
              <CardDescription className="text-gray-400">
                {customers.filter(c => c.marketingConsent).length} customers agreed to marketing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                Marketing consent management coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

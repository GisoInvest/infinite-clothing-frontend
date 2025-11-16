import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import { Mail, Search, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AbandonedCartsAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: carts, isLoading, refetch } = trpc.abandonedCarts.getAll.useQuery();
  const { data: stats } = trpc.abandonedCarts.getStats.useQuery();
  const sendReminderMutation = trpc.abandonedCarts.sendReminder.useMutation();

  const handleSendReminder = async (cartId: number, email: string) => {
    try {
      await sendReminderMutation.mutateAsync({ cartId });
      toast.success(`Reminder email sent to ${email}`);
      refetch();
    } catch (error) {
      toast.error('Failed to send reminder email');
    }
  };

  const filteredCarts = carts?.filter(cart =>
    cart.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cart.sessionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Abandoned Carts Dashboard</h1>
        <p className="text-muted-foreground">
          Track and recover abandoned shopping carts
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Abandoned</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAbandoned || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{((stats?.totalValue || 0) / 100).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recovery Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.recoveryRate ? `${stats.recoveryRate.toFixed(1)}%` : '0%'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reminders Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.remindersSent || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email or session ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Abandoned Carts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Abandoned Carts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCarts && filteredCarts.length > 0 ? (
                filteredCarts.map((cart) => (
                  <TableRow key={cart.id}>
                    <TableCell className="font-mono text-xs">
                      {cart.sessionId.substring(0, 16)}...
                    </TableCell>
                    <TableCell>{cart.customerEmail || 'N/A'}</TableCell>
                    <TableCell>{cart.cartData.length} items</TableCell>
                    <TableCell>£{(cart.cartTotal / 100).toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(cart.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {cart.recovered ? (
                        <Badge variant="default" className="bg-green-500">
                          Recovered
                        </Badge>
                      ) : cart.reminderSent ? (
                        <Badge variant="secondary">Reminder Sent</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {!cart.recovered && cart.customerEmail && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleSendReminder(cart.id, cart.customerEmail!)
                          }
                          disabled={sendReminderMutation.isPending}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          {cart.reminderSent ? 'Resend' : 'Send Reminder'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No abandoned carts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Most Abandoned Products */}
      {stats?.mostAbandonedProducts && stats.mostAbandonedProducts.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Most Frequently Abandoned Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.mostAbandonedProducts.map((product: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      Product ID: {product.productId}
                    </p>
                  </div>
                  <Badge variant="secondary">{product.count} times</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

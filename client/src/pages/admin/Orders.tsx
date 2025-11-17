import { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from '@/components/ui/dialog';
import { trpc } from '@/lib/trpc';
import { Loader2, Eye, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: orders, isLoading, refetch } = trpc.orders.getAll.useQuery();
  const updateOrderStatus = trpc.orders.updateStatus.useMutation();

  const handleStatusChange = async (orderId: number, status: string) => {
    try {
      await updateOrderStatus.mutateAsync({ id: orderId, status: status as any });
      toast.success('Order status updated');
      refetch();
    } catch (error) {
      toast.error('Failed to update order status');
      console.error(error);
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'processing':
        return 'text-blue-500';
      case 'shipped':
        return 'text-purple-500';
      case 'delivered':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold glow-text break-words">Orders</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="border-primary/20">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Order Number</p>
                      <p className="font-semibold text-primary">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Customer</p>
                      <p className="font-semibold">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-semibold text-lg">£{(order.total / 100).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Status</p>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewOrder(order)}
                        className="flex-1"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-primary/20">
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders yet.</p>
            </CardContent>
          </Card>
        )}

        {/* Order Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <p className="font-semibold text-primary">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className={`font-semibold capitalize ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Name</p>
                    <p className="font-semibold">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{selectedOrder.customerEmail}</p>
                  </div>
                  {selectedOrder.customerPhone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-semibold">{selectedOrder.customerPhone}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-primary">Shipping Address</h3>
                  <div className="bg-card/50 p-4 rounded border border-primary/20">
                    <p>{selectedOrder.shippingAddress.line1}</p>
                    {selectedOrder.shippingAddress.line2 && <p>{selectedOrder.shippingAddress.line2}</p>}
                    <p>
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                      {selectedOrder.shippingAddress.postalCode}
                    </p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-primary">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-card/50 p-3 rounded border border-primary/20"
                      >
                        <div>
                          <p className="font-semibold">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">£{((item.price * item.quantity) / 100).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-primary/20 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>£{(selectedOrder.subtotal / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>£{(selectedOrder.shipping / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>£{(selectedOrder.tax / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-primary border-t border-primary/20 pt-2">
                      <span>Total</span>
                      <span>£{(selectedOrder.total / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {selectedOrder.paymentIntentId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Intent ID</p>
                    <p className="text-xs font-mono">{selectedOrder.paymentIntentId}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}


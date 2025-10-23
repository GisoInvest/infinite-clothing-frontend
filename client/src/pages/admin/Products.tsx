import { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProducts() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'men',
    subcategory: '',
    images: '',
    videos: '',
    featured: false,
  });

  const { data: products, isLoading, refetch } = trpc.products.getAll.useQuery({});
  const createProduct = trpc.products.create.useMutation();
  const updateProduct = trpc.products.update.useMutation();
  const deleteProduct = trpc.products.delete.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      description: formData.description,
      price: Math.round(parseFloat(formData.price) * 100), // Convert to cents
      stock: parseInt(formData.stock),
      category: formData.category as any,
      subcategory: formData.subcategory,
      images: formData.images ? formData.images.split(',').map(s => s.trim()) : [],
      videos: formData.videos ? formData.videos.split(',').map(s => s.trim()) : [],
      featured: formData.featured,
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, ...productData });
        toast.success('Product updated successfully');
      } else {
        await createProduct.mutateAsync(productData);
        toast.success('Product created successfully');
      }
      
      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      toast.error('Failed to save product');
      console.error(error);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: (product.price / 100).toString(),
      stock: product.stock.toString(),
      category: product.category,
      subcategory: product.subcategory,
      images: product.images?.join(', ') || '',
      videos: product.videos?.join(', ') || '',
      featured: product.featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct.mutateAsync({ id });
      toast.success('Product deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete product');
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: 'men',
      subcategory: '',
      images: '',
      videos: '',
      featured: false,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold glow-text">Products</h1>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="glow-box">
                <Plus className="mr-2 h-5 w-5" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (£) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="men">Men</SelectItem>
                        <SelectItem value="women">Women</SelectItem>
                        <SelectItem value="unisex">Unisex</SelectItem>
                        <SelectItem value="kids-baby">Kids & Baby</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subcategory">Subcategory *</Label>
                    <Input
                      id="subcategory"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      placeholder="e.g., T-shirt, Hoodies"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="images">Image URLs (comma-separated)</Label>
                  <Textarea
                    id="images"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="videos">Video URLs (comma-separated)</Label>
                  <Textarea
                    id="videos"
                    value={formData.videos}
                    onChange={(e) => setFormData({ ...formData, videos: e.target.value })}
                    placeholder="https://example.com/video1.mp4"
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={createProduct.isPending || updateProduct.isPending}>
                    {(createProduct.isPending || updateProduct.isPending) ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...</>
                    ) : (
                      editingProduct ? 'Update Product' : 'Create Product'
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
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {product.category} • {product.subcategory}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>Price: <strong className="text-primary">£{(product.price / 100).toFixed(2)}</strong></span>
                    <span>Stock: <strong>{product.stock}</strong></span>
                  </div>
                  {product.featured && (
                    <span className="inline-block px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                      Featured
                    </span>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(product)} className="flex-1">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                      disabled={deleteProduct.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-primary/20">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No products yet. Add your first product to get started!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}


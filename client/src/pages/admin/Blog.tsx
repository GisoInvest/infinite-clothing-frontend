import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, FileText, Image as ImageIcon, Save, X } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import SocialMediaCopy from "@/components/SocialMediaCopy";

export default function AdminBlog() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "",
    tags: [] as string[],
    status: "draft" as "draft" | "published" | "scheduled",
    scheduledFor: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });
  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingEditorImage, setIsUploadingEditorImage] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: 'Write your blog content here...' }),
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // Update editor content when editing a post
  useEffect(() => {
    if (editor && formData.content !== editor.getHTML()) {
      editor.commands.setContent(formData.content);
    }
  }, [editingPost]);

  const { data: posts, refetch } = trpc.blog.getAllAdmin.useQuery();
  const createMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Blog post created successfully");
      refetch();
      resetForm();
      setIsEditorOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to create post: ${error.message}`);
    },
  });

  const updateMutation = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Blog post updated successfully");
      refetch();
      resetForm();
      setIsEditorOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to update post: ${error.message}`);
    },
  });

  const deleteMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Blog post deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete post: ${error.message}`);
    },
  });

  const uploadImageMutation = trpc.blog.uploadImage.useMutation();

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      category: "",
      tags: [],
      status: "draft",
      scheduledFor: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    });
    setEditingPost(null);
    editor?.commands.clearContent();
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    const scheduledDate = post.scheduledFor ? new Date(post.scheduledFor).toISOString().slice(0, 16) : "";
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      coverImage: post.coverImage || "",
      category: post.category || "",
      tags: post.tags || [],
      status: post.status,
      scheduledFor: scheduledDate,
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      metaKeywords: post.metaKeywords || "",
    });
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-generate slug from title if empty
    const slug = formData.slug || formData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const postData = {
      ...formData,
      slug,
      authorId: 1, // TODO: Get from logged-in admin user
      authorName: "Admin", // TODO: Get from logged-in admin user
      publishedAt: formData.status === 'published' ? new Date() : undefined,
      scheduledFor: formData.status === 'scheduled' && formData.scheduledFor 
        ? new Date(formData.scheduledFor) 
        : undefined,
    };

    if (editingPost) {
      await updateMutation.mutateAsync({ id: editingPost.id, ...postData });
    } else {
      await createMutation.mutateAsync(postData);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const result = await uploadImageMutation.mutateAsync({
          fileName: file.name,
          fileData: reader.result as string,
          contentType: file.type,
        });
        setFormData(prev => ({ ...prev, coverImage: result.url }));
        toast.success("Image uploaded successfully");
      } catch (error: any) {
        toast.error(`Failed to upload image: ${error.message}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploadingEditorImage(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const result = await uploadImageMutation.mutateAsync({
          fileName: file.name,
          fileData: reader.result as string,
          contentType: file.type,
        });
        
        // Insert image into editor at current cursor position
        if (editor) {
          editor.chain().focus().setImage({ src: result.url }).run();
        }
        
        toast.success("Image inserted into editor");
      } catch (error: any) {
        toast.error(`Failed to upload image: ${error.message}`);
      } finally {
        setIsUploadingEditorImage(false);
        if (editorImageInputRef.current) {
          editorImageInputRef.current.value = '';
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  // Auto-generate slug when title changes
  useEffect(() => {
    if (!editingPost && formData.title) {
      const slug = formData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, editingPost]);



  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Blog Management</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage blog posts for your website and social media
            </p>
          </div>
          <Dialog open={isEditorOpen} onOpenChange={(open) => {
            setIsEditorOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title & Slug */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="Enter blog post title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      placeholder="url-friendly-slug"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Short summary for listing pages"
                    rows={3}
                  />
                </div>

                {/* Content Editor */}
                <div className="space-y-2">
                  <Label>Content *</Label>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted p-2 border-b flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        className={editor?.isActive('bold') ? 'bg-accent' : ''}
                      >
                        Bold
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        className={editor?.isActive('italic') ? 'bg-accent' : ''}
                      >
                        Italic
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={editor?.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
                      >
                        H2
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                        className={editor?.isActive('bulletList') ? 'bg-accent' : ''}
                      >
                        List
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editorImageInputRef.current?.click()}
                        disabled={isUploadingEditorImage}
                      >
                        <ImageIcon className="w-4 h-4 mr-1" />
                        {isUploadingEditorImage ? 'Uploading...' : 'Image'}
                      </Button>
                      <input
                        ref={editorImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleEditorImageUpload}
                        className="hidden"
                      />
                    </div>
                    <EditorContent editor={editor} className="min-h-[300px] prose prose-sm max-w-none p-4" />
                  </div>
                </div>

                {/* Cover Image */}
                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image</Label>
                  <div className="flex gap-2">
                    <Input
                      id="coverImage"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      placeholder="Image URL or upload below"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  {formData.coverImage && (
                    <img
                      src={formData.coverImage}
                      alt="Cover preview"
                      className="w-full h-48 object-cover rounded-md mt-2"
                    />
                  )}
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Fashion Tips, New Arrivals"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Scheduled Date/Time */}
                {formData.status === 'scheduled' && (
                  <div className="space-y-2">
                    <Label htmlFor="scheduledFor">Schedule For</Label>
                    <Input
                      id="scheduledFor"
                      type="datetime-local"
                      value={formData.scheduledFor}
                      onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                      min={new Date().toISOString().slice(0, 16)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Post will be automatically published at the scheduled time
                    </p>
                  </div>
                )}

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Add tags (press Enter)"
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* SEO Fields */}
                <div className="border-t pt-4 space-y-4">
                  <h3 className="font-semibold">SEO Settings</h3>
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      placeholder="SEO title (defaults to post title)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      placeholder="SEO description"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <Input
                      id="metaKeywords"
                      value={formData.metaKeywords}
                      onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsEditorOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    <Save className="w-4 h-4 mr-2" />
                    {editingPost ? "Update Post" : "Create Post"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Posts List */}
        <div className="grid gap-4">
          {posts?.map((post) => (
            <Card key={post.id} className="p-6 border-primary/20 glow-box">
              <div className="flex gap-4">
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {post.excerpt || "No excerpt"}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Status: <span className={post.status === 'scheduled' ? 'text-yellow-500' : 'text-primary'}>{post.status}</span></span>
                        <span>Category: {post.category || "None"}</span>
                        <span>Views: {post.viewCount}</span>
                        <span>
                          {post.status === 'scheduled' && post.scheduledFor
                            ? `Scheduled: ${new Date(post.scheduledFor).toLocaleString()}`
                            : post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString()
                            : "Not published"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {post.status === 'published' && (
                        <SocialMediaCopy post={post} />
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(post)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {!posts || posts.length === 0 && (
            <Card className="p-12 text-center border-dashed">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No blog posts yet. Create your first post to get started!
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

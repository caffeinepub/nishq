import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import type { Product, Seller } from '../../backend';
import { ExternalBlob } from '../../backend';
import { X } from 'lucide-react';

interface ProductFormProps {
  onSubmit: (product: Product) => void;
  sellers: Seller[];
  initialData?: Product;
}

export default function ProductForm({ onSubmit, sellers, initialData }: ProductFormProps) {
  const [formData, setFormData] = useState({
    productId: initialData?.productId || `product-${Date.now()}`,
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData ? Number(initialData.price) : 0,
    sellerId: initialData?.sellerId || '',
    tradeOffs: initialData?.tradeOffs.join('\n') || '',
    returnReasons: initialData?.returnReasons.join('\n') || '',
  });

  const [images, setImages] = useState<ExternalBlob[]>(initialData?.images || []);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages: ExternalBlob[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });
      
      newImages.push(blob);
    }

    setImages([...images, ...newImages]);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const product: Product = {
      productId: formData.productId,
      name: formData.name,
      description: formData.description,
      price: BigInt(formData.price),
      sellerId: formData.sellerId,
      images: images,
      tradeOffs: formData.tradeOffs.split('\n').filter(line => line.trim()),
      returnReasons: formData.returnReasons.split('\n').filter(line => line.trim()),
    };

    onSubmit(product);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="sellerId">Seller *</Label>
          <Select value={formData.sellerId} onValueChange={(value) => setFormData({ ...formData, sellerId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select seller" />
            </SelectTrigger>
            <SelectContent>
              {sellers.map(seller => (
                <SelectItem key={seller.sellerId} value={seller.sellerId}>
                  {seller.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="images">Product Images</Label>
        <Input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          disabled={isUploading}
        />
        {isUploading && (
          <div className="mt-2">
            <Progress value={uploadProgress} />
            <p className="text-xs text-muted-foreground mt-1">Uploading: {uploadProgress}%</p>
          </div>
        )}
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <img src={img.getDirectURL()} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="tradeOffs">Trade-offs and Limitations (one per line)</Label>
        <Textarea
          id="tradeOffs"
          value={formData.tradeOffs}
          onChange={(e) => setFormData({ ...formData, tradeOffs: e.target.value })}
          rows={4}
          placeholder="Slightly heavier than competitors&#10;Limited color options&#10;Requires assembly"
        />
      </div>

      <div>
        <Label htmlFor="returnReasons">Common Return Reasons (one per line)</Label>
        <Textarea
          id="returnReasons"
          value={formData.returnReasons}
          onChange={(e) => setFormData({ ...formData, returnReasons: e.target.value })}
          rows={4}
          placeholder="Size mismatch&#10;Color different from image&#10;Quality concerns"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isUploading}>
        {initialData ? 'Update Product' : 'Add Product'}
      </Button>
    </form>
  );
}

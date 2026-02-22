import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { Review, Product } from '../../backend';

interface ReviewFormProps {
  onSubmit: (review: Review) => void;
  products: Product[];
  initialData?: Review;
}

export default function ReviewForm({ onSubmit, products, initialData }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    reviewId: initialData?.reviewId || `review-${Date.now()}`,
    productId: initialData?.productId || '',
    userId: initialData?.userId || '',
    rating: initialData ? Number(initialData.rating) : 5,
    content: initialData?.content || '',
    usageDays: initialData ? Number(initialData.usageDays) : 30,
    verified: initialData?.verified ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const review: Review = {
      reviewId: formData.reviewId,
      productId: formData.productId,
      userId: formData.userId,
      rating: BigInt(formData.rating),
      content: formData.content,
      usageDays: BigInt(formData.usageDays),
      verified: formData.verified,
    };

    onSubmit(review);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="productId">Product *</Label>
        <Select value={formData.productId} onValueChange={(value) => setFormData({ ...formData, productId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select product" />
          </SelectTrigger>
          <SelectContent>
            {products.map(product => (
              <SelectItem key={product.productId} value={product.productId}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="userId">User ID *</Label>
        <Input
          id="userId"
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
          placeholder="user-123 or Principal ID"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rating">Rating (1-5) *</Label>
          <Select value={formData.rating.toString()} onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {'★'.repeat(num)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="usageDays">Usage Days *</Label>
          <Input
            id="usageDays"
            type="number"
            min="0"
            value={formData.usageDays}
            onChange={(e) => setFormData({ ...formData, usageDays: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="content">Review Content *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={5}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="verified"
          checked={formData.verified}
          onCheckedChange={(checked) => setFormData({ ...formData, verified: checked as boolean })}
        />
        <Label htmlFor="verified" className="cursor-pointer">
          Mark as verified (review from confirmed buyer after delivery)
        </Label>
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Update Review' : 'Add Review'}
      </Button>
    </form>
  );
}

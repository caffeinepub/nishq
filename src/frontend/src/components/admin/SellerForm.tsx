import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Seller } from '../../backend';

interface SellerFormProps {
  onSubmit: (seller: Seller) => void;
  initialData?: Seller;
}

export default function SellerForm({ onSubmit, initialData }: SellerFormProps) {
  const [formData, setFormData] = useState({
    sellerId: initialData?.sellerId || `seller-${Date.now()}`,
    name: initialData?.name || '',
    trustScore: initialData ? Number(initialData.trustScore) : 75,
    accountAgeDays: initialData ? Number(initialData.accountAgeDays) : 365,
    totalOrders: initialData ? Number(initialData.totalOrders) : 0,
    disputesWon: initialData ? Number(initialData.disputesWon) : 0,
    disputesLost: initialData ? Number(initialData.disputesLost) : 0,
    policyViolations: initialData ? Number(initialData.policyViolations) : 0,
    penalties: initialData ? Number(initialData.penalties) : 0,
    historyTimeline: initialData?.historyTimeline.join('\n') || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const seller: Seller = {
      sellerId: formData.sellerId,
      name: formData.name,
      trustScore: BigInt(formData.trustScore),
      accountAgeDays: BigInt(formData.accountAgeDays),
      totalOrders: BigInt(formData.totalOrders),
      disputesWon: BigInt(formData.disputesWon),
      disputesLost: BigInt(formData.disputesLost),
      policyViolations: BigInt(formData.policyViolations),
      penalties: BigInt(formData.penalties),
      historyTimeline: formData.historyTimeline.split('\n').filter(line => line.trim()),
    };

    onSubmit(seller);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Seller Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="trustScore">Trust Score (0-100) *</Label>
          <Input
            id="trustScore"
            type="number"
            min="0"
            max="100"
            value={formData.trustScore}
            onChange={(e) => setFormData({ ...formData, trustScore: parseInt(e.target.value) })}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">Lifetime-based, cannot be reset</p>
        </div>
        <div>
          <Label htmlFor="accountAgeDays">Account Age (days) *</Label>
          <Input
            id="accountAgeDays"
            type="number"
            min="0"
            value={formData.accountAgeDays}
            onChange={(e) => setFormData({ ...formData, accountAgeDays: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="totalOrders">Total Orders</Label>
          <Input
            id="totalOrders"
            type="number"
            min="0"
            value={formData.totalOrders}
            onChange={(e) => setFormData({ ...formData, totalOrders: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="disputesWon">Disputes Won</Label>
          <Input
            id="disputesWon"
            type="number"
            min="0"
            value={formData.disputesWon}
            onChange={(e) => setFormData({ ...formData, disputesWon: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="disputesLost">Disputes Lost</Label>
          <Input
            id="disputesLost"
            type="number"
            min="0"
            value={formData.disputesLost}
            onChange={(e) => setFormData({ ...formData, disputesLost: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="policyViolations">Policy Violations (6 months)</Label>
          <Input
            id="policyViolations"
            type="number"
            min="0"
            value={formData.policyViolations}
            onChange={(e) => setFormData({ ...formData, policyViolations: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="penalties">Platform Penalties</Label>
        <Input
          id="penalties"
          type="number"
          min="0"
          value={formData.penalties}
          onChange={(e) => setFormData({ ...formData, penalties: parseInt(e.target.value) })}
        />
      </div>

      <div>
        <Label htmlFor="historyTimeline">History Timeline (one event per line)</Label>
        <Textarea
          id="historyTimeline"
          value={formData.historyTimeline}
          onChange={(e) => setFormData({ ...formData, historyTimeline: e.target.value })}
          rows={5}
          placeholder="Joined platform on Jan 2023&#10;First 100 orders completed&#10;Achieved 90+ trust score"
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Update Seller' : 'Add Seller'}
      </Button>
    </form>
  );
}

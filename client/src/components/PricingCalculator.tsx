import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator } from 'lucide-react';

interface PricingCalculatorProps {
  productType: string;
  quantity: number;
  fabricQuality: number;
}

export default function PricingCalculator({ productType, quantity, fabricQuality }: PricingCalculatorProps) {
  // Base prices for different product types (in GBP)
  const basePrices: Record<string, number> = {
    'T-Shirt': 8.99,
    'Hoodie': 24.99,
    'Sweatshirt': 22.99,
    'Polo Shirt': 16.99,
    'Long Sleeve Shirt': 14.99,
    'Jacket': 49.99,
    'Cap': 9.99,
    'Tote Bag': 7.99,
    'Other (Please specify)': 15.00,
  };

  // Fabric quality multipliers
  const fabricMultipliers: Record<number, number> = {
    150: 1.0,    // Standard
    180: 1.1,    // Medium weight
    200: 1.2,    // Premium (Recommended)
    250: 1.35,   // Heavy weight
    300: 1.5,    // Extra heavy weight
    400: 1.8,    // Ultra premium
  };

  // Printing cost per unit (base)
  const printingCostPerUnit = 3.50;

  // Calculate pricing
  const basePrice = basePrices[productType] || 15.00;
  const fabricMultiplier = fabricMultipliers[fabricQuality] || 1.0;
  const pricePerUnit = basePrice * fabricMultiplier + printingCostPerUnit;
  const subtotal = pricePerUnit * quantity;

  // Volume discounts
  let discountPercentage = 0;
  if (quantity >= 100) discountPercentage = 15;
  else if (quantity >= 50) discountPercentage = 10;
  else if (quantity >= 20) discountPercentage = 5;

  const discountAmount = subtotal * (discountPercentage / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = subtotalAfterDiscount * 0.2; // 20% VAT
  const total = subtotalAfterDiscount + tax;

  const getFabricLabel = (gsm: number) => {
    const labels: Record<number, string> = {
      150: 'Lightweight (Standard)',
      180: 'Medium Weight',
      200: 'Premium (Recommended)',
      250: 'Heavy Weight',
      300: 'Extra Heavy Weight',
      400: 'Ultra Premium',
    };
    return labels[gsm] || 'Standard';
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Price Estimate</CardTitle>
        </div>
        <CardDescription>Based on your selections</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Product Details */}
        <div className="space-y-2 pb-4 border-b">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Product Type:</span>
            <span className="font-semibold">{productType}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fabric Quality:</span>
            <span className="font-semibold">{fabricQuality} GSM - {getFabricLabel(fabricQuality)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Quantity:</span>
            <span className="font-semibold">{quantity} units</span>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-2 pb-4 border-b">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Price per unit:</span>
            <span className="font-semibold">£{pricePerUnit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-semibold">£{subtotal.toFixed(2)}</span>
          </div>

          {discountPercentage > 0 && (
            <div className="flex justify-between text-sm bg-green-50 dark:bg-green-950 p-2 rounded">
              <span className="text-green-700 dark:text-green-300">Volume Discount ({discountPercentage}%):</span>
              <span className="font-semibold text-green-700 dark:text-green-300">-£{discountAmount.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Tax and Total */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">VAT (20%):</span>
            <span className="font-semibold">£{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total Estimate:</span>
            <span className="text-primary">£{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Volume Discount Info */}
        {quantity < 100 && (
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded text-sm text-blue-700 dark:text-blue-300">
            <p className="font-semibold mb-1">💡 Volume Discounts Available:</p>
            <ul className="text-xs space-y-1">
              <li>• 20+ units: 5% discount</li>
              <li>• 50+ units: 10% discount</li>
              <li>• 100+ units: 15% discount</li>
            </ul>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          *This is an estimate. Final pricing will be confirmed after design review. Prices include printing and VAT.
        </p>
      </CardContent>
    </Card>
  );
}

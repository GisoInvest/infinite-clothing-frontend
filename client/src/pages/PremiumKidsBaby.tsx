import ProductList from './ProductList';

export default function PremiumKidsBaby() {
  return (
    <ProductList
      collection="premium"
      category="kids-baby"
      title="Kids & Baby Collection"
      subcategories={[
        'T-shirt',
        'Tank Tops',
        'Long Sleeve Shirts',
        'Hoodies',
        'Sweatshirts',
        'Sweatpants',
      ]}
    />
  );
}

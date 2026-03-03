import ProductList from './ProductList';

export default function PremiumMen() {
  return (
    <ProductList
      collection="premium"
      category="men"
      title="Men's Collection"
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

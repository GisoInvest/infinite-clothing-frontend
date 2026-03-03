import ProductList from './ProductList';

export default function PremiumWomen() {
  return (
    <ProductList
      collection="premium"
      category="women"
      title="Women's Collection"
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

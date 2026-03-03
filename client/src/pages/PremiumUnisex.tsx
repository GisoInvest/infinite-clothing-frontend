import ProductList from './ProductList';

export default function PremiumUnisex() {
  return (
    <ProductList
      collection="premium"
      category="unisex"
      title="Unisex Collection"
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

import ProductList from './ProductList';

export default function Unisex() {
  return (
    <ProductList
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


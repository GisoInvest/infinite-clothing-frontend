import ProductList from './ProductList';

export default function Men() {
  return (
    <ProductList
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


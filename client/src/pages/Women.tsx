import ProductList from './ProductList';

export default function Women() {
  return (
    <ProductList
      collection="regular"
      category="women"
      title="Women's Collection"
      subcategories={[
        'T-shirts',
        'Crop Top & Camis',
        'Long Sleeve Shirts',
        'Hoodies',
        'Sweatshirts',
        'Sweatpants',
      ]}
    />
  );
}


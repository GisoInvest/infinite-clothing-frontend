import ProductList from './ProductList';

export default function KidsBaby() {
  return (
    <ProductList
      category="kids-baby"
      title="Kids & Baby Collection"
      subcategories={[
        'Boys',
        'Girls',
      ]}
    />
  );
}


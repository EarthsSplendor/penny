import NextImage from 'components/NextImage';

export interface RelatedProduct {
  id: string;
  href: string;
  name: string;
  color: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
}

export interface RelatedProductsProps {
  relatedProducts: RelatedProduct[];
  addToCart: () => void;
}

const RelatedProducts = (props: RelatedProductsProps) => {
  const { relatedProducts, addToCart } = props;
  return (
    <section aria-labelledby="related-heading" className="mt-10 border-t border-gray-200 py-16 px-4 sm:px-0">
      <h2 id="related-heading" className="text-xl font-bold text-gray-900">
        Customers also bought
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {relatedProducts.map((product) => (
          <div key={product.id}>
            <div className="relative">
              <div className="relative w-full h-72 rounded-lg overflow-hidden">
                <NextImage
                  layout="fill"
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <div className="relative mt-4">
                <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{product.color}</p>
              </div>
              <div className="absolute top-0 inset-x-0 h-72 rounded-lg p-4 flex items-end justify-end overflow-hidden">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                />
                <p className="relative text-lg font-semibold text-white">{product.price}</p>
              </div>
            </div>
            <div className="mt-6">
              <a
                href={product.href}
                className="relative flex bg-gray-100 border border-transparent rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-gray-900 hover:bg-gray-200"
                onClick={addToCart}
              >
                Add to bag<span className="sr-only">, {product.name}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;

import PageLoader from 'components/PageLoader';
import Container from 'features/Container';
import ProductAddToCart from 'features/products/ProductAddToCart';
import ProductImage from 'features/products/ProductImage';
import ReviewList from 'features/reviews/ReviewList';
import Page from 'layouts/Page';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import type { GetProductArgs, GetProductIdsResponse, GetProductResponse } from 'queries';
import { GetProductIdsQuery, GetProductQuery } from 'queries';
import addApolloQueryCache from 'services/apollo/addApolloQueryCache';
import { createStaticClient } from 'services/apollo/apolloClient';
import { Box, Flex, Heading, Paragraph } from 'theme-ui';
import type { Product } from 'types/product';
import type { ReviewsIo_ListProductReviewsResponseStatsProperty, ReviewsIo_ProductReview } from 'types/takeshape';
import { shopifyGidToId, shopifyIdToGid, shopifyProductToProduct } from 'utils/transforms';
import { getSingle } from 'utils/types';

interface ProductPageProps {
  product: Product;
  reviews: ReviewsIo_ProductReview[] | null;
  stats: ReviewsIo_ListProductReviewsResponseStatsProperty | null;
}

const ProductPage: NextPage<ProductPageProps> = (props) => {
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return (
      <Container title="Product loading...">
        <PageLoader />
      </Container>
    );
  }

  const { product, reviews, stats } = props;

  return (
    <Container title={product.name}>
      <Page>
        <Heading as="h2" variant="styles.pageTitle">
          {product.name}
        </Heading>
        <Flex sx={{ margin: '2rem 0', gap: '2rem' }}>
          <Box sx={{ flex: '1 1 32rem' }}>
            <ProductImage image={product.featuredImage} maxHeight="600px" />
          </Box>
          <Flex sx={{ flex: '1 1 24rem', flexDirection: 'column' }}>
            <ProductAddToCart product={product} />
            <Paragraph sx={{ textAlign: 'left' }}>{product.description}</Paragraph>
            <Box sx={{ fontSize: '.8em' }}>
              <ReviewList reviews={reviews} stats={stats} />
            </Box>
          </Flex>
        </Flex>
      </Page>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<ProductPageProps> = async ({ params }) => {
  const id = shopifyIdToGid(getSingle(params.id));
  const apolloClient = createStaticClient();

  const { data } = await apolloClient.query<GetProductResponse, GetProductArgs>({
    query: GetProductQuery,
    variables: { id }
  });

  const product = shopifyProductToProduct(data.product);

  return addApolloQueryCache(apolloClient, {
    props: {
      product,
      reviews: product.reviews?.data ?? {},
      stats: {
        average: product.reviewsAverage,
        count: product.reviewsCount
      }
    }
  });
};

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = createStaticClient();

  const { data } = await apolloClient.query<GetProductIdsResponse>({
    query: GetProductIdsQuery
  });

  const paths = data.products.edges.map(({ node }) => ({
    params: { id: shopifyGidToId(node.id) }
  }));

  return {
    paths,
    fallback: true
  };
};

export default ProductPage;

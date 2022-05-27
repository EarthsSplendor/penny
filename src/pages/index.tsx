import Alert from 'components/Alert/Alert';
import PageLoader from 'components/PageLoader';
import Wrapper from 'components/Wrapper/Content';
import ProductHeader from 'features/ProductCategory/Header/Header';
import ProductGrid from 'features/ProductCategory/ProductGrid/ProductGrid';
import Layout from 'layouts/Default';
import logger from 'logger';
import type { InferGetStaticPropsType, NextPage } from 'next';
import type { GetProductsResponse } from 'queries';
import { GetProductsQuery } from 'queries';
import addApolloQueryCache from 'utils/apollo/addApolloQueryCache';
import { formatError } from 'utils/errors';
import { createAnonymousTakeshapeApolloClient } from 'utils/takeshape';
import { shopifyProductToProductListItem } from 'utils/transforms/shopify';

const IndexPage: NextPage = ({ products, error }: InferGetStaticPropsType<typeof getStaticProps>) => {
  if (error) {
    return (
      <Layout>
        <Wrapper>
          <div className="my-10">
            <Alert status="error" primaryText="Error loading products" secondaryText={JSON.stringify(error, null, 2)} />
          </div>
        </Wrapper>
      </Layout>
    );
  }

  return (
    <Layout>
      {products ? (
        <Wrapper>
          <ProductHeader header={{ text: { primary: 'Clothes!', secondary: 'Fun for everyone.' } }} />
          <ProductGrid products={products} />
        </Wrapper>
      ) : (
        <PageLoader />
      )}
    </Layout>
  );
};

const apolloClient = createAnonymousTakeshapeApolloClient();

export async function getStaticProps() {
  let products = [];
  let error = null;

  try {
    const { data } = await apolloClient.query<GetProductsResponse>({
      query: GetProductsQuery
    });

    products = data.products.edges.map((e) => shopifyProductToProductListItem(e.node));
  } catch (err) {
    logger.error(err);
    error = formatError(err);
  }

  return addApolloQueryCache(apolloClient, { props: { products, error } });
}

export default IndexPage;

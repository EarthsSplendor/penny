import { gql } from '@apollo/client';
import { ProductCategoryShopifyCollection } from './types';

export type ProductCategoryShopifyCollectionIdsResponse = {
  collections: {
    edges: {
      cursor: string;
      node: {
        id: string;
        handle: string;
        productsCount: number;
      };
    }[];
  };
};

export const ProductCategoryShopifyCollectionIdsQuery = gql`
  query ProductCategoryShopifyCollectionIdsQuery {
    collections: Shopify_collections(first: 100) {
      edges {
        cursor
        node {
          id
          handle
          productsCount
        }
      }
    }
  }
`;

export type ProductCategoryShopifyCollectionArgs = {
  id: string;
  first?: number;
  last?: number;
  after?: string;
  before?: string;
};

export type ProductCategoryShopifyCollectionResponse = {
  collection: ProductCategoryShopifyCollection;
};

const ProductCategoryProductFragment = gql`
  fragment ProductCategoryProduct on Shopify_Product {
    id
    title
    description
    descriptionHtml
    takeshape {
      _id
      name
      slug
    }
    requiresSellingPlan
    featuredImage {
      id
      width
      height
      url
      altText
    }
    priceRangeV2 {
      maxVariantPrice {
        currencyCode
        amount
      }
      minVariantPrice {
        currencyCode
        amount
      }
    }
    publishedAt
    totalVariants
    totalInventory
    sellingPlanGroupCount
    reviews {
      stats {
        average
        count
      }
    }
  }
`;

export const ProductCategoryShopifyCollectionQuery = gql`
  ${ProductCategoryProductFragment}
  query ProductCategoryShopifyCollectionQuery($id: ID!, $first: Int, $last: Int, $after: String, $before: String) {
    collection: Shopify_collection(id: $id) {
      id
      handle
      title
      description
      descriptionHtml
      productsCount
      products(first: $first, last: $last, after: $after, before: $before) {
        edges {
          cursor
          node {
            ...ProductCategoryProduct
          }
        }
      }
    }
  }
`;
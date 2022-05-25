import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';

export interface ShopifyProfile extends Record<string, any> {
  shop: {
    id: string;
    name: string;
  };
}

type ShopifyOptions = {
  shop: string;
  apiVersion: string;
};

export default function Shopify<P extends ShopifyProfile>(
  options: OAuthUserConfig<P> & ShopifyOptions
): OAuthConfig<P> {
  const { shop, apiVersion = '2022-01' } = options;

  return {
    id: 'shopify',
    name: 'Shopify',
    type: 'oauth',
    authorization: {
      url: `https://${shop}.myshopify.com/admin/oauth/authorize`,
      params: { scope: 'read_orders write_orders' }
    },
    client: {
      token_endpoint_auth_method: 'client_secret_post'
    },
    token: `https://${shop}.myshopify.com/admin/oauth/access_token`,
    userinfo: {
      request: async ({ tokens }) => {
        const { access_token = '' } = tokens;
        if (!access_token) throw new Error('Access token is missing');
        const res = await fetch(`https://${shop}.myshopify.com/admin/api/${apiVersion}/shop.json`, {
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': access_token
          }
        });
        if (res.ok) {
          const result = await res.json();
          return result;
        }

        throw new Error('Something went wrong while trying to access your shop');
      }
    },
    profile: (profile) => {
      return {
        id: profile.shop.id,
        name: profile.shop.name,
        email: null,
        image: null
      };
    },
    options
  };
}

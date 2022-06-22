import { ApolloClient, InMemoryCache } from "@apollo/client";

export const shopifyAdminApolloClient = new ApolloClient({
  uri: `https://${process.env.SHOP}/admin/api/2021-04/graphql.json`,
  headers: {
    "X-Shopify-Access-Token": process.env.X_SHOPIFY_ACCESS_TOKEN,
  },
  cache: new InMemoryCache(),
});

export const shopifyFrontApolloClient = new ApolloClient({
  uri: `https://${process.env.SHOP}/api/2021-04/graphql.json`,
  headers: {
    "X-Shopify-Storefront-Access-Token":
      process.env.X_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  },
  cache: new InMemoryCache(),
});

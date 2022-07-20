import { gql } from "@apollo/client";

const ARTICLE_FRAGMENT = `
    edges {
      node {
        authorV2 {
          name
        }
        image {
          src
        }
        onlineStoreUrl
        id
        title
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  
`;

export const GET_ARTICALS_FARWORD = gql`
  query getArticales($cursor: String) {
    articles(first: 5, after: $cursor, sortKey: UPDATED_AT, reverse: true) {
      ${ARTICLE_FRAGMENT}
    }
  }
`;
export const GET_ARTICALS_BACKWORD = gql`
  query getArticales($cursor: String) {
    articles(last: 5, before: $cursor, sortKey: UPDATED_AT, reverse: true) {
      ${ARTICLE_FRAGMENT}
    }
  }
`;

export const GET_COLLECTIONS = gql`
  {
    collections(first: 250) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

export const GET_COLLECTION_dATA = gql`
  query getCollectionProd($id: ID!) {
    collection(id: $id) {
      products(first: 4) {
        edges {
          node {
            id
            title
            handle
            featuredImage {
              src
            }
            variants(first: 4) {
              edges {
                node {
                  price
                }
              }
            }
          }
        }
      }
    }
  }
`;

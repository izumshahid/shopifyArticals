import { gql } from "@apollo/client";

export const GET_ARTICALS = gql`
  query getArticasl($cursor: String) {
    articles(first: 10, after: $cursor) {
      edges {
        node {
          authorV2 {
            name
          }
          id
          title
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
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

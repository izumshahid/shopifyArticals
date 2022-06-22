import { gql } from "@apollo/client";

export const GET_ARTICALS = gql`
  {
    articles(first: 250) {
      edges {
        node {
          id
          title
        }
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

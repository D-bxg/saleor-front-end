import { gql } from "@apollo/client";
export const GET_ALL_PRODUCTS = gql`
  query {
    products {
      id
      name
      appType
    }
  }
`;
export const GET_JSON_RESULT = gql`
  query($token: String!) {
    jsonResult(token: $token)
  }
`;

import { gql } from "@apollo/client";
export const CREATE_CHECKOUT = gql`
  mutation(
    $product: Int!
    $drawValue: String
    $inputValue: String
    $attr: [String]
    $file: Upload
  ) {
    CheckoutCreate(
      checkout: {
        product: $product
        drawValue: $drawValue
        inputValue: $inputValue
        attr: $attr
        uploadFile: $file
      }
    ) {
      ok
      token
    }
  }
`;

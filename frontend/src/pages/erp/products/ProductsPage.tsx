import { FC } from "react"

import template from "../../../data/models/product.template.json"
import ProductListItem from "./ProductListItem"
import DefaultPage from "../../../components/DefaultPage"

const ProductsPage: FC = () => {
  return (
    <DefaultPage
      template={template}
      ListElement={ProductListItem}
      entryName="products"
    />
  )
}

export default ProductsPage

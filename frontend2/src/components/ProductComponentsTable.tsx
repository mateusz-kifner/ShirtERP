import { Button, Table } from "antd"
import { FC, useCallback } from "react"
import { ProductComponentType } from "../types/ProductComponentType"
import { isNum } from "../utils/isNum"
import { truncString } from "../utils/truncString"
import { uniqByKeepFirst } from "../utils/uniqByKeepFirst"
import styles from "./ProductComponentsTable.module.css"

interface ProductComponentsTableProps {
  productComponents: ProductComponentType[]
  onChange: (id: number) => void
}

const letter_sizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "2XL",
  "XXL",
  "3XL",
  "4XL",
  "5XL",
]

const ProductComponentsTable: FC<ProductComponentsTableProps> = ({
  productComponents,
  onChange,
}) => {
  const get_table_data = useCallback(
    (pComponents: ProductComponentType[]) => {
      const sizes: string[] = [
        ...Array.from(
          new Set<string>(
            (
              pComponents
                .map((val) => val.size)
                .filter((val) => val !== null) as string[]
            ).sort((a: string | undefined, b: string | undefined) => {
              if (a === undefined) return 1
              if (b === undefined) return -1
              if (letter_sizes.includes(a) && letter_sizes.includes(b)) {
                return letter_sizes.indexOf(a) - letter_sizes.indexOf(b)
              }
              return a < b ? -1 : 1
            }),
          ),
        ),
      ]
      const columns = [
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
          render: (val: { name: string; color: string }) => (
            <div>
              {truncString(val.name, 32)}
              <div
                style={{
                  display: "inline-block",
                  position: "absolute",
                  // height: "1rem",
                  minWidth: "2rem",
                  aspectRatio: "1 / 1",

                  backgroundColor: val.color ? val.color : "none",
                  borderRadius: "100%",
                  margin: "0.5rem",
                  border: "1px solid #333",
                  top: 0,
                  bottom: 0,
                  right: 0,
                }}
              ></div>
            </div>
          ),
        },
        ...sizes.map((val) => ({
          title: val,
          dataIndex: val,
          key: val,
          render: (value: { ready: boolean; count: number; id: number }) =>
            value !== undefined && (
              <button
                className={styles.button}
                style={{
                  backgroundColor: value.ready ? "#33691e" : "#b71c1c",
                }}
                onClick={() => {
                  onChange && onChange(value.id)
                }}
              >
                {value.count}
              </button>
            ),
        })),
      ]

      let products = [
        ...pComponents.filter((val) => !!val.product).map((val) => val.product),
      ]
      products = uniqByKeepFirst(products, (a) => (a ? a.id : -1))

      let data: any = []
      for (let product of products) {
        if (product != null) {
          let new_product: any = {
            key: "" + product.id,
            name: { name: product.name, color: product.color?.colorHex },
          }
          for (let component of pComponents.filter(
            (val) => val.product && product && val.product.id == product.id,
          )) {
            if (component.size !== null)
              new_product[component.size] = {
                ready: component.ready,
                count: component.count,
                id: component.id,
              }
          }
          // console.log(new_product)
          data.push({ ...new_product })
        }
      }
      // console.log(pComponents)
      return [columns, data]
    },
    [productComponents],
  )

  const [columns, data] = get_table_data(productComponents)

  return <Table className={styles.table} columns={columns} dataSource={data} />
}

export default ProductComponentsTable
import { FC, useEffect, useState } from "react"

import ApiList from "../../../components/api/ApiList"
import _ from "lodash"
import names from "../../../models/names.json"
import { makeDefaultListItem } from "../../../components/DefaultListItem"
import { useRouter } from "next/router"

const entryName = "orders-archive"

const OrdersArchiveList = () => {
  const [id, setId] = useState<number | null>(null)
  const router = useRouter()

  return (
    <ApiList
      ListItem={makeDefaultListItem("name")}
      entryName={entryName}
      label={
        entryName && entryName in names
          ? _.capitalize(names[entryName as keyof typeof names].plural)
          : undefined
      }
      selectedId={id}
      onChange={(val: any) => {
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      listItemProps={{
        linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
      }}
    />
  )
}

export default OrdersArchiveList

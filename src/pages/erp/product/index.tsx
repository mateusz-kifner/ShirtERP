import { useState } from "react";

import { IconList, IconNotebook } from "@tabler/icons-react";
import { useRouter } from "next/router";

import Workspace from "@/components/layout/Workspace";
import { useIsMobile } from "@/hooks/useIsMobile";
import ProductAddModal from "@/page-components/erp/product/ProductAddModal";
import ProductEditable from "@/page-components/erp/product/ProductEditable";
import ProductsList from "@/page-components/erp/product/ProductList";
import { getQueryAsIntOrNull } from "@/utils/query";

const entryName = "product";

const ProductsPage = () => {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");

  return (
    <div className="flex gap-4">
      <Workspace
        cacheKey={entryName}
        navigationMetadata={[{ label: "Lista produktów", icon: IconList }]}
        childrenMetadata={
          id !== null ? [{ label: "Właściwości", icon: IconNotebook }] : []
        }
        navigation={
          <div className="relative p-4">
            <ProductsList
              selectedId={id}
              onAddElement={() => setOpenAddModal(true)}
            />
          </div>
        }
      >
        {id !== null && (
          <div className="relative flex flex-col gap-4 p-4 ">
            <ProductEditable id={id} />
          </div>
        )}
      </Workspace>
      <ProductAddModal
        opened={openAddModal}
        onClose={(id?: number) => {
          setOpenAddModal(false);
          id !== undefined &&
            router.push(`/erp/product/${id}`).catch((e) => {
              throw e;
            });
        }}
      />
    </div>
  );
};

export default ProductsPage;

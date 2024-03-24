import { useState } from "react";

import { IconList, IconNotebook } from "@tabler/icons-react";
import { useRouter } from "next/router";

import Workspace from "@/components/layout/Workspace";
import CustomerAddModal from "@/page-components/erp/customer/CustomerAddModal";
import CustomerEditable from "@/page-components/erp/customer/CustomerEditable";
import CustomersList from "@/page-components/erp/customer/CustomerList";
import { getQueryAsIntOrNull } from "@/utils/query";
import { createRedirectByRole } from "@/utils/redirectByRole";

const entryName = "customer";

const CustomersPage = () => {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);

  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");

  return (
    <div className="flex gap-4">
      <Workspace
        cacheKey={entryName}
        navigationMetadata={[{ label: "", icon: IconList }]}
        childrenMetadata={
          id !== null ? [{ label: "Właściwości", icon: IconNotebook }] : []
        }
        navigation={
          <div className="relative p-4">
            <CustomersList
              selectedId={id}
              onAddElement={() => setOpenAddModal(true)}
            />
          </div>
        }
      >
        {id !== null && (
          <div className="relative flex flex-col gap-4 p-4">
            <CustomerEditable id={id} />
          </div>
        )}
      </Workspace>
      <CustomerAddModal
        opened={openAddModal}
        onClose={(id?: number) => {
          setOpenAddModal(false);
          id !== undefined && void router.push(`/erp/customer/${id}`);
        }}
      />
    </div>
  );
};

export const getServerSideProps = createRedirectByRole("employee");

export default CustomersPage;

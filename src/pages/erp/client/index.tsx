import { useState } from "react";

import { IconList, IconNotebook } from "@tabler/icons-react";
import { useRouter } from "next/router";

import Workspace from "@/components/layout/Workspace";
import { useIsMobile } from "@/hooks/useIsMobile";
import ClientAddModal from "@/page-components/erp/client/ClientAddModal";
import ClientEditable from "@/page-components/erp/client/ClientEditable";
import ClientsList from "@/page-components/erp/client/ClientList";
import { getQueryAsIntOrNull } from "@/utils/query";

const entryName = "client";

const ClientsPage = () => {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const { isMobile } = useIsMobile();

  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");

  return (
    <div className="flex gap-4">
      <Workspace
        cacheKey={entryName}
        childrenLabels={
          id ? ["Lista klientów", "Właściwości"] : ["Lista klientów"]
        }
        childrenIcons={[IconList, IconNotebook]}
        defaultActive={id !== null ? 1 : 0}
        defaultPinned={id !== null ? [0] : []}
      >
        <div className="relative p-4">
          <ClientsList
            selectedId={id}
            onAddElement={() => setOpenAddModal(true)}
          />
        </div>
        <div className="relative flex flex-col gap-4 p-4">
          <ClientEditable id={id} />
        </div>
      </Workspace>
      <ClientAddModal
        opened={openAddModal}
        onClose={(id?: number) => {
          setOpenAddModal(false);
          id !== undefined &&
            router.push(`/erp/client/${id}`).catch((e) => {
              throw e;
            });
        }}
      />
    </div>
  );
};

export default ClientsPage;

import { useState } from "react";

import { IconList, IconNotebook } from "@tabler/icons-react";
import { useRouter } from "next/router";

import Workspace from "@/components/layout/Workspace";
import { useIsMobile } from "@/hooks/useIsMobile";
import UserAddModal from "@/page-components/erp/user/UserAddModal";
import UserEditable from "@/page-components/erp/user/UserEditable";
import UsersList from "@/page-components/erp/user/UserList";
import { getQueryAsIntOrNull } from "@/utils/query";

const entryName = "user";

const UsersPage = () => {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");

  return (
    <div className="flex gap-4">
      <Workspace
        cacheKey={entryName}
        navigationMetadata={[{ label: "Lista klientów", icon: IconList }]}
        childrenMetadata={
          id !== null ? [{ label: "Właściwości", icon: IconNotebook }] : []
        }
        navigation={
          <div className="relative p-4 ">
            <UsersList
              selectedId={id}
              onAddElement={() => setOpenAddModal(true)}
            />
          </div>
        }
      >
        {id !== null && (
          <div className="relative flex flex-col gap-4 p-4 ">
            <UserEditable id={id} />
          </div>
        )}
      </Workspace>
      <UserAddModal
        opened={openAddModal}
        onClose={(id?: number) => {
          setOpenAddModal(false);
          id !== undefined &&
            router.push(`/erp/user/${id}`).catch((e) => {
              throw e;
            });
        }}
      />
    </div>
  );
};

export default UsersPage;

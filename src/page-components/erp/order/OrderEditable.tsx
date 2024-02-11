import Editable, { type Key } from "@/components/editable/Editable";
import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableArray from "@/components/editable/EditableArray";
import EditableDate from "@/components/editable/EditableDate";
import EditableDateTime from "@/components/editable/EditableDateTime";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import EditableEnum from "@/components/editable/EditableEnum";
import EditableRichText from "@/components/editable/EditableRichText";
import EditableShortText from "@/components/editable/EditableShortText";
import EditableSwitch from "@/components/editable/EditableSwitch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/AlertDialog";
import Button from "@/components/ui/Button";

import { useLoaded } from "@/hooks/useLoaded";
import useTranslation from "@/hooks/useTranslation";
import { type CustomerWithRelations } from "@/schema/customerZodSchema";
import { type User } from "@/schema/userZodSchema";
import { api } from "@/utils/api";
import { truncString } from "@/utils/truncString";
import { IconCash, IconDotsVertical, IconTrashX } from "@tabler/icons-react";
import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import UserListItem from "../user/UserListItem";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import RefetchButton from "@/components/ui/RefetchButton";
import { useApiOrderGetById, useApiOrderUpdate } from "@/hooks/api/order";

const entryName = "order";

interface OrderEditableProps {
  id: number | null;
}

function OrderEditable(props: OrderEditableProps) {
  const { id } = props;
  const isLoaded = useLoaded();
  const router = useRouter();
  const t = useTranslation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderAddressFromCustomer, setOrderAddressFromCustomer] = useState<
    number | null
  >(null);

  const { orderQuery, customerQuery } = useApiOrderGetById(id);
  const { data, refetch } = orderQuery;
  const { data: customerData } = customerQuery;

  // const { updateOrderAsync } = useApiOrderUpdate({
  //   onSuccess: () => {
  //     refetch().catch((err) => console.log(err));
  //   },
  // })
  const { mutateAsync: updateOrderAsync } = api.order.update.useMutation({
    onSuccess: () => {
      refetch().catch((err) => console.log(err));
    },
  });
  const { mutateAsync: deleteById } = api.order.deleteById.useMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiUpdate = (key: Key, val: any) => {
    console.log(key, val);
    if (typeof key !== "string") return;
    if (!isLoaded) return;
    if (!data) return;
    updateOrderAsync({ id: data.id, [key]: val }).catch(console.log);
  };

  const apiDelete = () => {
    if (!data) return;
    deleteById(data.id)
      .then(() => {
        void router.push(`/erp/order`);
      })
      .catch(console.log);
  };

  // update address if it's not set to customer one
  useEffect(() => {
    if (
      orderAddressFromCustomer !== null &&
      data?.customerId == orderAddressFromCustomer
    ) {
      (customerData as CustomerWithRelations).address &&
        apiUpdate(
          "address",
          _.omit((customerData as CustomerWithRelations).address, ["id"]),
        );
      setOrderAddressFromCustomer(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderAddressFromCustomer, data?.customerId]);

  if (!data)
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        Brak danych
      </div>
    );

  return (
    <>
      <Editable data={data} onSubmit={apiUpdate}>
        <EditableDebugInfo label="ID: " keyName="id" />
        <div className="flex gap-2">
          <RefetchButton onClick={() => void refetch()} />
          <EditableShortText
            leftSection={data.isTemplate ? "Szablon" : undefined}
            keyName="name"
            required
            style={{ fontSize: "1.4em" }}
            className={data.isArchived ? "border-orange-600" : undefined}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-stone-800 bg-stone-800  hover:bg-stone-700 hover:text-stone-50"
              >
                <IconDotsVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-22 max-w-md">
              <DropdownMenuCheckboxItem
                onClick={() => apiUpdate("isTemplate", !data.isTemplate)}
                checked={data.isTemplate ?? false}
              >
                {t.template}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => apiUpdate("isArchived", !data.isArchived)}
                checked={data.isArchived ?? false}
                className="focus:bg-orange-600 focus:text-destructive-foreground dark:focus:bg-orange-800"
              >
                {t.archive}
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteModalOpen(true)}
                className="flex gap-2 focus:bg-destructive focus:text-destructive-foreground"
              >
                <IconTrashX size={18} /> {t.delete} {t[entryName].singular}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <EditableEnum
          label="Status"
          keyName="status"
          enum_data={[
            "planned",
            "accepted",
            "in_production",
            "wrapped",
            "sent",
            "rejected",
          ]}
        />

        <EditableRichText label="Notatki" keyName="notes" />
        <EditableShortText
          keyName="price"
          label="Cena"
          leftSection={<IconCash />}
        />
        <EditableSwitch
          keyName="isPricePaid"
          label="Cena zapłacona: "
          variant="color"
        />
        <EditableEnum
          label="Rozliczenie"
          keyName="settlement"
          enum_data={["not_set", "invoice", "receipt"]}
        />
        <EditableDate keyName="dateOfAdmission" label="Data przyjecia" />
        <EditableDate keyName="dateOfCompletion" label="Data ukończenia" />
        {/* <EditableApiEntry
          keyName="customer"
          label="Klient"
          entryName="customer"
          linkEntry
          allowClear
          listProps={customerListSearchParams}
          Element={CustomerListItem}
          onSubmit={(value) => {
            // check if address is set
            if (
              data.address === null ||
              (!data.address.apartmentNumber &&
                !data.address.streetName &&
                !data.address.streetNumber &&
                !data.address.postCode &&
                !data.address.city &&
                !data.address.secondLine)
            )
              value?.id && setOrderAddressFromCustomer(value.id);
          }}
        /> */}
        {/* <div>
          <EditableAddress
            label="Adres"
            keyName="address"
            leftSection={<IconAddressBook />}
          />
          {!!data.customer && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => {
                    console.log(data.customer);
                    !!data.customer &&
                      apiUpdate(
                        "address",
                        omit((data.customer as CustomerWithRelations).address, [
                          "id",
                        ]),
                      );
                  }}
                >
                  <IconCopy />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Kopiuj adres z klienta</TooltipContent>
            </Tooltip>
          )}
        </div>
*/}

        <EditableArray<User> label="Pracownicy" keyName="employees">
          <EditableApiEntry
            linkEntry
            entryName="user"
            Element={UserListItem}
            copyProvider={(value: { name: string } | null) =>
              value?.name ? truncString(value.name, 40) : undefined
            }
            allowClear
          />
        </EditableArray>

        <EditableDateTime
          keyName="createdAt"
          label="Utworzono"
          disabled
          collapse
        />
        <EditableDateTime
          keyName="updatedAt"
          label="Edytowano"
          disabled
          collapse
        />
      </Editable>

      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogDescription>
              {t.operation_not_reversible}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={apiDelete} variant="destructive">
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default OrderEditable;

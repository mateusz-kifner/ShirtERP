import { api } from "@/utils/api";
import queryDefaults from "./queryDefaults";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

// TODO populate address cache and customer cache
// Attempt to populate Product cache, users cache and file cache
// ignore spreadsheet cache
//

export function useApiOrderGetById(id: number | null | undefined) {
  const [firstLoad, setFirstLoad] = useState(true);
  const RQClient = useQueryClient();

  const orderFullQuery = api.order.getFullById.useQuery(id as number, {
    enabled: id !== null && id !== undefined && firstLoad,
    ...queryDefaults,
  });

  const orderQuery = api.order.getById.useQuery(id as number, {
    enabled: id !== null && id !== undefined && !firstLoad,
    refetchOnMount: false,
    staleTime: 60 * 1000, // 60s
  });

  const customerQuery = api.customer.getById.useQuery(id as number, {
    enabled:
      id !== null &&
      id !== undefined &&
      !firstLoad &&
      (orderFullQuery?.data?.customerId ?? null) !== null,
    refetchOnMount: false,
    staleTime: 60 * 1000, // 60s
  });

  const addressQuery = api.address.getById.useQuery(
    orderFullQuery?.data?.addressId as number,
    {
      enabled:
        id !== null &&
        id !== undefined &&
        !firstLoad &&
        (orderFullQuery?.data?.addressId ?? null) !== null,
      refetchOnMount: false,
      staleTime: 60 * 1000, // 60s
    },
  );

  useEffect(() => {
    if (
      firstLoad &&
      typeof orderFullQuery?.data?.addressId === "number" &&
      typeof orderFullQuery?.data?.customerId === "number" &&
      typeof orderFullQuery?.data?.id === "number"
    ) {
      // Order
      const orderGetByIdKey = getQueryKey(
        api.order.getById,
        orderFullQuery.data.id,
        "query",
      );

      // RQClient.setQueryData(
      //   customerGetByIdKey,
      //   omit(orderFullQuery?.data, "address"),
      // );

      // Customer
      const customerGetByIdKey = getQueryKey(
        api.customer.getById,
        orderFullQuery.data.id,
        "query",
      );

      RQClient.setQueryData(
        customerGetByIdKey,
        orderFullQuery?.data?.customer ?? undefined,
      );

      // Address
      const addressGetByIdKey = getQueryKey(
        api.address.getById,
        orderFullQuery.data.addressId,
        "query",
      );

      RQClient.setQueryData(
        addressGetByIdKey,
        orderFullQuery?.data?.address ?? undefined,
      );

      setFirstLoad(false);
    }
  }, [orderFullQuery.isSuccess]);

  return {
    orderQuery,
    customerQuery,
    addressQuery,
  };
}

type UseTRPCMutationOrderCreateOptions = Parameters<
  typeof api.order.create.useMutation
>[0];

export function useApiOrderCreate(opts?: UseTRPCMutationOrderCreateOptions) {
  const mutation = api.order.create.useMutation(opts);
  return {
    ...mutation,
    createOrder: mutation.mutate,
    createOrderAsync: mutation.mutateAsync,
  };
}

type UseTRPCMutationOrderUpdateOptions = Parameters<
  typeof api.order.update.useMutation
>[0];

export function useApiOrderUpdate(opts?: UseTRPCMutationOrderUpdateOptions) {
  const mutation = api.order.update.useMutation(opts);
  return {
    ...mutation,
    updateOrder: mutation.mutate,
    updateOrderAsync: mutation.mutateAsync,
  };
}

type UseTRPCMutationOrderDeleteOptions = Parameters<
  typeof api.order.deleteById.useMutation
>[0];

export function useApiOrderDelete(opts?: UseTRPCMutationOrderDeleteOptions) {
  const mutation = api.order.deleteById.useMutation(opts);
  return {
    ...mutation,
    deleteOrder: mutation.mutate,
    deleteOrderAsync: mutation.mutateAsync,
  };
}

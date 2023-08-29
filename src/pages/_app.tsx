import { type AppType } from "next/app";

import "@total-typescript/ts-reset";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Logger from "js-logger";
import Head from "next/head";

import AppLayout from "@/components/layout/AppLayout";
import { UserContextProvider } from "@/context/userContext";
import { env } from "@/env.mjs";
import { api } from "@/utils/api";

import "@/styles/globals.css";

// dayjs imports
import dayjs from "dayjs";
import "dayjs/locale/pl";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

import { Toaster } from "@/components/layout/Toaster";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { toast } from "@/hooks/useToast";
import isToday from "dayjs/plugin/isToday";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

dayjs.extend(localizedFormat);
dayjs.extend(isToday);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(utc);

// TODO: refactor logger

if (typeof window !== "undefined") {
  Logger.setHandler(function (messages, context) {
    console.log(messages);
    const savedValue = localStorage.getItem("user-data"); // TODO: log user id here
    console.log(messages[0]?.message ?? "Nieznany błąd", messages[0]);
    if (context.level === Logger.ERROR)
      if (context.level === Logger.WARN)
        toast({
          title: "Błąd",
          description:
            messages[0]?.message ??
            "Nieznany błąd: sprawdź szczegóły w logu serwera",
        });
    if (typeof messages[0] === "string") {
      toast({
        title: "Ostrzeżenie",
        // description:
        //   messages[0].message ??
        //   "Nieznany błąd: sprawdź szczegóły w logu serwera",
      });
      // axios.post("/logs", {
      //   message: messages[0],
      //   type: context.level.name,
      //   userId: savedValue && savedValue?.length > 0 ? savedValue : null,
      // });
    } else {
      // axios.post("/logs", {
      //   message: messages[0]?.message ? messages[0]?.message : "Nieznany błąd",
      //   data: messages[0],
      //   type: context.level.name,
      //   userId: savedValue && savedValue?.length > 0 ? savedValue : null,
      // });
    }
  });
}

Logger.setLevel(
  env.NEXT_PUBLIC_NODE_ENV === "development" ? Logger.INFO : Logger.WARN,
);

const App: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  dayjs.locale(router.locale);

  useEffect(() => {
    const remSize = localStorage.getItem("remSize");
    const html = document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    html.style.fontSize = `${remSize}px`;
  }, []);

  const changeLocale = (value: string) => {
    router.push("/", "/", { locale: value }).catch((e) => {
      throw e;
    });
  };

  // force Polish for now
  useEffect(() => {
    if (router.locale !== "pl") changeLocale("pl");
  }, [router.locale]);

  return (
    <UserContextProvider>
      <TooltipProvider>
        <AppLayout>
          <Head>
            <title>ShirtERP</title>
          </Head>
          <ErrorBoundary fallback={<h1>Application crashed</h1>}>
            <Component {...pageProps} />
          </ErrorBoundary>
        </AppLayout>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </TooltipProvider>
    </UserContextProvider>
  );
};

export default api.withTRPC(App);

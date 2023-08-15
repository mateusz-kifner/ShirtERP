import { Children, useId, type ReactNode } from "react";

import { useElementSize } from "@mantine/hooks";
import { useRouter } from "next/router";

import { useUserContext } from "@/context/userContext";
import useTranslation from "@/hooks/useTranslation";
import TablerIconType from "@/schema/TablerIconType";
import { getQueryAsIntOrNull } from "@/utils/query";
import { IconAlertCircle } from "@tabler/icons-react";
import { ErrorBoundary } from "react-error-boundary";
import MultiTabs from "./MultiTabs/MultiTabs";
import { Tab } from "./MultiTabs/Tab";
import useMultiTabsState from "./MultiTabs/useMultiTabsState";

// import MultiTabs from "./MultiTabs"

interface WorkspaceProps {
  cacheKey: string;
  childrenWrapperProps?: any[];
  childrenLabels?: string[];
  childrenIcons?: TablerIconType[];
  children?: ReactNode;
  defaultActive?: number;
  defaultPinned?: number[];
  leftMenuSection?: ReactNode;
  rightMenuSection?: ReactNode;
  disablePin?: boolean;
}

const Workspace = ({
  cacheKey,
  children,
  childrenLabels = [],
  childrenIcons = [],
  childrenWrapperProps = [null],
  defaultActive = 1,
  defaultPinned = [0],
  leftMenuSection,
  rightMenuSection,
  disablePin,
}: WorkspaceProps) => {
  // const { isSmall, hasTouch } = useAuthContext()
  // const isMobile = hasTouch || isSmall
  // const [menuPosition, setMenuPosition] = useState<[number, number]>([0, 0])
  // const [menuOpened, setMenuOpen] = useState<boolean>(false)
  // const [pinned, setPinned] = useState<number[]>([]);
  // const [active, setActive] = useState<number | undefined>();
  const uuid = useId();
  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");
  const multiTabsState = useMultiTabsState(
    defaultActive,
    defaultPinned,
    cacheKey,
  );

  const t = useTranslation();
  const { navigationCollapsed, toggleNavigationCollapsed, debug } =
    useUserContext();
  const { ref, width } = useElementSize();

  // const [tabStateArray, setTabStateArray] = useRQCache<{
  //   [key: string]: { active?: number; pinned: number[] };
  // }>("pinned_" + cacheKey, {});

  // const tabState = tabStateArray?.[cacheKey] ?? {
  //   active: defaultActive,
  //   pinned: defaultPinned,
  // };

  // const setTabState = (pinned: number[], active?: number) => {
  //   setTabStateArray({ ...tabStateArray, [cacheKey]: { active, pinned } });
  // };

  // const togglePin = (pin: number) => {
  //   if (disablePin) return;
  //   if (tabState.pinned.indexOf(pin) !== -1) {
  //     setTabState(
  //       tabState.pinned.filter((val) => val !== pin),
  //       tabState.active,
  //     );
  //   } else {
  //     setTabState([...tabState.pinned, pin], tabState.active);
  //   }
  // };

  // const setActive = (active?: number) => {
  //   setTabState(tabState.pinned, active);
  // };
  // setPinned((pinnedArray) => {
  //   if (pinnedArray.includes(pinned)) {
  //     return pinnedArray.filter((val) => val !== pinned);
  //   } else {
  //     return [...pinnedArray, pinned];
  //   }
  // });

  const child_array = Children.toArray(children);

  const activeTabs = [...multiTabsState.pinned];
  if (
    multiTabsState.active !== undefined &&
    !activeTabs.includes(multiTabsState.active)
  )
    activeTabs.push(multiTabsState.active);

  // useEffect(() => {
  //   if (!childrenLabels) return
  //   let new_arr = [...pinned]
  //   if (active && !pinned.includes(active)) new_arr.push(active)
  //   let index_arr = new_arr.map((val) => childrenLabels?.indexOf(val))
  //   setQuery(router, {
  //     show_views: index_arr.map((val) => val.toString()),
  //   })
  // }, [pinned, active])

  // const openMenu = (e: MouseEvent<any, any>) => {
  //   setMenuPosition(isMobile ? [width / 2, 60] : [e.pageX, e.pageY])
  //   setMenuOpen(true)
  // }

  return (
    <div
      className="flex flex-grow flex-nowrap items-start gap-4 overflow-hidden p-1 sm:p-4"
      ref={ref}
    >
      <MultiTabs
        {...multiTabsState}
        key={childrenLabels.reduce((prev, next) => prev + next, "")}
      >
        {childrenLabels.map((label, index) => {
          const Icon =
            childrenIcons?.[index] ??
            childrenIcons?.[childrenIcons.length - 1] ??
            IconAlertCircle;
          return (
            <Tab key={`${uuid}${index}`} leftSection={<Icon />}>
              {label}
            </Tab>
          );
        })}
      </MultiTabs>
      {children &&
        activeTabs.map((childIndex, index) => (
          <div
            key={uuid + index}
            className="flex w-[420px] min-w-[420px] flex-col rounded bg-white shadow-lg dark:bg-stone-800"
            {...(childrenWrapperProps &&
            childrenWrapperProps[childIndex] !== undefined
              ? childrenWrapperProps[childIndex]
              : { style: { flexGrow: 1 } })}
          >
            <ErrorBoundary
              fallback={
                <h1>
                  Tab number {childIndex} named {'"'}
                  {childrenLabels[childIndex] ?? "[unknown]"}
                  {'"'} encountered irreparable error and crashed, please reload
                  page.
                </h1>
              }
            >
              {child_array[childIndex]}
            </ErrorBoundary>
          </div>
        ))}
    </div>
  );
};

export default Workspace;

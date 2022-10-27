import {
  useMemo,
  useRef,
  MouseEvent,
  useCallback,
  useEffect,
  SVGAttributes,
} from "react"
import { Dimensions, Point } from "react-spreadsheet"

import type { FC, ComponentType } from "react"
import type { CellBase, CellComponentProps } from "react-spreadsheet"
import { merge } from "lodash"
import colors from "../models/colors.json"

/** Get the offset values of given element */
export function getOffsetRect(element: HTMLElement): Dimensions {
  return {
    width: element.offsetWidth,
    height: element.offsetHeight,
    left: element.offsetLeft,
    top: element.offsetTop,
  }
}

type GenericSVGIcon = ComponentType<
  ({ size?: number } & SVGAttributes<SVGElement>) | any
>

type CellWithIcons = CellComponentProps<
  CellBase<string> & { metaId?: number; metaActionId?: number }
> & {
  icons: GenericSVGIcon[]
}

export const Cell = ({
  row,
  column,
  DataViewer,
  formulaParser,
  selected,
  active,
  dragging,
  mode,
  data,
  select,
  activate,
  setCellDimensions,
  icons,
}: CellWithIcons) => {
  const rootRef = useRef<HTMLTableCellElement | null>(null)
  const point = useMemo(
    (): Point => ({
      row,
      column,
    }),
    [row, column]
  )

  const handleMouseDown = useCallback(
    (event: MouseEvent<HTMLTableCellElement>) => {
      if (mode === "view") {
        setCellDimensions(point, getOffsetRect(event.currentTarget))

        if (event.shiftKey) {
          select(point)
        } else {
          activate(point)
        }
      }
    },
    [mode, setCellDimensions, point, select, activate]
  )

  const handleMouseOver = useCallback(
    (event: MouseEvent<HTMLTableCellElement>) => {
      if (dragging) {
        setCellDimensions(point, getOffsetRect(event.currentTarget))
        select(point)
      }
    },
    [setCellDimensions, select, dragging, point]
  )
  useEffect(() => {
    const root = rootRef.current
    if (selected && root) {
      setCellDimensions(point, getOffsetRect(root))
    }
    if (root && active && mode === "view") {
      root.focus()
    }
  }, [setCellDimensions, selected, active, mode, point, data])

  if (data && data.DataViewer) {
    // @ts-ignore
    DataViewer = data.DataViewer
  }

  const Icon = icons?.[data?.metaActionId ?? -1]

  return (
    <td
      ref={rootRef}
      className={"Spreadsheet__cell"}
      // @ts-ignore
      style={merge(data?.style, {
        // @ts-ignore
        background: data?.metaId ? colors[data?.metaId % 10] + "88" : undefined,
      })}
      onMouseOver={handleMouseOver}
      onMouseDown={handleMouseDown}
      tabIndex={0}
    >
      {Icon && (
        <Icon size={12} style={{ position: "absolute", top: 0, right: 0 }} />
      )}
      <DataViewer
        row={row}
        column={column}
        cell={data ?? { value: "" }}
        formulaParser={formulaParser}
        setCellData={function (cell: CellBase<any>): void {
          throw new Error("Function not implemented.")
        }}
      />
    </td>
  )
}

export const enhance = (
  CellComponent: FC<CellWithIcons>,
  icons: GenericSVGIcon[]
): FC<CellWithIcons> => {
  return function ColumnIndicatorWrapper(props) {
    return <CellComponent {...props} icons={icons} />
  }
}

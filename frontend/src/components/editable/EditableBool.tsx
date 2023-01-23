import { Group, Switch, Text, Checkbox } from "@mantine/core"
import { useHover } from "@mantine/hooks"

import { useEffect, useState, useRef } from "react"
import EditableInput from "../../types/EditableInput"

// FIXME: respect disabled state
// TODO: Remake this to respect height

interface EditableBoolProps extends EditableInput<boolean> {
  checkbox?: boolean
  checkLabels: { checked: string; unchecked: string }
  stateLabels: { checked: string; unchecked: string }
}

const EditableBool = (props: EditableBoolProps) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    checkbox,
    checkLabels = { checked: undefined, unchecked: undefined },
    stateLabels = { checked: "Tak", unchecked: "Nie" },
    rightSection,
    leftSection,
  } = props
  const [bool, setBool] = useState<boolean>(value ?? initialValue ?? false)
  const [dirty, setDirty] = useState<boolean>(false)
  const { hovered, ref } = useHover()

  const active = hovered && !disabled

  useEffect(() => {
    value !== undefined && setBool(value)
  }, [value])

  useEffect(() => {
    if (dirty) {
      onSubmit?.(bool)
    }
    // eslint-disable-next-line
  }, [bool])

  return (
    <Group
      ref={ref}
      align="center"
      style={{ minHeight: "2em", marginBottom: "1em" }}
    >
      {!!leftSection && leftSection}
      <Text>{label}</Text>
      {active ? (
        checkbox ? (
          <Checkbox
            onChange={(e) => {
              setDirty(true)
              setBool(e.target.checked)
            }}
            checked={bool}
          />
        ) : (
          <Switch
            onChange={(e) => {
              setDirty(true)
              setBool(e.target.checked)
            }}
            checked={bool}
            onLabel={checkLabels.checked}
            offLabel={checkLabels.unchecked}
          />
        )
      ) : (
        <Text
          weight={700}
          sx={(theme) => ({
            position: "relative",
            padding: "1px 0.5em",
            // border:
            // theme.colorScheme === "dark"
            //   ? "1px solid #2C2E33"
            //   : "1px solid #ced4da",
            borderRadius: theme.radius.sm,
            "&:after": {
              content: "''",
              position: "absolute",
              bottom: 0,
              left: "10%",
              width: "80%",
              boxShadow: bool
                ? "0px -2px 3px 1px #0a0"
                : "0px -2px 3px 1px #f00",
            },
          })}
        >
          {bool ? stateLabels.checked : stateLabels.unchecked}
        </Text>
      )}
      {!!rightSection && rightSection}
    </Group>
  )
}

export default EditableBool

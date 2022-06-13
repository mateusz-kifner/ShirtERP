import { ComponentType, FC, Ref, SyntheticEvent } from "react"

import {
  DefaultMantineColor,
  Group,
  ThemeIcon,
  UnstyledButton,
  Text,
  MantineGradient,
  Avatar,
} from "@mantine/core"
import { ChevronRight } from "../../utils/TablerIcons"
import { Link } from "react-router-dom"

interface NavButtonProps {
  label: string
  Icon?: ComponentType
  to: any
  color?: DefaultMantineColor
  gradient?: MantineGradient
  onClick?: (e: SyntheticEvent) => void
  buttonRef?: Ref<any>
}

export const NavButton: FC<NavButtonProps> = ({
  label,
  Icon,
  to,
  color,
  gradient,
  onClick = () => {},
  buttonRef,
}) => {
  // console.log(small)
  return (
    <UnstyledButton
      ref={buttonRef}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        minHeight: 60,
        padding: theme.spacing.xs,
        borderRadius: theme.radius.md,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        overflow: "hidden",
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
      component={Link}
      to={to}
      onClick={onClick}
    >
      <Group position="apart" noWrap>
        <Group spacing="xl" noWrap>
          {Icon ? (
            <ThemeIcon
              variant={gradient ? "gradient" : "filled"}
              gradient={gradient ? gradient : undefined}
              color={gradient ? undefined : color ? color : "blue"}
              size="xl"
              radius="xl"
            >
              {/*
          // @ts-ignore */}
              <Icon size={32} />
            </ThemeIcon>
          ) : (
            <Avatar radius="xl">{label?.substring(0, 2).toUpperCase()}</Avatar>
          )}
          <Text size="sm" style={{ whiteSpace: "nowrap" }}>
            {label}
          </Text>
        </Group>
        <ChevronRight />
      </Group>
    </UnstyledButton>
  )
}
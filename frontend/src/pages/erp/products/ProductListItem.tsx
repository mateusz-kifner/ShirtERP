import {
  Avatar,
  Box,
  Group,
  UnstyledButton,
  useMantineTheme,
  Text,
} from "@mantine/core"
import { FC } from "react"
import ApiIconSVG from "../../../components/api/ApiIconSVG"
import { ProductType } from "../../../types/ProductType"
import convert from "color-convert"

const ProductListItem: FC<{
  onChange?: (product: Partial<ProductType>) => void
  value: Partial<ProductType>
}> = ({ value, onChange }) => {
  const theme = useMantineTheme()

  return (
    <UnstyledButton
      sx={{
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      }}
      onClick={() => onChange && onChange(value)}
    >
      <Group>
        <Avatar
          // style={{ backgroundColor: value.attributes.color?.hex }}
          styles={{
            placeholder: { backgroundColor: value?.color?.hex },
          }}
          radius="xl"
        >
          <ApiIconSVG
            entryName="productCategories"
            id={value.iconId}
            color={
              value?.color?.hex
                ? convert.hex.hsl(value.color.hex)[2] < 0.5
                  ? "#fff"
                  : "#000"
                : theme.colorScheme === "dark"
                ? "#fff"
                : "#000"
            }
            noError
          />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {value.name}
          </Text>
          <Text color="dimmed" size="xs">
            {value.codeName}
          </Text>
        </Box>

        {/* {theme.dir === "ltr" ? (
          <ChevronRight size={18} />
        ) : (
          <ChevronLeft size={18} />
        )} */}
      </Group>
    </UnstyledButton>
  )
}

export default ProductListItem

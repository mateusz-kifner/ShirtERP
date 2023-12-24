import { Children, ReactElement, ReactNode, cloneElement, useId } from "react";
import Editable, { useEditableContextWithoutOverride } from "./Editable";
import { cn } from "@/utils/cn";

interface EditableObjectProps {
  children: ReactNode;
  data?: Record<string | number, any>;
  onSubmit?: (key: string | number, value: any) => void;
  keyName?: string | number;
  className?: string;
}

function EditableObject(props: EditableObjectProps) {
  const { children, keyName, className } = props;
  if (keyName === undefined) throw new Error("keyName not defined");
  const context = useEditableContextWithoutOverride();
  const uuid = useId();
  const data = props?.data?.[keyName] ?? context.data?.[keyName] ?? {};
  const superOnSubmit = props.onSubmit ?? context.onSubmit;
  const onSubmit = (key: string | number, value: any) => {
    if (typeof key === "number")
      throw new Error("EditableObject received number key");
    console.log(key, value);
    const newData = { ...data };
    newData[key] = value;
    superOnSubmit?.(keyName, newData);
    console.log("ObjSET: ", key, value);
  };

  return (
    <Editable onSubmit={onSubmit} data={data}>
      {children}
    </Editable>
  );
}

export default EditableObject;

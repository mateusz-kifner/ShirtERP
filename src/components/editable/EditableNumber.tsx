import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

import InputLabel from "@/components/input/InputLabel";
import { handleBlurForInnerElements } from "@/utils/handleBlurForInnerElements";
import preventLeave from "@/utils/preventLeave";

import type EditableInput from "@/types/EditableInput";
import DisplayCell from "../ui/DisplayCell";

interface EditableNumberProps extends EditableInput<number> {
  maxLength?: number;
  style?: CSSProperties;
  increment?: number;
  fixed?: number;
  min?: number;
  max?: number;
}

const EditableNumber = (props: EditableNumberProps) => {
  const {
    label,
    value,
    onSubmit,
    disabled,
    required,
    maxLength = Number.MAX_SAFE_INTEGER,
    style,
    className,
    leftSection,
    rightSection,
    increment = 0.01,
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
    fixed = 2,
    ...moreProps
  } = props;
  const uuid = useId();
  const [text, setText] = useState<string>(value?.toString() ?? "");
  const [focus, setFocus] = useState<boolean>(false);
  const InputRef = useRef<HTMLInputElement>(null);

  // const t = useTranslation();
  useEffect(() => {
    if (focus) {
      window.addEventListener("beforeunload", preventLeave);
      InputRef.current?.focus();
      InputRef.current?.selectionStart &&
        (InputRef.current.selectionStart = InputRef.current.value.length);
    } else {
      if (text !== value?.toString()) {
        onSubmit?.(parseFloat(text));
      }
      window.removeEventListener("beforeunload", preventLeave);
    }
    // eslint-disable-next-line
  }, [focus]);

  useEffect(() => {
    return () => {
      if (text !== (value ?? "")) {
        onSubmit?.(parseFloat(text));
      }
      window.removeEventListener("beforeunload", preventLeave);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (value?.toString() !== text) {
      const new_value = value?.toString() ?? "";
      setText(new_value);
    }
  }, [value]);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < maxLength) {
      setText(e.target.value);
    }
  };

  const onKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (focus) {
      console.log(e.code);
      if (e.code === "Enter" && !e.shiftKey) {
        e.preventDefault();
        (e.target as HTMLInputElement).blur();
        setFocus(false);
      }
      if (e.code === "ArrowUp") {
        const multiplier = e.ctrlKey ? 100 : e.shiftKey ? 10 : 1;
        setText((val) =>
          (parseFloat(val) + increment * multiplier).toFixed(fixed)
        );
      }
      if (e.code === "ArrowDown") {
        const multiplier = e.ctrlKey ? 100 : e.shiftKey ? 10 : 1;
        setText((val) =>
          (parseFloat(val) - increment * multiplier).toFixed(fixed)
        );
      }
    }
  };

  return (
    <div
      className="flex-grow"
      onClick={() => !disabled && setFocus(true)}
      onFocus={() => !disabled && setFocus(true)}
      onBlur={handleBlurForInnerElements(() => setFocus(false))}
    >
      <InputLabel
        label={label}
        copyValue={text}
        htmlFor={"short_text_" + uuid}
      />
      <DisplayCell
        leftSection={leftSection}
        rightSection={rightSection}
        focus={focus}
      >
        <input
          id={"short_text_" + uuid}
          name={"short_text_" + uuid}
          required={required}
          readOnly={disabled}
          ref={InputRef}
          className={`
          data-disabled:text-gray-500
          dark:data-disabled:text-gray-500
          w-full
          resize-none
          overflow-hidden
          whitespace-pre-line 
          break-words
          bg-transparent
          py-3
          text-sm
          outline-none
          focus-visible:border-transparent
          focus-visible:outline-none
          ${className ?? ""}`}
          style={style}
          value={text}
          onFocus={() => !disabled && setFocus(true)}
          onClick={() => !disabled && setFocus(true)}
          onChange={onChangeInput}
          onKeyDown={onKeyDownInput}
          maxLength={maxLength}
          {...moreProps}
        />
      </DisplayCell>
    </div>
  );
};

export default EditableNumber;

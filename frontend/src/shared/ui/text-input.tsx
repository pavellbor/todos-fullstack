import clsx from "clsx";
import { useState } from "react";

type TextInputProps = {
  value: string;
  placeholder?: string;
  isFocused?: boolean;
  onChange: (value: string) => void;
};

export const TextInput = ({
  value,
  placeholder,
  isFocused: initialIsFocused = false,
  onChange,
}: TextInputProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(initialIsFocused);

  return (
    <div className={clsx("text-input", isFocused && "text-input--focus")}>
      <input
        value={value}
        className="input"
        placeholder={placeholder}
        autoFocus={isFocused}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

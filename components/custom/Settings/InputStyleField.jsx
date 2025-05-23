import React from "react";
import { Input } from "@/components/ui/input";

const InputStyleField = ({
  label,
  value,
  onHandleStyleChange,
  type = "px",
}) => {
  const formattedValue = (value_) => {
    if (!value_) return "";
    const str = value_.toString();
    const stripped = str.replace(type, "");

    // Allow empty string or valid number
    if (stripped === "") return "";
    const num = Number(stripped);

    return isNaN(num) ? "" : num;
  };

  return (
    <div>
      <label>{label}</label>
      <div className="flex">
        <Input
          type="text"
          value={formattedValue(value)}
          onChange={(e) => onHandleStyleChange(e.target.value + type)}
        />
        <h2 className="p-1 bg-gray-100 rounded-r-lg -ml-1">{type}</h2>
      </div>
    </div>
  );
};

export default InputStyleField;

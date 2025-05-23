import { Slider } from "@/components/ui/slider";
import React from "react";

const SliderField = ({ label, value, onHandleStyleChange, type = "px" }) => {
  //   const formattedValue = (value_) => {
  //     if (!value_) return "";
  //     const str = value_.toString();
  //     const stripped = str.replace(type, "");

  //     // Allow empty string or valid number
  //     if (stripped === "") return "";
  //     const num = Number(stripped);

  //     return isNaN(num) ? "" : num;
  //   };

  const formattedValue = (value_) => {
    return Number(value_.toString().replace(type, ""));
  };

  return (
    <div>
      <label>
        {label}({value})
      </label>
      <Slider
        defaultValue={[formattedValue(value)]}
        max={100}
        step={1}
        onValueChange={(v) => onHandleStyleChange(v + type)}
      />
    </div>
  );
};

export default SliderField;

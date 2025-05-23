import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import React from "react";

function ToggleGroupField({ label, value, options, onHandleStyleChange }) {
  return (
    <div>
      <label htmlFor="">{label}</label>
      <ToggleGroup
        type="single"
        defaultValue={value}
        onValueChange={(v) => onHandleStyleChange(v)}
        className="w-full"
      >
        {options.map((option, index) => (
          <ToggleGroupItem key={index} value={option?.value}>
            <option.icon />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

export default ToggleGroupField;

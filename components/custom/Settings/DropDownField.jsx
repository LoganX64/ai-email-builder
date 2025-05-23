import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

function DropDownField({ label, value, options, onHandleStyleChange }) {
  return (
    <div>
      <label htmlFor="">{label}</label>
      <Select
        onValueChange={(v) => onHandleStyleChange(v)}
        defaultValue={value}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={value}></SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options?.map((option, index) => (
            <SelectItem value={option} key={index}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default DropDownField;

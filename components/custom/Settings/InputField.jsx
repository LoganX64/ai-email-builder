import { Input } from "@/components/ui/input";
import React from "react";

const InputField = ({ label, value, onHandleInputChange }) => {
  return (
    <div>
      <label>{label}</label>
      <div>
        <Input
          type="text"
          value={value}
          onChange={(event) => onHandleInputChange(event.target.value)}
        />
      </div>
    </div>
  );
};

export default InputField;

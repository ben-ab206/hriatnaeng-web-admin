import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Option {
  id: string;
  label: string;
}

interface CheckboxRadioGroupProps {
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
}

const CheckboxRadioGroup: React.FC<CheckboxRadioGroupProps> = ({
  options,
  value,
  onValueChange,
}) => {
  const handleCheckboxChange = (id: string) => {
    if (onValueChange) {
      onValueChange(id);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      {options.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <Checkbox
            id={option.id}
            checked={value === option.id}
            onCheckedChange={() => handleCheckboxChange(option.id)}
          />
          <Label
            htmlFor={option.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default CheckboxRadioGroup;

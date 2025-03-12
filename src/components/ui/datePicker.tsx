import { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon, X } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";

// Define a generic type for the form props
interface CustomDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  form: { 
    control: Control<TFieldValues> 
  };
  name: TName;
  label: string;
}

const customDatePickerStyles = `
  .react-datepicker {
    background-color: #1f2937;
    color: white;
    border-color: rgb(31, 86, 173);
    font-family: inherit;
  }
  .react-datepicker__header {
    background-color: #1f2937;
    border-bottom-color: #374151;
  }
  .react-datepicker__month-container {
    background-color: #1f2937;
  }
  .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
    color: #d1d5db;
  }
  .react-datepicker__day:hover, .react-datepicker__month-text:hover, 
  .react-datepicker__quarter-text:hover, .react-datepicker__year-text:hover {
    background-color: #4b5563;
  }
  .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
    background-color: #ef4444;
    color: white;
  }
  .react-datepicker__day--outside-month {
    color: #6b7280;
  }
  .react-datepicker__navigation-icon::before {
    border-color: #d1d5db;
  }
  .react-datepicker__current-month {
    color: white;
  }
  
  .react-datepicker-wrapper {
    display: block !important;
    width: 100%;
  }
  
  /* Hide the default clear button */
  .react-datepicker__close-icon {
    display: none !important;
  }
  .react-datepicker__month-select {
    color: black;
    border-radius: 3px;
  }
  .react-datepicker__year-select{
    color: black;
    border-radius: 3px;
  }
`;

function CustomDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ form, name, label }: CustomDatePickerProps<TFieldValues, TName>) {
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = customDatePickerStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative w-full">
              <DatePicker
                 selected={
                  field.value 
                    ? typeof field.value === "string" 
                      ? new Date(field.value) 
                      : field.value
                    : null
                }
                onChange={(date) => {
                  field.onChange(date || null);
                }}
                dateFormat="dd/MM/yyyy"
                className="w-full border border-gray-300 bg-white text-gray-900 rounded-md px-4 py-2 pr-16 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                popperClassName="react-datepicker-dark"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                calendarStartDay={1}
                isClearable={true}
              />
              
              {/* Custom icons positioned together */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                {field.value && (
                  <X
                    size={16}
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                    // onClick={() => field.onChange(undefined)}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      field.onChange(null);
                    }}
                  />
                )}
                <CalendarIcon size={18} className="text-gray-400" />
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default CustomDatePicker;
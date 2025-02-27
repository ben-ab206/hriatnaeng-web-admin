import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";
import { HiOutlineSearch } from "react-icons/hi";

interface SectionTableSearchToolProps {
  onChange: (v: string) => void;
}

const SectionTableSearchTool = ({ onChange }: SectionTableSearchToolProps) => {
  const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-row w-full justify-end my-5">
      <div>
        <Input
          className="max-w-md md:w-52 md:mb-0 mb-4"
          placeholder="Search"
          prefix={<HiOutlineSearch className="text-lg" />}
          onChange={onEdit}
        />
      </div>
    </div>
  );
};

export default SectionTableSearchTool;

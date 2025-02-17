import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";
import { HiOutlineSearch } from "react-icons/hi";

interface CollectionsTableSearchToolProps {
  onChange: (v: string) => void;
}

const CollectionsTableSearchTool = ({
  onChange,
}: CollectionsTableSearchToolProps) => {
  const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-row w-full justify-end my-5">
      <div></div>
      <Input
        className="max-w-md md:w-52 md:mb-0 mb-4"
        placeholder="Search"
        prefix={<HiOutlineSearch className="text-lg" />}
        onChange={onEdit}
      />
    </div>
  );
};

export default CollectionsTableSearchTool;

import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";
import { HiOutlineSearch } from "react-icons/hi";

interface AdministratorHeaderToolsProps {
  searchValue: string;
  onChangeSearchValue: (v: string) => void;
}

const AdministratorHeaderTools = ({
  searchValue,
  onChangeSearchValue,
}: AdministratorHeaderToolsProps) => {
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeSearchValue(event.target.value);
  };
  return (
    <div className="flex flex-row items-center justify-between">
      <div></div>
      <div>
        <Input
          value={searchValue}
          placeholder="Search"
          className="max-w-md md:w-52 md:mb-0 mb-4 focus:ring-0 focus:outline-none"
          prefix={<HiOutlineSearch className="text-lg" />}
          onChange={handleOnChange}
        />
      </div>
    </div>
  );
};

export default AdministratorHeaderTools;

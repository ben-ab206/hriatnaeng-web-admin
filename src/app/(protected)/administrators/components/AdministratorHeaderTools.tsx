import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";

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
        <Input value={searchValue} onChange={handleOnChange} />
      </div>
    </div>
  );
};

export default AdministratorHeaderTools;

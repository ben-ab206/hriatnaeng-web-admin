import { Button } from "@/components/ui/button";

interface AdministratorHeaderProps {
  onClickAddNew: () => void;
}

const AdministratorHeader = ({ onClickAddNew }: AdministratorHeaderProps) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <span>Administrators</span>
      <div>
        <Button size={"sm"} onClick={onClickAddNew}>
          Add New
        </Button>
      </div>
    </div>
  );
};

export default AdministratorHeader;

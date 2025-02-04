import { Button } from "@/components/ui/button";

interface AdministratorHeaderToolsProps {
  onClickAddNew: () => void;
}

const AdministratorHeaderTools = ({
  onClickAddNew,
}: AdministratorHeaderToolsProps) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div></div>
      <div>
        <Button onClick={onClickAddNew}>Add New</Button>
      </div>
    </div>
  );
};

export default AdministratorHeaderTools;

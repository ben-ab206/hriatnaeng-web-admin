import { Button } from "@/components/ui/button";

interface CollectionsTableHeaderProps {
  onAddNew: () => void;
}

const CollectionsTableHeader = ({ onAddNew }: CollectionsTableHeaderProps) => {
  return (
    <div className="flex flex-row justify-between">
      <h2>Collections</h2>
      <Button className="" size="sm" onClick={onAddNew}>
        <span className="text-white">Add New</span>
      </Button>
    </div>
  );
};

export default CollectionsTableHeader;

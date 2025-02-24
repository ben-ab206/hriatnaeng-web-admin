import { Button } from "@/components/ui/button";

interface SectionTableHeaderProps {
  onAddNew: () => void;
}

const SectionTableHeader = ({ onAddNew }: SectionTableHeaderProps) => {
  return (
    <div className="flex flex-row justify-between">
      <h2>Sections</h2>
      <Button
        className=""
        size="sm"
        onClick={onAddNew}
      >
        <span className="text-white">Add New</span>
      </Button>
    </div>
  );
};

export default SectionTableHeader;

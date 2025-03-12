import { Button } from "@/components/ui/button";

interface SectionTableHeaderProps {
  onAddNew: () => void;
}

const SectionTableHeader = ({ onAddNew }: SectionTableHeaderProps) => {
  return (
    <div className="flex flex-row justify-between">
      <h2 className="text-[30px] font-semibold">Sections</h2>
      <Button
        className="!bg-[#447AED] !text-[#F5F5F5] font-semibold rounded-sm"
        size="sm"
        onClick={onAddNew}
      >
        <span className="text-white">Add New</span>
      </Button>
    </div>
  );
};

export default SectionTableHeader;

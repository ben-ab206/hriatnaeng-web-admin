import { Button } from "@/components/ui/button";

interface DetailsViewHeaderProps {
  onEdit?: () => void;
  onBackList?: () => void;
}

const DetailsViewHeader = ({ onBackList, onEdit }: DetailsViewHeaderProps) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <span className="font-bold text-2xl">Book Details</span>
      <div className="flex flex-row space-x-4">
        <Button
          className="bg-[#F0F5FE] text-primary"
          onClick={() => onBackList?.()}
        >
          Back to list
        </Button>
        <Button onClick={() => onEdit?.()}>Edit</Button>
      </div>
    </div>
  );
};

export default DetailsViewHeader;

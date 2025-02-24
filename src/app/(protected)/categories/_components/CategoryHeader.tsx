import { Button } from "@/components/ui/button";

interface CategoriesHeaderProps {
  onClickAddNew: () => void;
}   

const CategoriesHeader = ({ onClickAddNew }: CategoriesHeaderProps) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <span className="text-[30px] font-semibold">Categories</span>

      <div>
        <Button 
          size={"sm"}
          className={"!bg-[#447AED] !text-[#F5F5F5] font-semibold rounded-sm"}
          onClick={onClickAddNew}
        >
          Add New
        </Button>
      </div>
    </div>
  );
};

export default CategoriesHeader;
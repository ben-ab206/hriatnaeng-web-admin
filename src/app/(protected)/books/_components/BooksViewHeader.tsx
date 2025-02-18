import { Button } from "@/components/ui/button";

interface BooksViewHeaderProps {
  onClickAddNew: () => void;
}

const BooksViewHeader = ({ onClickAddNew }: BooksViewHeaderProps) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <span>Books</span>
      <Button size={"sm"} onClick={onClickAddNew}>Add New</Button>
    </div>
  );
};

export default BooksViewHeader;

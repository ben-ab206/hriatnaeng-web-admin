import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
// import { SearchIcon } from "lucide-react";

interface TopBannerHeaderTools {
  onTabChange: (value: string) => void;
  tabValue: string;
  searchValue: string;
  onChangeSearch: (v: string) => void;
}

const TopBannerHeaderTools = ({
  onTabChange,
  tabValue,
  searchValue,
  onChangeSearch,
}: TopBannerHeaderTools) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChangeSearch(value);
  };

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-row space-x-2 items-center">
        <Button
          className={cn("bg-transparent text-[#5C769B] rounded-sm hover:text-white", {
            "bg-[#EBEEF3] text-[#1F2532]": tabValue === "home",
          })}
          size={"sm"}
          onClick={() => onTabChange("home")}
        >
          Home
        </Button>
        <Button
          className={cn("bg-transparent text-[#5C769B] rounded-sm hover:text-white", {
            "bg-[#EBEEF3] text-[#1F2532]": tabValue === "books",
          })}
          size={"sm"}
          onClick={() => onTabChange("books")}
        >
          Books
        </Button>
        <Button
          className={cn("bg-transparent text-[#5C769B] rounded-sm hover:text-white", {
            "bg-[#EBEEF3] text-[#1F2532]": tabValue === "podcasts",
          })}
          size={"sm"}
          onClick={() => onTabChange("podcasts")}
        >
          Podcasts
        </Button>
      </div>
      <div>
        {/* <Input value={searchValue} prefix={<SearchIcon className="h-4 w-4"/>} placeholder="Search" onChange={handleInputChange}/> */}
        <Input value={searchValue} placeholder="Search..." onChange={handleInputChange}/>
      </div>
    </div>
  );
};

export default TopBannerHeaderTools;

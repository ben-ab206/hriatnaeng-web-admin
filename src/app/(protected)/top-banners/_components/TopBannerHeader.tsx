import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TopBannerHeaderProps {
  onClickEditNew: () => void;
}   

const TopBannerHeader = ({ onClickEditNew }: TopBannerHeaderProps) => {
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const handleClick = () => {
    setIsButtonVisible(false); // Hide the button
    onClickEditNew(); // Call the provided function
  };

  return (
    <div className="flex flex-row justify-between items-center">
      <span className="text-[24px] font-semibold">Top Banners</span>

      <div>
        {isButtonVisible && (
          <Button 
            size="lg"
            className="bg-[#447AED] text-[#F5F5F5] font-semibold rounded-sm"
            onClick={handleClick}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default TopBannerHeader;

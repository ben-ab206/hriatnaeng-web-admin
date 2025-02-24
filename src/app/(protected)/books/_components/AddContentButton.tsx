interface AddSeasonButtonProps {
    onActionNewContent: () => void;
}

const AddContentButton = ({ onActionNewContent }: AddSeasonButtonProps) => {
  return (
    <>
      <button
        className="w-full py-2 border-dotted rounded-[5px] border-gray-100 border-2 bg-gray-100"
        onClick={onActionNewContent}
      >
        Add new season
      </button>
    </>
  );
};

export default AddContentButton;

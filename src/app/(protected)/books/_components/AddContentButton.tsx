interface AddSeasonButtonProps {
  onActionNewContent: () => void;
  text: string;
}

const AddContentButton = ({ text, onActionNewContent }: AddSeasonButtonProps) => {
  return (
    <>
      <button
        className="w-full py-2 border text-gray-600 border-dotted rounded-[5px] border-gray-200 border-2 bg-gray-50"
        onClick={onActionNewContent}
      >
        {text}
      </button>
    </>
  );
};

export default AddContentButton;

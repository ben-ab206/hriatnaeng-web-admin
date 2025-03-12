interface AddButtonCollectionsProps {
    onAddNew: () => void;
  }
  
  const AddButtonCollections = ({ onAddNew }: AddButtonCollectionsProps) => {
    return (
      <button
        type="button"
        className="bg-[#F5F7FA] w-full py-3 border-dotted rounded-[5px] border-[#7C94B4] border-gray-600 border-2 hover:shadow-md"
        onClick={onAddNew}
      >
        Add new collections
      </button>
    );
  };
  
  export default AddButtonCollections;
  
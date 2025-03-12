interface AddButtonBooksProps {
  onActionNew: () => void;
}

const AddButtonBooks = ({ onActionNew }: AddButtonBooksProps) => {
  return (
    <button
      type="button"
      className="bg-[#F5F7FA] w-full py-3 border-dotted rounded-[5px] border-[#7C94B4] border-2 hover:shadow-md"
      onClick={onActionNew}
    >
      Add new books
    </button>
  );
};

export default AddButtonBooks;

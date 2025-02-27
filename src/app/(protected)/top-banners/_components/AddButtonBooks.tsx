interface AddButtonBooksProps {
  onActionNew: () => void;
}

const AddButtonBooks = ({ onActionNew }: AddButtonBooksProps) => {
  return (
    <button
      type="button"
      className="w-full py-3 border-dotted rounded-[5px] border-gray-600 border-2 hover:shadow-md"
      onClick={onActionNew}
    >
      Add new books
    </button>
  );
};

export default AddButtonBooks;

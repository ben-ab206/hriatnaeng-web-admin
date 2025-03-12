interface AddButtonMoviesShowsProps {
  onActionNew: () => void;
}

const AddButtonNewBooks = ({ onActionNew }: AddButtonMoviesShowsProps) => {
  return (
    <button
      type="button"
      className="!bg-primary w-full py-3 border-dotted rounded-[5px] border-2 hover:shadow-md"
      onClick={onActionNew}
    >
      Add new book
    </button>
  );
};

export default AddButtonNewBooks;

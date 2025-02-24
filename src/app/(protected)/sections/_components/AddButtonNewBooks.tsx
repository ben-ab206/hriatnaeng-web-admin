interface AddButtonMoviesShowsProps {
    onActionNew: () => void
}

const AddButtonNewBooks = ({
    onActionNew
}: AddButtonMoviesShowsProps) => {
    return (
        <button
            type="button"
            className="w-full py-3 border-dotted rounded-[5px] border-gray-600 border-2 hover:shadow-md"
            onClick={onActionNew}
        >
            Add new book
        </button>
    )
}

export default AddButtonNewBooks
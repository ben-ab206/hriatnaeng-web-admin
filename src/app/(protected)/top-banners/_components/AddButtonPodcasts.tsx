interface AddButtonPodcastsProps {
  onAddNew: () => void;
}

const AddButtonPodcasts = ({ onAddNew }: AddButtonPodcastsProps) => {
  return (
    <button
      type="button"
      className="w-full py-3 border-dotted rounded-[5px] border-gray-600 border-2 hover:shadow-md"
      onClick={onAddNew}
    >
      Add new podcasts
    </button>
  );
};

export default AddButtonPodcasts;

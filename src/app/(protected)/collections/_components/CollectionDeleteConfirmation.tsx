import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import { api } from "@/trpc/client";

interface CollectionDeleteConfirmationProps {
  onClose: () => void;
  dialogOpen: boolean;
  collection_id: number;
  onRefresh: () => void;
}

const CollectionDeleteConfirmation = ({
  onClose,
  dialogOpen,
  collection_id,
  onRefresh,
}: CollectionDeleteConfirmationProps) => {
  const { mutate: removeCollection, isPending } =
    api.collections.deleteCollection.useMutation({
      onSuccess: () => {
        onRefresh();
        showSuccessToast("Collection successfuly deleted");
        onClose();
      },
      onError: (error) => {
        showErrorToast(error.message);
        onClose();
      },
    });
  const onDelete = () => {
    removeCollection(collection_id);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={onClose}>
      <h5 className="mb-4">Delete</h5>
      <p>
        Are you sure you want to delete this collection? All record related to
        this collection will be deleted as well. This action cannot be undone.
      </p>
      <div className="text-right mt-6">
        <Button className="ltr:mr-2 rtl:ml-2" onClick={onClose}>
          Cancel
        </Button>
        <Button color="red-500" loading={isPending} onClick={onDelete}>
          Continue
        </Button>
      </div>
    </Dialog>
  );
};

export default CollectionDeleteConfirmation;

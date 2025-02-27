import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import { api } from "@/trpc/client";
import { Loader2Icon } from "lucide-react";

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
    <AlertDialog open={dialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure to delete this collection?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this collection? All record related
            to this collection will be deleted as well. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 text-white"
            onClick={onDelete}
          >
            <div className="flex flex-row items-center text-white">
              {isPending && <Loader2Icon className="animate-spin" />}
              <span>Continue</span>
            </div>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CollectionDeleteConfirmation;

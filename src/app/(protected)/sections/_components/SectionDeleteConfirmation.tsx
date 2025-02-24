import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showSuccessToast } from "@/lib/utils";
import { api } from "@/trpc/client";

interface SectionDeleteConfirmationProps {
  onClose: () => void;
  dialogOpen: boolean;
  section_id: number;
  onRefresh: () => void;
}

const SectionDeleteConfirmation = ({
  onClose,
  dialogOpen,
  section_id,
  onRefresh,
}: SectionDeleteConfirmationProps) => {
  const { mutate: updateSection } = api.sections.updateSection.useMutation({
    onSuccess: (data) => {
      onRefresh();

      if (data) {
        showSuccessToast("Section successfuly deleted");
      }
      onClose();
    },
    onError: () => {
      onClose();
      onRefresh();
    },
  });

  const onDelete = async () => {
    await updateSection({
      id: +section_id,
      status: "inactive",
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
            <DialogTitle>Delete</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete this section? All record related to
          this section will be deleted as well. This action cannot be undone.
        </p>
        <div className="text-right mt-6">
          <Button className="ltr:mr-2 rtl:ml-2" onClick={onClose}>
            Cancel
          </Button>
          <Button color="red-500" onClick={onDelete}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SectionDeleteConfirmation;

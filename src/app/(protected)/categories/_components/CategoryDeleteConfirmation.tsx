import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { api } from "@/trpc/client";
import {  toast } from "@/hooks/use-toast";
interface CategoryDeleteConfirmationProps {
  onClose: () => void;
  onRefresh: () => void;
  isOpen: boolean;
  category_id: number;
}

const CategoryDeleteConfirmation = ({
  onClose,
  isOpen,
  category_id,
  onRefresh,
}: CategoryDeleteConfirmationProps) => {
  // const { toast } = useToast();


  const { mutateAsync: removeCategory, isPending } =
    api.categories.deleteCategory.useMutation({
      onSuccess: async (result) => {
        onRefresh();
        if (result) {
          toast({
            title: "Success",
            description: "Category successfully deleted.",
            duration: 1000,
            variant: "success",
          });
          onClose();
        } else {
          toast({
            title: "Failed",
            description: "Category could not be deleted.",
            duration: 1000,
            variant: "destructive",
          });
        }
      },
      onError: () => {
        onClose();
      },
    });

  const onDelete = async () => {
    await removeCategory({
      id: category_id,
    });
  };

  return (
<>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogTitle>Delete</DialogTitle>
          <p>Are you sure you want to delete this category? This action cannot be undone.</p>
          <div className="text-right mt-6">
            <Button
              className="mr-2 !bg-[#7C94B4] !text-[#F5F7FA] font-semibold rounded-sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              loading={isPending}
              className="!bg-[#447AED] !text-[#F5F5F5] font-semibold rounded-sm"
              onClick={onDelete}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

     
    </>
  );
};

export default CategoryDeleteConfirmation;
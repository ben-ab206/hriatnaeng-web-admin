"use client";
import { useEffect, useState } from "react";
import CategoriesHeader from "./_components/CategoryHeader";
import CategoriesHeaderTools from "./_components/CategoryHeaderTools";
import { Dialog,DialogContent,DialogTitle  } from "@/components/ui/dialog";
import CategoryForm from "./CategoryForm";
import { NewCategoryType } from "./StaticTypes";
import { Category } from "@/@types/category";
import { api } from "@/trpc/client";
import CategoryTable from "./CategoryTable";
import { PagingData } from "@/@types/paging-data";
import { toast } from "@/hooks/use-toast";
import CategoryDeleteConfirmation from "./_components/CategoryDeleteConfirmation";

const CategoryView = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
    const [pagingData, setPagingData] = useState<PagingData>({
        total: 0,
        page: 1,
        size: 10,
    });

    const { data: user } = api.users.getMe.useQuery(); 

    const {
        data: categories,
        isLoading,
        isFetching,
        refetch,
    } = api.categories.getCategories.useQuery({
        query: searchQuery,
        page: pagingData.page,
        size: pagingData.size,
    });

    const { mutateAsync: createCategory, isPending } =
        api.categories.createCategory.useMutation({
            onSuccess: async () => {
            toast({
                title: "Success",
                description: "Category successfully created.",
                duration: 1000,
                variant: "success",
                });
            refetch();
            onDialogClose();
            },
            onError: (error) => {
                toast({
                    title: "Faild",
                    description: error.message,
                    duration: 1000,
                    variant: "destructive",
                  });
            },
        });

    const { mutateAsync: uploadImage, isPending: isImageUploadPending } = api.categories.uploadCategoryImage.useMutation();

    const { mutateAsync: updateCategory, isPending: isUpdatePending } =
        api.categories.updateCategory.useMutation({
            onSuccess: async () => {
                refetch();
                onDialogClose();
                toast({
                    title: "Success",
                    description: "Category successfully updated.",
                    duration: 1000,
                    variant: "success",
                    });
            },
            onError: (error) => {
                toast({
                    title: "Faild",
                    description: error.message,
                    duration: 1000,
                    variant: "destructive",
                  });
            },
        });

    const onDialogClose = () => {
        setShowDialog(false);
        setSelectedCategory(undefined);
        setShowDeleteDialog(false)
    };
    const onPageChange = (v: number) => {
        setPagingData((prev) => ({
            ...prev,
            page: v,
        }))
    }   

    const onSelectChange = (v: number) => {
        setPagingData((prev) => ({
            ...prev,
            size: v,
        }))
    }   

    const onEdit =  (v: Category) => {
        setSelectedCategory(v);
        setShowDialog(true);
    }

    const onRefresh = () => {
        onDialogClose()
        refetch()
    }

    const onDelete =  (v: Category) => {
        setSelectedCategory(v);
        setShowDeleteDialog(true);
    }
    
    useEffect(() => {
        if (categories?.total !== undefined) {
          setPagingData((prev) => ({
            ...prev,
            total: categories.total ,
          }));
        }
    }, [categories?.total]);

    useEffect(() => {
        refetch();
      }, [pagingData.size, refetch]);

    const handleSave = async (values: NewCategoryType) => {
        let imageUrl: string | undefined;

        if(values.filePath && values.image) {
            const filePath = values.filePath
            try {
                const { url } = await uploadImage({
                    filePath,
                    file: values.image.split(",")[1], // Extract base64 data
                });
    
                imageUrl = url;
            } catch (error) {
                console.error(error);
            }
        } else if (values.id && !values.image) {
            imageUrl = values.image
        }

        try {
          // Update existing category
          if (values.id && values.id !== 0) {
            await updateCategory({
              id: values.id,
              name: values.name,
              description: values.description ?? "",
              parent_id: typeof values.parent_id === "number" ? values.parent_id : null,
              updated_by: user?.id ?? 0,
              image_path: imageUrl ?? null, 
            });
          } 
          // Create new category
          else {
            await createCategory({
              name: values.name,
              description: values.description ?? "",
              parent_id: typeof values.parent_id === "number" ? values.parent_id : null,
              created_by: user?.id ?? 0,
              image_path: imageUrl,
            });
          }
      
          toast({
            title: "Success",
            description: `Category successfully ${values.id ? "updated" : "created"}.`,
            variant: "success",
          });
          onDialogClose();
        } catch (error) {
          console.error("Error saving category:", error);
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to save category",
            variant: "destructive",
          });
        }

      };

    return (
        <div className="flex flex-col">
            <CategoriesHeader onClickAddNew={() => setShowDialog(true)}/>
            <CategoriesHeaderTools
                searchValue={searchQuery}
                onChangeSearchValue={(v) => setSearchQuery(v)}
            />
            <CategoryTable
                data={categories?.data ?? []}
                loading={isLoading || isFetching}
                pagingData={pagingData}
                onPageChange={onPageChange}
                onSelectChange={onSelectChange}
                onEdit={onEdit}
                onDelete={onDelete}
            />
            {selectedCategory && (
                <CategoryDeleteConfirmation
                    category_id={selectedCategory.id}
                    isOpen={showDeleteDialog}
                    onRefresh={onRefresh}
                    onClose={onDialogClose}
                />
            )}
            <Dialog
                open={showDialog}
                onOpenChange={onDialogClose}
            >
               <DialogContent>
                    <DialogTitle>
                        { selectedCategory ? "Edit Category" : " New Category" }
                    </DialogTitle>
                    <CategoryForm
                        isSubmitting={isPending || isUpdatePending || isImageUploadPending}
                        initialData={
                            selectedCategory ? ({
                                id: selectedCategory.id,
                                name: selectedCategory.name ?? "",
                                parent_id: selectedCategory.parent_id ?? undefined,
                                description: selectedCategory.description,
                                image: selectedCategory.image_path || undefined,
                            }) : undefined
                        }
                        onClose={onDialogClose}
                        onClickSave={handleSave}
                    />
               </DialogContent> 
            </Dialog>
        </div>
    );
}
export default CategoryView

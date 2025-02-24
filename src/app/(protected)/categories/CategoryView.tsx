"use client";
import { useEffect, useState } from "react";
import CategoriesHeader from "./components/CategoryHeader";
import CategoriesHeaderTools from "./components/CategoryHeaderTools";
import { Dialog,DialogContent,DialogTitle  } from "@/components/ui/dialog";
import CategoryForm from "./CategoryForm";
import { NewCategoryType } from "./StaticTypes";
import { Category } from "@/@types/category";
import { api } from "@/trpc/client";
import CategoryTable from "./CategoryTable";
import { PagingData } from "@/@types/paging-data";
// import { showErrorToast, showSuccessToast } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import CategoryDeleteConfirmation from "./components/CategoryDeleteConfirmation";
import { generateTimestamp } from "@/serives/common";

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
    const { mutateAsync: uploadImage } = api.categories.uploadCategoryImage.useMutation();
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
        refetch(); // Re-fetch data when the page size changes
      }, [pagingData.size, refetch]);

    
    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
    };
    const handleSave = async (values: NewCategoryType) => {
        console.log(values)
        let imageUrl: string | undefined;
      
        if (values.image && typeof values.image === "object" && "file" in values.image) {
            const file = values.image.file as File;
            const fileExt = file.name.split('.').pop();
            const filePath = `${generateTimestamp()}.${fileExt}`;
            
            try {
                const base64 = await convertFileToBase64(file);
                const { url } = await uploadImage({
                    filePath,
                    file: base64.split(",")[1],
                });
                
                imageUrl = url;
                
                toast({
                    title: "Success",
                    description: "Image uploaded successfully",
                    variant: "success",
                });
            } catch (error ) {
                // ... error handling ...
                console.info(error)
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
              image_path: imageUrl, 
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
                loading={isLoading}
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
                        isSubmitting={isPending || isUpdatePending}
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

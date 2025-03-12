"use client";
import { useEffect, useState } from "react";
import CategoriesHeader from "./_components/PeopleHeader";
import CategoriesHeaderTools from "./_components/PeopleHeaderTools";
import { Dialog,DialogContent,DialogTitle  } from "@/components/ui/dialog";
import PeopleForm from "./PeopleForm";
import { NewPeopleType } from "./StaticTypes";
import { People } from "@/@types/people";
import { api } from "@/trpc/client";
import PeopleTable from "./PeopleTable";
import { PagingData } from "@/@types/paging-data";
import { toast } from "@/hooks/use-toast";
import PeopleDeleteConfirmation from "./_components/PeopleDeleteConfirmation";


const PeopleView = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPeople, setSelectedPeople] = useState<People | undefined>();
    const [pagingData, setPagingData] = useState<PagingData>({
        total: 0,
        page: 1,
        size: 10,
    });

    const { data: user } = api.users.getMe.useQuery(); 
    const { data: roles, isLoading: isRolesLoading } = api.people.getPeopleRole.useQuery();

    const {
        data: people,
        isLoading,
        isFetching,
        refetch,
    } = api.people.getPeople.useQuery({
        query: searchQuery,
        page: pagingData.page,
        size: pagingData.size,
    });

    const { mutateAsync: createPeople, isPending } =
        api.people.createPeople.useMutation({
            onSuccess: async () => {
            toast({
                title: "Success",
                description: "People successfully created.",
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

    const { mutateAsync: uploadImage, isPending: isImageUploadPending } = api.people.uploadPeopleImage.useMutation();

    const { mutateAsync: updatePeople, isPending: isUpdatePending } =
        api.people.updatePeople.useMutation({
            onSuccess: async () => {
                refetch();
                onDialogClose();
                toast({
                    title: "Success",
                    description: "People successfully updated.",
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
        setSelectedPeople(undefined);
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

    const onEdit =  (v: People) => {
        setSelectedPeople(v);
        setShowDialog(true);
    }

    const onRefresh = () => {
        onDialogClose()
        refetch()
    }

    const onDelete =  (v: People) => {
        setSelectedPeople(v);
        setShowDeleteDialog(true);
    }
    
    useEffect(() => {
        if (people?.total !== undefined) {
          setPagingData((prev) => ({
            ...prev,
            total: people.total ,
          }));
        }
    }, [people?.total]);

    useEffect(() => {
        refetch();
      }, [pagingData.size, refetch]);

    const handleSave = async (values: NewPeopleType) => {
        let imageUrl: string | undefined;

        if(values.filePath && values.image_path) {
            const filePath = values.filePath
            try {
                const { url } = await uploadImage({
                    filePath,
                    file: values.image_path.split(",")[1], // Extract base64 data
                });
    
                imageUrl = url;
            } catch (error) {
                console.error(error);
            }
        } else if (values.id) {
            imageUrl = values.image_path
        }

        try {
          // Update existing category
          if (values.id && values.id !== 0) {
            await updatePeople({
              id: values.id,
              name: values.name,
              people_role_id: typeof values.people_role_id === "number" ? values.people_role_id : null,
              date_of_birth: values.date_of_birth ?? null,
              date_of_death: values.date_of_death ?? null,
              nationality: values.nationality ?? "",
              biography: values.biography ?? "",
              website: values.website ?? "",
              email: values.email ?? "",
              updated_by: user?.id ?? 0,
              image_path: imageUrl ?? null, 
            });
          } 
          // Create new category
          else {
            await createPeople({
              name: values.name,
              people_role_id: typeof values.people_role_id === "number" ? values.people_role_id : null,
              date_of_birth: values.date_of_birth ?? null,
              date_of_death: values.date_of_death ?? null,
              nationality: values.nationality ?? "",
              biography: values.biography ?? "",
              website: values.website ?? "",
              email: values.email ?? "",
              created_by: user?.id ?? 0,
              image_path: imageUrl,
            });
          }
      
          toast({
            title: "Success",
            description: `People successfully ${values.id ? "updated" : "created"}.`,
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
        <div className="space-y-5">
            <CategoriesHeader onClickAddNew={() => setShowDialog(true)}/>
            <CategoriesHeaderTools
                searchValue={searchQuery}
                onChangeSearchValue={(v) => setSearchQuery(v)}
            />
            <PeopleTable
                data={people?.data ?? []}
                loading={isLoading || isFetching || isRolesLoading}
                roles={roles ?? []}
                pagingData={pagingData}
                onPageChange={onPageChange}
                onSelectChange={onSelectChange}
                onEdit={onEdit}
                onDelete={onDelete}
            />
            {selectedPeople && (
                <PeopleDeleteConfirmation
                    category_id={selectedPeople.id}
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
                        { selectedPeople ? "Edit People" : " New People" }
                    </DialogTitle>
                    <PeopleForm
                        isSubmitting={isPending || isUpdatePending || isImageUploadPending}
                        initialData={
                            selectedPeople ? ({
                                id: selectedPeople.id,
                                name: selectedPeople.name ?? "",
                                people_role_id: selectedPeople.people_role_id ?? undefined,
                                date_of_birth: selectedPeople.date_of_birth ?? undefined,
                                date_of_death: selectedPeople.date_of_death ?? undefined,
                                nationality: selectedPeople.nationality ?? "",
                                biography: selectedPeople.biography ?? "",
                                website: selectedPeople.website ?? "",
                                email: selectedPeople.email ?? "",
                                image_path: selectedPeople.image_path || undefined,
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
export default PeopleView

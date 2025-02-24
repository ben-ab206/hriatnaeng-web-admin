// // "use client";
// // import { useEffect, useState } from "react";
// // import {
// //   Form,
// //   FormControl,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from "@/components/ui/form";
// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { newCategorySchema } from "@/trpc/schema/category.schema";
// // import { z } from "zod";
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { api } from "@/trpc/client";
// // import { NewCategoryType } from "./StaticTypes";
// // import ImageUploader from "./components/ImageUploader";

// // interface CategoryFormProps {
// //   isSubmitting?: boolean;
// //   initialData?: NewCategoryType;
// //   onClickSave: (values: NewCategoryType) => void;
// //   onClose: () => void;
// // }

// // const CategoryForm = ({
// //   isSubmitting = false,
// //   initialData,
// //   onClickSave,
// //   onClose,
// // }: CategoryFormProps) => {
// //   const [image, setImage] = useState<string | null>(null);
// //   const [fileName, setFileName] = useState("");
// //   const [imageFile, setImageFile] = useState<File | null>(null);

// //   const form = useForm<z.infer<typeof newCategorySchema>>({
// //     resolver: zodResolver(newCategorySchema),
// //     defaultValues: initialData
// //       ? {
// //         ...initialData,
// //         image: imageFile || undefined,
// //       }
// //       : {
// //           name: "",
// //           description: "",
// //           parent_id: undefined,
// //           created_by: undefined,
// //           image: undefined,
// //         },
// //   });

// //   const { data: categoryList = [] } = api.categories.getAllCAtegories.useQuery();
// //   useEffect(() => {
// //     if (image && image.startsWith('data:image')) {
// //       fetch(image)
// //         .then(res => res.blob())
// //         .then(blob => {
// //           const file = new File([blob], fileName, { type: blob.type });
// //           setImageFile(file);
// //           form.setValue('image', file);
// //         });
// //     }else {
// //       setImageFile(null);
// //       form.setValue("image", undefined); // Ensure validation doesn't fail
// //     }

    
// //   }, [image, fileName, form]);
// //   useEffect(() => {
// //     if (initialData?.image && typeof initialData.image === "string") {
// //       setImage(initialData.image); 
// //     }
// //   }, [initialData]);
// //     const handleSubmit = async (values: z.infer<typeof newCategorySchema>) => {
// //       try {
// //         let formattedImage = null;
// //         console.log(values)
    
// //         if (imageFile) {
// //             formattedImage = {
// //               file: imageFile, // Store the original File object
// //               id: "1-img-0", // Custom ID
// //               img: URL.createObjectURL(imageFile), // Generate Blob URL for preview
// //               name: imageFile.name, // File name
// //             };
// //         }
    
// //         // Ensure image is set to null if removed
// //         if (!imageFile && !image) {
// //           formattedImage = null;
// //         }
    
// //         const submissionValues = {
// //           ...values,
// //           image: formattedImage, // Assign the structured image object OR null
// //         };
    
// //         await onClickSave(submissionValues);
// //       } catch (error) {
// //         console.error("Error submitting form:", error);
// //       }
// //     };
  
  
// //   return (
// //     <div>
// //       <Form {...form}>
// //         <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
// //           {/* Image upload component */}
// //           <FormField
// //             control={form.control}
// //             name="image"
// //             render={() => (
// //               <FormItem>
// //                 <FormControl>
// //                   <ImageUploader 
// //                     image={image} 
// //                     setImage={setImage} 
// //                     fileName={fileName} 
// //                     setFileName={setFileName} 
// //                   />
// //                 </FormControl>
// //                 <FormMessage />
// //               </FormItem>
// //             )}
// //           />

// //           <FormField
// //             control={form.control}
// //             name="name"
// //             render={({ field }) => (
// //               <FormItem>
// //                 <FormLabel>Name</FormLabel>
// //                 <FormControl>
// //                   <Input {...field} type="text" />
// //                 </FormControl>
// //                 <FormMessage />
// //               </FormItem>
// //             )}
// //           />

// //           <FormField
// //             control={form.control}
// //             name="parent_id"
// //             render={({ field }) => (
// //               <FormItem>
// //                 <FormLabel>Parent Category</FormLabel>
// //                 <Select
// //                   defaultValue={field.value ? field.value.toString() : undefined}
// //                   onValueChange={(value) => field.onChange(Number(value))}
// //                 >
// //                   <FormControl>
// //                     <SelectTrigger>
// //                       <SelectValue />
// //                     </SelectTrigger>
// //                   </FormControl>
// //                   <SelectContent className="bg-white">
// //                     {categoryList
// //                       .filter((c) => c.id !== initialData?.id)
// //                       .map((c, idx) => (
// //                         <SelectItem
// //                           value={c.id.toString()}
// //                           key={idx}
// //                           className="hover:bg-gray-100"
// //                         >
// //                           {c.name}
// //                         </SelectItem>
// //                       ))}
// //                   </SelectContent>
// //                 </Select>
// //                 <FormMessage />
// //               </FormItem>
// //             )}
// //           />

// //           <FormField
// //             control={form.control}
// //             name="description"
// //             render={({ field }) => (
// //               <FormItem>
// //                 <FormLabel>Description</FormLabel>
// //                 <FormControl>
// //                   <Input
// //                     {...field}
// //                     type="text"
// //                     value={field.value ?? ""} 
// //                   />
// //                 </FormControl>
// //                 <FormMessage />
// //               </FormItem>
// //             )}
// //           />

// //           <div className="text-right mt-6">
// //             <Button
// //               type="button"
// //               className="mr-2 !bg-[#7C94B4] !text-[#F5F7FA] font-semibold rounded-sm"
// //               onClick={onClose}
// //             >
// //               Cancel
// //             </Button>
// //             <Button 
// //               className="!bg-[#447AED] !text-[#F5F5F5] font-semibold rounded-sm"
// //               type="submit"
// //               loading={isSubmitting}
// //             >
// //               Save
// //             </Button>
// //           </div>
// //         </form>
// //       </Form>
// //     </div>
// //   );
// // };

// // export default CategoryForm;


// "use client";
// import { useEffect, useState } from "react";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { newCategorySchema } from "@/trpc/schema/category.schema";
// import { z } from "zod";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { api } from "@/trpc/client";
// import { NewCategoryType } from "./StaticTypes";
// import ImageUploader from "./components/ImageUploader";

// interface CategoryFormProps {
//   isSubmitting?: boolean;
//   initialData?: NewCategoryType;
//   onClickSave: (values: NewCategoryType) => void;
//   onClose: () => void;
// }

// const CategoryForm = ({
//   isSubmitting = false,
//   initialData,
//   onClickSave,
//   onClose,
// }: CategoryFormProps) => {
//   const [image, setImage] = useState<string | null>(null);
//   const [fileName, setFileName] = useState("");
//   const [imageFile, setImageFile] = useState<File | null>(null);

//   const form = useForm<z.infer<typeof newCategorySchema>>({
//     resolver: zodResolver(newCategorySchema),
//     defaultValues: initialData
//       ?{
//         ...initialData,
//         image: imageFile || undefined,
//       }
//       : {
//           name: "",
//           description: "",
//           parent_id: undefined,
//           created_by: undefined,
//           image: undefined,
//         },
//   });

//   const { data: categoryList = [] } = api.categories.getAllCAtegories.useQuery();
//   useEffect(() => {
//     if (initialData?.image) {
//       setImage(initialData.image); 
//     }
//   }, [initialData]);

//   useEffect(() => {
//     if (image && image.startsWith("data:image")) {
//       fetch(image)
//         .then((res) => res.blob())
//         .then((blob) => {
//           const file = new File([blob], fileName, { type: blob.type });
//           setImageFile(file);
//           form.setValue("image", file);
//         });
//     } else {
//       setImageFile(null);
//       form.setValue("image", null); 
//     }
//   }, [image, fileName, form]);
//   console.log()
  
//   const handleSubmit = async (values: z.infer<typeof newCategorySchema>) => {
//     try {
//       let formattedImage = null;
//       console.log(values)
  
//       if (imageFile) {
//         formattedImage = {
//           file: imageFile,
//           id: "1-img-0",
//           img: URL.createObjectURL(imageFile),
//           name: imageFile.name,
//         };
//       }
  
//       // Ensure `image` is null if removed
//       if (!imageFile) {
//         formattedImage = image;
//       }
  
//       const submissionValues = {
//         ...values,
//         image: formattedImage, // Ensure image is null if removed
//       };
  
//       await onClickSave(submissionValues);
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//   };
  
//   return (
//     <div>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
//           {/* Image upload component */}
//           <FormField
//             control={form.control}
//             name="image"
//             render={() => (
//               <FormItem>
//                 <FormControl>
//                   <ImageUploader 
//                     image={image} 
//                     setImage={setImage} 
//                     fileName={fileName} 
//                     setFileName={setFileName} 
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Name</FormLabel>
//                 <FormControl>
//                   <Input {...field} type="text" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="parent_id"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Parent Category</FormLabel>
//                 <Select
//                   defaultValue={field.value ? field.value.toString() : undefined}
//                   onValueChange={(value) => field.onChange(Number(value))}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent className="bg-white">
//                     {categoryList
//                       .filter((c) => c.id !== initialData?.id)
//                       .map((c, idx) => (
//                         <SelectItem
//                           value={c.id.toString()}
//                           key={idx}
//                           className="hover:bg-gray-100"
//                         >
//                           {c.name}
//                         </SelectItem>
//                       ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="description"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Description</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     type="text"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <div className="text-right mt-6">
//             <Button
//               type="button"
//               className="mr-2 !bg-[#7C94B4] !text-[#F5F7FA] font-semibold rounded-sm"
//               onClick={onClose}
//             >
//               Cancel
//             </Button>
//             <Button 
//               className="!bg-[#447AED] !text-[#F5F5F5] font-semibold rounded-sm"
//               type="submit"
//               loading={isSubmitting}
//             >
//               Save
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default CategoryForm;

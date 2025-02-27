"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
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
import { Eye, Trash2, Upload } from "lucide-react";
import { ImageFile } from "@/@types/image-file";

interface ImageUploaderProps {
  images?: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  containerClassName?: string;
  imageClassName?: string;
  maxWidth?: number;
  maxHeight?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images = [],
  onChange,
  maxFileSize = 5000000,
  allowedFileTypes = ["image/jpeg", "image/png"],
  containerClassName = "h-[100px] w-[100px] rounded-full",
  imageClassName = "max-h-[100px] max-w-full rounded-full",
  maxWidth,
  maxHeight,
}) => {
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImageId = (): string => {
    if (images.length === 0) return "1-img-0";

    const lastId = images[images.length - 1].id;
    const idParts = lastId.split("-");
    const newIdNumber = parseInt(idParts[idParts.length - 1]) + 1;
    idParts.pop();
    return [...idParts, newIdNumber.toString()].join("-");
  };

  const validateFile = (file: File): string | null => {
    if (!allowedFileTypes.includes(file.type)) {
      return `Please upload ${allowedFileTypes
        .map((type) => type.split("/")[1])
        .join(" or ")} files only.`;
    }

    if (file.size > maxFileSize) {
      return `File size exceeds ${maxFileSize / 1000000}MB.`;
    }

    return null;
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setError(null);

    if (files && files.length > 0) {
      const file = files[0];
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        return;
      }

      const newImage: ImageFile = {
        id: generateImageId(),
        file,
        name: file.name,
        url: URL.createObjectURL(file),
      };

      onChange([...images, newImage]);
    }

    event.target.value = "";
  };

  const handleDeleteImage = () => {
    if (selectedImage) {
      const updatedImages = images.filter((img) => img.id !== selectedImage.id);
      onChange(updatedImages);
      setDeleteDialogOpen(false);
      setSelectedImage(null);
    }
  };

  const handleViewImage = (image: ImageFile) => {
    setSelectedImage(image);
    setViewDialogOpen(true);
  };

  const handleDeleteConfirmation = (image: ImageFile) => {
    setSelectedImage(image);
    setDeleteDialogOpen(true);
  };

  return (
    <div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

      {images.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {images.map((image) => (
            <Card
              key={image.id}
              className={`group relative overflow-hidden ${containerClassName}`}
            >
              <CardContent className="p-0 h-full">
                <img
                  src={image.url}
                  alt={image.name}
                  className={`w-full h-full object-contain ${imageClassName}`}
                />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => handleViewImage(image)}
                    className="text-white hover:text-white hover:bg-black/20"
                  >
                    <Eye className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => handleDeleteConfirmation(image)}
                    className="text-white hover:text-white hover:bg-black/20"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 ${containerClassName}`}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
          </div>
          <input
            id="file-upload"
            type="file"
            accept={allowedFileTypes.join(",")}
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      )}

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedImage?.name}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="overflow-hidden rounded-md">
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="w-full object-contain"
                style={{ maxWidth, maxHeight }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteImage}
              className="bg-red-500 hover:bg-red-600"
              type="button"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ImageUploader;

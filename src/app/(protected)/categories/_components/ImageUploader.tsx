"use client";
import { useState } from "react";
import { Eye, Trash } from "lucide-react";
import Image from 'next/image'

interface ImageUploaderProps {
  image: string | null;
  setImage: (image: string | null) => void;
  fileName: string;
  setFileName: (name: string) => void;
}

const ImageUploader = ({ image, setImage, setFileName }: ImageUploaderProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); 
    event.stopPropagation();
    setImage(null);
    setFileName("");

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="flex flex-col text-center">
      <div className="flex justify-center">
        <div className="w-32 h-32 relative"> {/* Changed from label to div */}
          {image ? (
            <div className="relative w-full h-full">
              <Image
                src={image}
                width={128}
                height={128} 
                alt="Preview"
                className="rounded-xl object-cover w-full h-full"
                unoptimized
              />

              {/* Hover effect with icons */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                <button
                type="button"
                  onClick={() => setModalOpen(true)}
                  className="text-white hover:text-white hover:bg-black/20"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={removeImage}
                  className="text-white hover:text-white hover:bg-black/20"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <label className="w-full h-full border-2 border-dashed border-gray-400 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-600">
              <Image
                src="/icons/image-upload-icon.png"
                width={30}
                height={30} 
                alt="upload Icon"
              />
              <span className="text-gray-500 mt-2">Upload</span>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange} 
              />
            </label>
          )}
        </div>
      </div>

      {/* Modal for Image Preview */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 p-5 rounded-lg max-w-lg w-full relative">
            <div className="flex justify-between items-center text-white">
              <span className="truncate"></span>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✖
              </button>
            </div>
            <Image
              src={image || ''}
              alt="Full Preview"
              width={500} // Set width dynamically
              height={0} // Height will auto-adjust
              className="mt-3 rounded-xl object-contain max-w-full max-h-[80vh]"
              unoptimized
            />

          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
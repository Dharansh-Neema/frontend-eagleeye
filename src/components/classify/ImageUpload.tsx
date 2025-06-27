import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, FileImage, X } from "lucide-react";

interface ImageUploadProps {
  projectData: any;
  onNext: (images: File[]) => void;
  onBack: () => void;
}

const ImageUpload = ({ projectData, onNext, onBack }: ImageUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.includes('image') && 
      (file.type.includes('jpeg') || file.type.includes('jpg') || file.type.includes('png'))
    );
    
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    onNext(uploadedFiles);
  };

  return (
    <div>
      <CardHeader className="px-0 pb-6">
        <CardTitle className="text-2xl text-slate-800">Upload Images</CardTitle>
        <p className="text-slate-600">
          Drag and drop or select inspection images to upload (PNG, JPEG, JPG)
        </p>
      </CardHeader>

      <div className="space-y-6">
        {/* Project Summary */}
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-sm text-slate-600 space-y-1">
                <div><span className="font-medium">Organization:</span> {projectData?.organisationName}</div>
                <div><span className="font-medium">Project:</span> {projectData?.projectName}</div>
                <div><span className="font-medium">Station:</span> {projectData?.inspectionStation}</div>
                <div><span className="font-medium">Camera:</span> {projectData?.cameraName}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Area */}
        <Card className={`border-2 border-dashed transition-all ${
          isDragging ? 'border-blue-400 bg-blue-50' : 'border-slate-300'
        }`}>
          <CardContent 
            className="p-12 text-center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              Drag and drop images here
            </h3>
            <p className="text-slate-600 mb-4">
              or click to select files
            </p>
            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button asChild variant="outline" className="mx-auto">
              <label htmlFor="file-upload" className="cursor-pointer">
                Select Images
              </label>
            </Button>
            <p className="text-sm text-slate-500 mt-4">
              Supported formats: PNG, JPEG, JPG
            </p>
          </CardContent>
        </Card>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Uploaded Images ({uploadedFiles.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={file.name} 
                        className="object-contain h-full w-full" 
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    <p className="text-xs text-slate-600 mt-1 truncate">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="pt-6 border-t flex justify-between">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Templates
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            disabled={uploadedFiles.length === 0}
          >
            Continue to Categorization
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;

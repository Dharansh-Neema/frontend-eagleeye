import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, FileImage, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exifFileService } from "@/lib/exifFileService";

interface ImageCategorizationProps {
  images: File[];
  templates: any[];
  projectData: any;
  onBack: () => void;
}

const ImageCategorization = ({ images, templates, projectData, onBack }: ImageCategorizationProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageData, setImageData] = useState<{[key: number]: any}>({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const currentImage = images[currentImageIndex];
  const currentData = imageData[currentImageIndex] || {
    title: '',
    description: '',
    observations: {}
  };

  const updateCurrentImageData = (data: any) => {
    setImageData(prev => ({
      ...prev,
      [currentImageIndex]: { ...currentData, ...data }
    }));
  };

  const updateObservation = (templateId: string, value: any) => {
    updateCurrentImageData({
      observations: {
        ...currentData.observations,
        [templateId]: value
      }
    });
  };

  const nextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const previousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const saveAndFinish = async () => {
    setIsSaving(true);
    try {
      console.log('ImageCategorization - projectData:', projectData);
      console.log('ImageCategorization - projectData type check:', {
        organisationName: typeof projectData.organisationName,
        projectName: typeof projectData.projectName,
        inspectionStation: typeof projectData.inspectionStation,
        cameraName: typeof projectData.cameraName
      });
      
      await exifFileService.saveImagesWithEmbeddedMetadata(
        images,
        imageData,
        templates,
        projectData
      );
      
      toast({
        title: "Images Processed Successfully",
        description: `${images.length} images have been categorized and saved with embedded metadata.`,
      });
    } catch (error) {
      console.error('Error saving images:', error);
      toast({
        title: "Error Saving Images",
        description: "There was an error saving the images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getObservationInput = (template: any) => {
    const value = currentData.observations[template.id] || '';
    
    if (template.type === 'boolean') {
      return (
        <select 
          value={value}
          onChange={(e) => updateObservation(template.id, e.target.value === 'true')}
          className="w-full p-2 border border-slate-300 rounded-md"
        >
          <option value="">Select...</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      );
    }
    
    if (template.type === 'numeric') {
      return (
        <Input
          type="number"
          value={value}
          onChange={(e) => updateObservation(template.id, parseFloat(e.target.value) || 0)}
          placeholder={template.defaultValue?.toString() || '0'}
        />
      );
    }
    
    return (
      <Input
        value={value}
        onChange={(e) => updateObservation(template.id, e.target.value)}
        placeholder={template.defaultValue?.toString() || 'Enter value...'}
      />
    );
  };

  return (
    <div>
      <CardHeader className="px-0 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-slate-800">Image Categorization</CardTitle>
            <p className="text-slate-600">
              Add metadata and observations for each image
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">Progress</div>
            <div className="text-lg font-semibold text-slate-800">
              {currentImageIndex + 1} of {images.length}
            </div>
          </div>
        </div>
      </CardHeader>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Preview */}
        <div>
          <Card className="border-2 border-slate-200">
            <CardContent className="p-6">
              <div className="aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden mb-4">
                {currentImage && (
                  <img 
                    src={URL.createObjectURL(currentImage)} 
                    alt={currentImage.name} 
                    className="object-contain h-full w-full"
                  />
                )}
                {!currentImage && (
                  <FileImage className="w-16 h-16 text-slate-400" />
                )}
              </div>
              {currentImage && (
                <div className="text-center">
                  <h3 className="font-medium text-slate-800">{currentImage.name}</h3>
                  <p className="text-sm text-slate-500">
                    {(currentImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={previousImage}
              disabled={currentImageIndex === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button 
              variant="outline" 
              onClick={nextImage}
              disabled={currentImageIndex === images.length - 1}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Metadata Form */}
        <div className="space-y-6">
          {/* Project Info (Read-only) */}
          <Card className="bg-slate-50">
            <CardContent className="p-4">
              <div className="text-sm text-slate-600 space-y-1">
                <div><span className="font-medium">Organization:</span> {projectData.organisationName}</div>
                <div><span className="font-medium">Project:</span> {projectData.projectName}</div>
                <div><span className="font-medium">Station:</span> {projectData.inspectionStation}</div>
                <div><span className="font-medium">Camera:</span> {projectData.cameraName}</div>
              </div>
            </CardContent>
          </Card>

          {/* Optional Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm text-slate-600">
                Title (Optional)
              </Label>
              <Input
                id="title"
                value={currentData.title}
                onChange={(e) => updateCurrentImageData({ title: e.target.value })}
                placeholder="e.g., Thermal Image - Pipe Joint Inspection"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm text-slate-600">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={currentData.description}
                onChange={(e) => updateCurrentImageData({ description: e.target.value })}
                placeholder="Additional notes about this image..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Observations */}
          {templates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id}>
                    <Label className="text-sm text-slate-600">
                      {template.name} ({template.type})
                    </Label>
                    <div className="mt-1">
                      {getObservationInput(template)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="pt-8 border-t flex justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Upload
        </Button>
        <Button 
          onClick={saveAndFinish}
          className="bg-green-600 hover:bg-green-700 text-white px-8 flex items-center gap-2"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Save & Finish
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ImageCategorization;

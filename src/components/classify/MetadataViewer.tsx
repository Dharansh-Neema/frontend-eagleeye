import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileImage, Upload, Eye, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exifFileService } from "@/lib/exifFileService";
import { ProjectMetadata } from "@/lib/exifMetadataManager";

const MetadataViewer = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [metadataList, setMetadataList] = useState<ProjectMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMetadata, setSelectedMetadata] = useState<ProjectMetadata | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(files);
    setMetadataList([]);
    setSelectedMetadata(null);
  };

  const readMetadata = async () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No Images Selected",
        description: "Please select images to read metadata from.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log(`Reading metadata from ${selectedImages.length} images...`);
      const metadata = await exifFileService.readMetadataFromImages(selectedImages);
      
      console.log(`Metadata extraction results:`, {
        totalImages: selectedImages.length,
        metadataFound: metadata.length,
        metadata: metadata
      });
      
      setMetadataList(metadata);
      
      if (metadata.length === 0) {
        toast({
          title: "No Metadata Found",
          description: `No embedded EXIF metadata was found in the selected ${selectedImages.length} image(s). Make sure the images have been processed through the classification system.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Metadata Loaded Successfully",
          description: `Found embedded metadata in ${metadata.length} of ${selectedImages.length} images.`,
        });
      }
    } catch (error) {
      console.error('Error reading metadata:', error);
      
      // Reset state on error to prevent broken UI
      setMetadataList([]);
      setSelectedMetadata(null);
      
      toast({
        title: "Error Reading Metadata",
        description: `Failed to read metadata: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the console for more details.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadMetadata = (metadata: ProjectMetadata) => {
    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metadata-${metadata.image_metadata.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">EXIF Metadata Viewer</h1>
        <p className="text-slate-600">
          Upload images with embedded metadata to view their classification data
        </p>
      </div>

      {/* Information Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 text-sm space-y-2">
          <p>
            • This system embeds metadata directly into image EXIF data (UserComment tag)
          </p>
          <p>
            • No separate JSON files are needed - all metadata travels with the image
          </p>
          <p>
            • Images must be processed through the classification tool first to have embedded metadata
          </p>
          <p>
            • Click "Read All Metadata" to extract and display metadata from all selected images
          </p>
          <p>
            • View structured metadata details and download raw JSON data for each image
          </p>
        </CardContent>
      </Card>

      {/* Image Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="images">Select Images with Embedded Metadata</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1"
              />
            </div>
            
            {selectedImages.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileImage className="w-5 h-5 text-slate-600" />
                  <span className="text-sm text-slate-600">
                    {selectedImages.length} image(s) selected
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={readMetadata} disabled={isLoading}>
                    {isLoading ? "Reading..." : "Read All Metadata"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metadata List */}
      {metadataList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Found Metadata ({metadataList.length} images)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {metadataList.map((metadata, index) => {
                // Safe access to metadata properties
                const imageMetadata = metadata?.image_metadata || {} as any;
                const project = metadata?.project || {} as any;
                const organization = metadata?.organization || 'Unknown';
                
                return (
                  <div
                    key={index}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelectedMetadata(metadata)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {imageMetadata.title || imageMetadata.original_filename || `Image ${index + 1}`}
                        </h3>
                        <p className="text-sm text-slate-600">
                          ID: {imageMetadata.id || 'N/A'} | 
                          Status: {imageMetadata.status || 'N/A'} | 
                          Created: {imageMetadata.created_date ? new Date(imageMetadata.created_date).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-sm text-slate-500">
                          Project: {project.name || 'N/A'} | Organization: {organization}
                        </p>
                      </div>
                      <div className="text-sm text-slate-400">
                        Click to view details
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Metadata View */}
      {selectedMetadata && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detailed Metadata View</CardTitle>
              <Button
                variant="outline"
                onClick={() => downloadMetadata(selectedMetadata)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download JSON
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Summary Section */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">Summary</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-700">Image:</span> {selectedMetadata.image_metadata?.title || selectedMetadata.image_metadata?.original_filename || 'N/A'}
                </div>
                <div>
                  <span className="font-medium text-blue-700">Organization:</span> {selectedMetadata.organization || 'N/A'}
                </div>
                <div>
                  <span className="font-medium text-blue-700">Project:</span> {selectedMetadata.project?.name || 'N/A'}
                </div>
                <div>
                  <span className="font-medium text-blue-700">Station:</span> {selectedMetadata.project?.inspectionStation || 'N/A'}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Project Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 border-b pb-2">Project Information</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Organization:</strong> {selectedMetadata.organization || 'N/A'}</div>
                  <div><strong>Project:</strong> {selectedMetadata.project?.name || 'N/A'}</div>
                  <div><strong>Project ID:</strong> {selectedMetadata.project?.id || 'N/A'}</div>
                  <div><strong>Phase:</strong> {selectedMetadata.project?.phase || 'N/A'}</div>
                  <div><strong>Inspection Station:</strong> {selectedMetadata.project?.inspectionStation || 'N/A'}</div>
                  <div><strong>Camera:</strong> {selectedMetadata.project?.cameraName || 'N/A'}</div>
                  <div><strong>Organization Type:</strong> {selectedMetadata.project?.organizationType || 'N/A'}</div>
                </div>
              </div>

              {/* Image Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 border-b pb-2">Image Information</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Image ID:</strong> {selectedMetadata.image_metadata?.id || 'N/A'}</div>
                  <div><strong>Original Filename:</strong> {selectedMetadata.image_metadata?.original_filename || 'N/A'}</div>
                  <div><strong>Title:</strong> {selectedMetadata.image_metadata?.title || 'N/A'}</div>
                  <div><strong>Category:</strong> {selectedMetadata.image_metadata?.category || 'N/A'}</div>
                  <div><strong>Status:</strong> {selectedMetadata.image_metadata?.status || 'N/A'}</div>
                  <div><strong>File Size:</strong> {selectedMetadata.image_metadata?.file_size ? `${(selectedMetadata.image_metadata.file_size / 1024).toFixed(1)} KB` : 'N/A'}</div>
                  <div><strong>Created:</strong> {selectedMetadata.image_metadata?.created_date ? new Date(selectedMetadata.image_metadata.created_date).toLocaleString() : 'N/A'}</div>
                  <div><strong>Last Modified:</strong> {selectedMetadata.image_metadata?.last_modified ? new Date(selectedMetadata.image_metadata.last_modified).toLocaleString() : 'N/A'}</div>
                  {selectedMetadata.image_metadata?.dimensions && (
                    <div><strong>Dimensions:</strong> {selectedMetadata.image_metadata.dimensions.width} x {selectedMetadata.image_metadata.dimensions.height}</div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {selectedMetadata.image_metadata?.tags && selectedMetadata.image_metadata.tags.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800 border-b pb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMetadata.image_metadata.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedMetadata.image_metadata?.description && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800 border-b pb-2">Description</h3>
                  <p className="text-sm text-slate-600">{selectedMetadata.image_metadata.description}</p>
                </div>
              )}

              {/* Observations */}
              {selectedMetadata.observations && Object.keys(selectedMetadata.observations).length > 0 && (
                <div className="md:col-span-2 space-y-4">
                  <h3 className="font-semibold text-slate-800 border-b pb-2">Observations</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(selectedMetadata.observations).map(([key, value]) => (
                      <div key={key} className="p-3 bg-slate-50 rounded-lg">
                        <div className="font-medium text-sm text-slate-700">{key}</div>
                        <div className="text-sm text-slate-600 mt-1">
                          {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Fields */}
              {selectedMetadata.custom_fields && Object.keys(selectedMetadata.custom_fields).length > 0 && (
                <div className="md:col-span-2 space-y-4">
                  <h3 className="font-semibold text-slate-800 border-b pb-2">Custom Fields</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(selectedMetadata.custom_fields).map(([key, value]) => (
                      <div key={key} className="p-3 bg-slate-50 rounded-lg">
                        <div className="font-medium text-sm text-slate-700">{key}</div>
                        <div className="text-sm text-slate-600 mt-1">
                          {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Raw JSON View */}
      {selectedMetadata && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="w-5 h-5" />
              Raw JSON Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 rounded-lg p-4 border">
              <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
                {JSON.stringify(selectedMetadata, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MetadataViewer; 
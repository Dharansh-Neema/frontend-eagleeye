import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Upload as UploadIcon,
  Eye,
  Camera,
  MapPin,
  FileImage,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  X,
  Info,
  FolderOpen,
  Loader2,
} from "lucide-react";

type UploadType = "training" | "production";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "completed" | "error";
  progress: number;
  metadata?: any;
}

const Upload = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [selectedStation, setSelectedStation] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dummy data for cameras and stations
  const cameras = [
    { id: "cam-001", name: "Camera A", stationId: "station-alpha" },
    { id: "cam-002", name: "Camera B", stationId: "station-beta" },
    { id: "cam-003", name: "Camera C", stationId: "station-gamma" },
  ];

  const stations = [
    { id: "station-alpha", name: "Station Alpha" },
    { id: "station-beta", name: "Station Beta" },
    { id: "station-gamma", name: "Station Gamma" },
  ];

  // Get cameras filtered by selected station
  const getFilteredCameras = () => {
    if (!selectedStation) return cameras;
    return cameras.filter((cam) => cam.stationId === selectedStation);
  };

  // Dummy data
  const dummyFiles = [
    {
      name: "defect_sample_001.jpg",
      size: 1024000,
      type: "image/jpeg",
      metadata: {
        camera: "Camera A",
        station: "Station Alpha",
        timestamp: "2024-01-15T10:30:00Z",
        location: "Production Line 1",
      },
    },
    {
      name: "defect_sample_002.jpg",
      size: 2048000,
      type: "image/jpeg",
      metadata: {
        camera: "Camera B",
        station: "Station Beta",
        timestamp: "2024-01-15T11:15:00Z",
        location: "Production Line 2",
      },
    },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles: File[] = Array.from(files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setFiles([]);
  };

  const handleUpload = () => {
    // Implementation of upload logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Upload Images
              </h1>
              <p className="text-sm text-gray-600">
                Add training data or production inference results
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div className="space-y-6">
            {/* Camera & Station Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Camera & Station Context
                </CardTitle>
                <CardDescription>
                  Select the camera and inspection station for this upload
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Station Selection */}
                  <div>
                    <Label htmlFor="station" className="text-sm font-medium">
                      Inspection Station *
                    </Label>
                    <Select
                      value={selectedStation}
                      onValueChange={setSelectedStation}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select inspection station" />
                      </SelectTrigger>
                      <SelectContent>
                        {stations.map((station) => (
                          <SelectItem key={station.id} value={station.id}>
                            {station.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Camera Selection */}
                  <div>
                    <Label htmlFor="camera" className="text-sm font-medium">
                      Camera *
                    </Label>
                    <Select
                      value={selectedCamera}
                      onValueChange={setSelectedCamera}
                      disabled={!selectedStation}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select camera" />
                      </SelectTrigger>
                      <SelectContent>
                        {getFilteredCameras().map((camera) => (
                          <SelectItem key={camera.id} value={camera.id}>
                            {camera.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload Images</CardTitle>
                <CardDescription>
                  Upload images for annotation and analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDrag}
                  onClick={handleFileSelect}
                >
                  <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Drop images here or click to browse
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Support for JPEG, PNG, TIFF formats
                  </p>
                  <Button variant="outline">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Select Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Upload Progress */}
            {uploading && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upload Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Uploading files...
                      </span>
                      <span className="text-sm font-medium">
                        {uploadProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* File Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">File Preview</CardTitle>
                <CardDescription>
                  {files.length} files selected for upload
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-3 border rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-16 h-12 object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <div className="mt-1 space-y-1">
                          <div className="text-xs text-gray-600">
                            Camera:{" "}
                            {cameras.find((c) => c.id === selectedCamera)
                              ?.name || "Not selected"}
                          </div>
                          <div className="text-xs text-gray-600">
                            Station:{" "}
                            {stations.find((s) => s.id === selectedStation)
                              ?.name || "Not selected"}
                          </div>
                          <div className="text-xs text-gray-600">
                            Time: {new Date().toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upload Actions */}
            {files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upload Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {files.length} files ready to upload
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" onClick={clearFiles}>
                        Clear All
                      </Button>
                      <Button
                        onClick={handleUpload}
                        disabled={
                          uploading || !selectedStation || !selectedCamera
                        }
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <UploadIcon className="w-4 h-4 mr-2" />
                            Upload Files
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  {(!selectedStation || !selectedCamera) && (
                    <div className="mt-2 text-xs text-orange-600">
                      Please select both station and camera before uploading
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Filter,
  Grid3X3,
  List,
  Download,
  Trash2,
  Eye,
  CheckCircle,
  Circle,
  AlertCircle,
  Settings,
} from "lucide-react";

interface ImageItem {
  id: string;
  name: string;
  url: string;
  status: "annotated" | "pending" | "skipped";
  defect_detected: boolean;
  defect_type: string;
  severity: string;
  createdAt: string;
  camera: string;
  cameraId: string;
  station: string;
  stationId: string;
}

const ImageGallery = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDefect, setFilterDefect] = useState<string>("all");
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedStation, setSelectedStation] = useState<string>("");

  // Dummy data
  const images: ImageItem[] = [
    {
      id: "img-001",
      name: "defect_sample_001.jpg",
      url: "https://images.pexels.com/photos/1432675/pexels-photo-1432675.jpeg",
      status: "annotated",
      defect_detected: true,
      defect_type: "Scratch",
      severity: "High",
      createdAt: "2024-01-15 10:30",
      camera: "Camera A",
      cameraId: "cam-001",
      station: "Station Alpha",
      stationId: "station-alpha",
    },
    {
      id: "img-002",
      name: "defect_sample_002.jpg",
      url: "https://images.pexels.com/photos/1432675/pexels-photo-1432675.jpeg",
      status: "pending",
      defect_detected: false,
      defect_type: "None",
      severity: "None",
      createdAt: "2024-01-15 11:15",
      camera: "Camera B",
      cameraId: "cam-002",
      station: "Station Beta",
      stationId: "station-beta",
    },
    {
      id: "img-003",
      name: "defect_sample_003.jpg",
      url: "https://images.pexels.com/photos/1432675/pexels-photo-1432675.jpeg",
      status: "annotated",
      defect_detected: true,
      defect_type: "Crack",
      severity: "Medium",
      createdAt: "2024-01-15 12:00",
      camera: "Camera C",
      cameraId: "cam-003",
      station: "Station Gamma",
      stationId: "station-gamma",
    },
    {
      id: "img-004",
      name: "defect_sample_004.jpg",
      url: "https://images.pexels.com/photos/1432675/pexels-photo-1432675.jpeg",
      status: "skipped",
      defect_detected: false,
      defect_type: "None",
      severity: "None",
      createdAt: "2024-01-15 13:45",
      camera: "Camera A",
      cameraId: "cam-004",
      station: "Station Alpha",
      stationId: "station-alpha",
    },
    {
      id: "img-005",
      name: "defect_sample_005.jpg",
      url: "https://images.pexels.com/photos/1432675/pexels-photo-1432675.jpeg",
      status: "pending",
      defect_detected: true,
      defect_type: "Dent",
      severity: "Low",
      createdAt: "2024-01-15 14:20",
      camera: "Camera B",
      cameraId: "cam-005",
      station: "Station Beta",
      stationId: "station-beta",
    },
    {
      id: "img-006",
      name: "defect_sample_006.jpg",
      url: "https://images.pexels.com/photos/1432675/pexels-photo-1432675.jpeg",
      status: "annotated",
      defect_detected: false,
      defect_type: "None",
      severity: "None",
      createdAt: "2024-01-15 15:10",
      camera: "Camera C",
      cameraId: "cam-006",
      station: "Station Gamma",
      stationId: "station-gamma",
    },
  ];

  // Add stations array after the images array:
  const stations = [
    { id: "station-alpha", name: "Station Alpha" },
    { id: "station-beta", name: "Station Beta" },
    { id: "station-gamma", name: "Station Gamma" },
  ];

  // Update cameras array to include station information:
  const cameras = [
    { id: "cam-001", name: "Camera A", stationId: "station-alpha" },
    { id: "cam-002", name: "Camera B", stationId: "station-beta" },
    { id: "cam-003", name: "Camera C", stationId: "station-gamma" },
  ];

  // Get unique camera names for the sidebar, filtered by selected station:
  const getFilteredCameras = () => {
    let filteredCams = cameras;
    if (selectedStation) {
      filteredCams = cameras.filter((cam) => cam.stationId === selectedStation);
    }
    return Array.from(new Set(filteredCams.map((cam) => cam.name)));
  };

  const uniqueCameras = getFilteredCameras();

  const filteredImages = images.filter((image) => {
    const matchesSearch =
      image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.camera.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.station.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || image.status === filterStatus;
    const matchesDefect =
      filterDefect === "all" ||
      (filterDefect === "defect" && image.defect_detected) ||
      (filterDefect === "no_defect" && !image.defect_detected);

    const matchesCamera = !selectedCamera || image.camera === selectedCamera;
    const matchesStation =
      !selectedStation || image.stationId === selectedStation;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesDefect &&
      matchesCamera &&
      matchesStation
    );
  });

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  const selectAll = () => {
    setSelectedImages(filteredImages.map((img) => img.id));
  };

  const clearSelection = () => {
    setSelectedImages([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "annotated":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "skipped":
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  // Add function to handle station change:
  const handleStationChange = (stationId: string) => {
    setSelectedStation(stationId);
    setSelectedCamera(""); // Clear camera selection when station changes
  };

  // Add function to handle "All Stations" selection:
  const handleAllStations = () => {
    setSelectedStation("");
    setSelectedCamera(""); // Clear camera selection when station changes
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
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
                  Image Gallery
                </h1>
                <p className="text-sm text-gray-600">
                  Browse and manage your image collection
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {filteredImages.length} images
                </span>
                {selectedImages.length > 0 && (
                  <Badge variant="outline">
                    {selectedImages.length} selected
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Camera Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Inspection Station
            </h3>
            <div className="space-y-2">
              <Button
                variant={selectedStation === "" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={handleAllStations}
              >
                All Stations
              </Button>
              <Select
                value={selectedStation}
                onValueChange={handleStationChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Station" />
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
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Cameras</h3>
            <Button
              variant={selectedCamera === "" ? "default" : "ghost"}
              className="w-full justify-start mb-2"
              onClick={() => setSelectedCamera("")}
            >
              All Cameras
            </Button>
            {uniqueCameras.map((cameraName) => (
              <Button
                key={cameraName}
                variant={selectedCamera === cameraName ? "default" : "ghost"}
                className="w-full justify-start mb-1"
                onClick={() => setSelectedCamera(cameraName)}
              >
                {cameraName}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Controls */}
            <Card className="mb-6 border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search images..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-64"
                      />
                    </div>

                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="annotated">Annotated</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="skipped">Skipped</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={filterDefect}
                      onValueChange={setFilterDefect}
                    >
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Defect" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Images</SelectItem>
                        <SelectItem value="defect">With Defects</SelectItem>
                        <SelectItem value="no_defect">No Defects</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* View Mode and Actions */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="rounded-r-none"
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="rounded-l-none"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>

                    {selectedImages.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearSelection}
                        >
                          Clear
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bulk Selection */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={
                        selectedImages.length === filteredImages.length &&
                        filteredImages.length > 0
                      }
                      onCheckedChange={(checked) =>
                        checked ? selectAll() : clearSelection()
                      }
                    />
                    <Label className="text-sm">
                      Select All ({filteredImages.length})
                    </Label>
                  </div>

                  {selectedImages.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Selected
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Batch Edit
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Image Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((image) => (
                  <Card
                    key={image.id}
                    className="border-0 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="relative">
                        <Checkbox
                          checked={selectedImages.includes(image.id)}
                          onCheckedChange={() => toggleImageSelection(image.id)}
                          className="absolute top-2 left-2 z-10 bg-white/80"
                        />
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-48 object-cover rounded-lg mb-3"
                        />
                        <div className="absolute top-2 right-2">
                          {getStatusIcon(image.status)}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-sm truncate">
                          {image.name}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{image.camera}</span>
                          <span>{image.station}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge
                            variant={
                              image.defect_detected
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {image.defect_detected
                              ? image.defect_type
                              : "No Defect"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getSeverityColor(
                              image.severity
                            )}`}
                          >
                            {image.severity}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{image.createdAt}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredImages.map((image) => (
                  <Card key={image.id} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          checked={selectedImages.includes(image.id)}
                          onCheckedChange={() => toggleImageSelection(image.id)}
                        />
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-sm truncate">
                              {image.name}
                            </h3>
                            {getStatusIcon(image.status)}
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>{image.camera}</span>
                            <span>{image.station}</span>
                            <span>{image.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              image.defect_detected
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {image.defect_detected
                              ? image.defect_type
                              : "No Defect"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getSeverityColor(
                              image.severity
                            )}`}
                          >
                            {image.severity}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredImages.length === 0 && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No images found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or filters to find what
                    you're looking for.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;

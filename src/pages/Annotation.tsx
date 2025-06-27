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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Forward,
  Eye,
  CheckCircle,
  Circle,
  AlertCircle,
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
  station: string;
  stationId: string;
  cameraId: string;
}

const Annotation = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedStation, setSelectedStation] = useState("");
  const [selectedCamera, setSelectedCamera] = useState("");
  const [annotation, setAnnotation] = useState({
    dataType: "",
    booleanValue: false,
    numericMin: "",
    numericMax: "",
    stringValue: "",
    notes: "",
  });

  // Dummy data
  const images: ImageItem[] = [
    {
      id: "img-001",
      name: "defect_sample_001.jpg",
      url: "https://images.pexels.com/photos/1432675/pexels-photo-1432675.jpeg",
      status: "pending",
      defect_detected: false,
      defect_type: "",
      severity: "",
      createdAt: "2024-01-15 10:30",
      camera: "Camera A",
      station: "Station Alpha",
      stationId: "station-alpha",
      cameraId: "cam-001",
    },
    {
      id: "img-002",
      name: "defect_sample_002.jpg",
      url: "https://images.pexels.com/photos/1432675/pexels-photo-1432675.jpeg",
      status: "pending",
      defect_detected: false,
      defect_type: "",
      severity: "",
      createdAt: "2024-01-15 11:15",
      camera: "Camera B",
      station: "Station Beta",
      stationId: "station-beta",
      cameraId: "cam-002",
    },
    {
      id: "img-003",
      name: "defect_sample_003.jpg",
      url: "https://images.pexels.com/photos/1432675/pexels-photo-1432675.jpeg",
      status: "pending",
      defect_detected: false,
      defect_type: "",
      severity: "",
      createdAt: "2024-01-15 12:00",
      camera: "Camera C",
      station: "Station Gamma",
      stationId: "station-gamma",
      cameraId: "cam-003",
    },
  ];

  // Stations and cameras data
  const stations = [
    { id: "station-alpha", name: "Station Alpha" },
    { id: "station-beta", name: "Station Beta" },
    { id: "station-gamma", name: "Station Gamma" },
  ];

  const cameras = [
    { id: "cam-001", name: "Camera A", stationId: "station-alpha" },
    { id: "cam-002", name: "Camera B", stationId: "station-beta" },
    { id: "cam-003", name: "Camera C", stationId: "station-gamma" },
  ];

  // Get filtered cameras based on selected station
  const getFilteredCameras = () => {
    if (!selectedStation) return cameras;
    return cameras.filter((cam) => cam.stationId === selectedStation);
  };

  // Filter images based on selected station and camera
  const filteredImages = images.filter((image) => {
    const matchesStation =
      !selectedStation || image.stationId === selectedStation;
    const matchesCamera = !selectedCamera || image.cameraId === selectedCamera;
    return matchesStation && matchesCamera;
  });

  const currentImage = filteredImages[currentImageIndex] || images[0];

  const handleSave = () => {
    // Save annotation logic here
    console.log("Saving annotation:", annotation);

    // Move to next image or finish
    if (currentImageIndex < filteredImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setAnnotation({
        dataType: "",
        booleanValue: false,
        numericMin: "",
        numericMax: "",
        stringValue: "",
        notes: "",
      });
    } else {
      navigate("/");
    }
  };

  const handleSkip = () => {
    // Skip current image
    if (currentImageIndex < filteredImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setAnnotation({
        dataType: "",
        booleanValue: false,
        numericMin: "",
        numericMax: "",
        stringValue: "",
        notes: "",
      });
    } else {
      navigate("/");
    }
  };

  const handleStationChange = (stationId: string) => {
    setSelectedStation(stationId);
    setSelectedCamera("");
    setCurrentImageIndex(0);
  };

  const handleAllStations = () => {
    setSelectedStation("");
    setSelectedCamera("");
    setCurrentImageIndex(0);
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
                  Image Annotation
                </h1>
                <p className="text-sm text-gray-600">
                  Annotate images with ground truth data
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Image {currentImageIndex + 1} of {filteredImages.length}
                </span>
                <Badge variant="outline">{currentImage.status}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Filters Sidebar */}
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
            {getFilteredCameras().map((camera) => (
              <Button
                key={camera.id}
                variant={selectedCamera === camera.id ? "default" : "ghost"}
                className="w-full justify-start mb-1"
                onClick={() => setSelectedCamera(camera.id)}
              >
                {camera.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Display */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Image Preview</CardTitle>
                    <CardDescription>
                      {currentImage.name} - {currentImage.camera} -{" "}
                      {currentImage.station}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <img
                        src={currentImage.url}
                        alt={currentImage.name}
                        className="w-full h-96 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2">
                        {getStatusIcon(currentImage.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Annotation Form */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Ground Truth Annotation
                    </CardTitle>
                    <CardDescription>
                      Provide accurate annotations for training data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Data Type Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Data Type *</Label>
                      <Select
                        value={annotation.dataType}
                        onValueChange={(value) =>
                          setAnnotation({ ...annotation, dataType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select data type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="boolean">
                            Boolean (True/False)
                          </SelectItem>
                          <SelectItem value="numeric">
                            Numeric (Min/Max)
                          </SelectItem>
                          <SelectItem value="string">String (Text)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Boolean Input */}
                    {annotation.dataType === "boolean" && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Value *</Label>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="boolean-true"
                              name="booleanValue"
                              checked={annotation.booleanValue === true}
                              onChange={() =>
                                setAnnotation({
                                  ...annotation,
                                  booleanValue: true,
                                })
                              }
                            />
                            <Label htmlFor="boolean-true">True</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="boolean-false"
                              name="booleanValue"
                              checked={annotation.booleanValue === false}
                              onChange={() =>
                                setAnnotation({
                                  ...annotation,
                                  booleanValue: false,
                                })
                              }
                            />
                            <Label htmlFor="boolean-false">False</Label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Numeric Input */}
                    {annotation.dataType === "numeric" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="numericMin"
                            className="text-sm font-medium"
                          >
                            Minimum Value *
                          </Label>
                          <Input
                            id="numericMin"
                            type="number"
                            placeholder="Enter minimum value"
                            value={annotation.numericMin}
                            onChange={(e) =>
                              setAnnotation({
                                ...annotation,
                                numericMin: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="numericMax"
                            className="text-sm font-medium"
                          >
                            Maximum Value *
                          </Label>
                          <Input
                            id="numericMax"
                            type="number"
                            placeholder="Enter maximum value"
                            value={annotation.numericMax}
                            onChange={(e) =>
                              setAnnotation({
                                ...annotation,
                                numericMax: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}

                    {/* String Input */}
                    {annotation.dataType === "string" && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="stringValue"
                          className="text-sm font-medium"
                        >
                          Observed Value *
                        </Label>
                        <Input
                          id="stringValue"
                          placeholder="Enter observed value"
                          value={annotation.stringValue}
                          onChange={(e) =>
                            setAnnotation({
                              ...annotation,
                              stringValue: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}

                    {/* Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-sm font-medium">
                        Notes
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Additional observations or comments..."
                        value={annotation.notes}
                        onChange={(e) =>
                          setAnnotation({
                            ...annotation,
                            notes: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={handleSkip}
                        className="flex items-center"
                      >
                        <Forward className="w-4 h-4 mr-2" />
                        Skip
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="flex items-center"
                        disabled={
                          !annotation.dataType ||
                          (annotation.dataType === "boolean" &&
                            annotation.booleanValue === undefined) ||
                          (annotation.dataType === "numeric" &&
                            (!annotation.numericMin ||
                              !annotation.numericMax)) ||
                          (annotation.dataType === "string" &&
                            !annotation.stringValue)
                        }
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save & Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Annotation;

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
  Database,
  Search,
  Download,
  Plus,
  Filter,
  Eye,
  Trash2,
  Settings,
  FileText,
} from "lucide-react";

interface Dataset {
  id: string;
  name: string;
  description: string;
  imageCount: number;
  createdAt: string;
  status: "active" | "archived";
  filters: Record<string, any>;
}

const DatasetManagement = () => {
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {}
  );
  const [datasets, setDatasets] = useState<Dataset[]>([
    {
      id: "ds-001",
      name: "Defect_Detection_v1",
      description: "Training dataset for defect detection model v1",
      imageCount: 1250,
      createdAt: "2024-12-15",
      status: "active",
      filters: { defect_detected: true, severity: ["medium", "high"] },
    },
    {
      id: "ds-002",
      name: "Quality_Control_Evaluation",
      description: "Evaluation dataset for quality control system",
      imageCount: 450,
      createdAt: "2024-12-18",
      status: "active",
      filters: { defect_type: "scratch" },
    },
    {
      id: "ds-003",
      name: "Production_Test_Set",
      description: "Test dataset for production deployment",
      imageCount: 200,
      createdAt: "2024-12-20",
      status: "archived",
      filters: { confidence: { min: 0.8 } },
    },
  ]);

  // Observation filter state
  const [observationFilter, setObservationFilter] = useState({
    dataType: "",
    booleanValue: undefined as boolean | undefined,
    numericMin: "",
    numericMax: "",
    stringValue: "",
    userNotes: "",
  });

  // Station and camera filter state
  const [selectedStation, setSelectedStation] = useState("");
  const [selectedCamera, setSelectedCamera] = useState("");

  // Stations and cameras data (matching Annotation page)
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

  const addFilter = (key: string, value: any) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const removeFilter = (key: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const handleStationChange = (stationId: string) => {
    setSelectedStation(stationId);
    setSelectedCamera("");
    addFilter("station", stationId);
  };

  const handleAllStations = () => {
    setSelectedStation("");
    setSelectedCamera("");
    removeFilter("station");
  };

  const handleCameraChange = (cameraId: string) => {
    setSelectedCamera(cameraId);
    addFilter("camera", cameraId);
  };

  const handleAllCameras = () => {
    setSelectedCamera("");
    removeFilter("camera");
  };

  const applyObservationFilter = () => {
    if (observationFilter.dataType) {
      let filterValue: any;

      if (observationFilter.dataType === "boolean") {
        filterValue = observationFilter.booleanValue;
      } else if (observationFilter.dataType === "numeric") {
        filterValue = {
          min: parseFloat(observationFilter.numericMin),
          max: parseFloat(observationFilter.numericMax),
        };
      } else if (observationFilter.dataType === "string") {
        filterValue = observationFilter.stringValue;
      }

      if (filterValue !== undefined && filterValue !== "") {
        addFilter("observation", {
          type: observationFilter.dataType,
          value: filterValue,
        });
      }
    }

    if (observationFilter.userNotes) {
      addFilter("userNotes", observationFilter.userNotes);
    }
  };

  const clearObservationFilter = () => {
    setObservationFilter({
      dataType: "",
      booleanValue: undefined,
      numericMin: "",
      numericMax: "",
      stringValue: "",
      userNotes: "",
    });
    removeFilter("observation");
    removeFilter("userNotes");
  };

  const createDataset = () => {
    const newDataset: Dataset = {
      id: `ds-${Date.now()}`,
      name: `Dataset_${Date.now()}`,
      description: "New dataset created from filtered results",
      imageCount: Math.floor(Math.random() * 1000) + 100,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
      filters: selectedFilters,
    };
    setDatasets((prev) => [...prev, newDataset]);
    setSelectedFilters({});
    setObservationFilter({
      dataType: "",
      booleanValue: undefined,
      numericMin: "",
      numericMax: "",
      stringValue: "",
      userNotes: "",
    });
    setSelectedStation("");
    setSelectedCamera("");
  };

  const deleteDataset = (datasetId: string) => {
    setDatasets((prev) => prev.filter((ds) => ds.id !== datasetId));
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
                Dataset Management
              </h1>
              <p className="text-sm text-gray-600">
                Create and manage training/evaluation datasets
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Query Builder */}
          <div>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Query Builder
                </CardTitle>
                <CardDescription>
                  Filter images by ground truth values to create datasets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Inspection Station Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Inspection Station
                    </Label>
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

                  {/* Camera Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Camera</Label>
                    <Button
                      variant={selectedCamera === "" ? "default" : "ghost"}
                      className="w-full justify-start mb-2"
                      onClick={handleAllCameras}
                    >
                      All Cameras
                    </Button>
                    {getFilteredCameras().map((camera) => (
                      <Button
                        key={camera.id}
                        variant={
                          selectedCamera === camera.id ? "default" : "ghost"
                        }
                        className="w-full justify-start mb-1"
                        onClick={() => handleCameraChange(camera.id)}
                      >
                        {camera.name}
                      </Button>
                    ))}
                  </div>

                  {/* Observation Filter */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">
                      Observation Filter
                    </Label>

                    {/* Data Type Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Data Type</Label>
                      <Select
                        value={observationFilter.dataType}
                        onValueChange={(value) =>
                          setObservationFilter({
                            ...observationFilter,
                            dataType: value,
                          })
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
                    {observationFilter.dataType === "boolean" && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Value</Label>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="boolean-true"
                              name="booleanValue"
                              checked={observationFilter.booleanValue === true}
                              onChange={() =>
                                setObservationFilter({
                                  ...observationFilter,
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
                              checked={observationFilter.booleanValue === false}
                              onChange={() =>
                                setObservationFilter({
                                  ...observationFilter,
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
                    {observationFilter.dataType === "numeric" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="numericMin"
                            className="text-sm font-medium"
                          >
                            Minimum Value
                          </Label>
                          <Input
                            id="numericMin"
                            type="number"
                            placeholder="Enter minimum value"
                            value={observationFilter.numericMin}
                            onChange={(e) =>
                              setObservationFilter({
                                ...observationFilter,
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
                            Maximum Value
                          </Label>
                          <Input
                            id="numericMax"
                            type="number"
                            placeholder="Enter maximum value"
                            value={observationFilter.numericMax}
                            onChange={(e) =>
                              setObservationFilter({
                                ...observationFilter,
                                numericMax: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}

                    {/* String Input */}
                    {observationFilter.dataType === "string" && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="stringValue"
                          className="text-sm font-medium"
                        >
                          Observed Value
                        </Label>
                        <Input
                          id="stringValue"
                          placeholder="Enter observed value"
                          value={observationFilter.stringValue}
                          onChange={(e) =>
                            setObservationFilter({
                              ...observationFilter,
                              stringValue: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}

                    {/* User Notes Filter */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="userNotes"
                        className="text-sm font-medium"
                      >
                        User Notes
                      </Label>
                      <Textarea
                        id="userNotes"
                        placeholder="Filter by notes content..."
                        value={observationFilter.userNotes}
                        onChange={(e) =>
                          setObservationFilter({
                            ...observationFilter,
                            userNotes: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>

                    {/* Apply Observation Filter Button */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={applyObservationFilter}
                        disabled={
                          !observationFilter.dataType ||
                          (observationFilter.dataType === "boolean" &&
                            observationFilter.booleanValue === undefined) ||
                          (observationFilter.dataType === "numeric" &&
                            (!observationFilter.numericMin ||
                              !observationFilter.numericMax)) ||
                          (observationFilter.dataType === "string" &&
                            !observationFilter.stringValue)
                        }
                      >
                        Apply Filter
                      </Button>
                      <Button variant="ghost" onClick={clearObservationFilter}>
                        Clear
                      </Button>
                    </div>
                  </div>

                  {/* Active Filters */}
                  {Object.keys(selectedFilters).length > 0 && (
                    <div className="pt-4 border-t">
                      <Label className="text-sm font-medium mb-2 block">
                        Active Filters
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(selectedFilters).map(([key, value]) => (
                          <Badge
                            key={key}
                            variant="secondary"
                            className="flex items-center"
                          >
                            {key}:{" "}
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFilter(key)}
                              className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedFilters({});
                          setObservationFilter({
                            dataType: "",
                            booleanValue: undefined,
                            numericMin: "",
                            numericMax: "",
                            stringValue: "",
                            userNotes: "",
                          });
                          setSelectedStation("");
                          setSelectedCamera("");
                        }}
                      >
                        Clear All Filters
                      </Button>
                      <Button
                        onClick={createDataset}
                        disabled={Object.keys(selectedFilters).length === 0}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Dataset
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dataset List */}
          <div>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Datasets ({datasets.length})
                </CardTitle>
                <CardDescription>
                  Manage your training and evaluation datasets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {datasets.map((dataset) => (
                    <div key={dataset.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-gray-900">
                              {dataset.name}
                            </h3>
                            <Badge
                              variant={
                                dataset.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {dataset.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {dataset.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{dataset.imageCount} images</span>
                            <span>Created: {dataset.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteDataset(dataset.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Filter Summary */}
                      {Object.keys(dataset.filters).length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center space-x-2">
                            <Filter className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              Filters:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(dataset.filters).map(
                                ([key, value]) => (
                                  <Badge
                                    key={key}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {key}: {String(value)}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Export Section */}
        <div className="mt-8">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Export Options</CardTitle>
              <CardDescription>
                Export datasets in various formats for external use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <FileText className="w-6 h-6 mb-2" />
                  <span>CSV Export</span>
                  <span className="text-xs opacity-75">Metadata only</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Database className="w-6 h-6 mb-2" />
                  <span>JSON Export</span>
                  <span className="text-xs opacity-75">Complete dataset</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Download className="w-6 h-6 mb-2" />
                  <span>Archive Export</span>
                  <span className="text-xs opacity-75">Images + metadata</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DatasetManagement;

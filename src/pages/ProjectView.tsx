import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  FolderOpen,
  MapPin,
  Camera,
  ChevronRight,
  Plus,
  Settings,
  BarChart3,
  Upload,
  Database,
  Users,
  Calendar,
  Activity,
} from "lucide-react";

interface ProjectNode {
  id: string;
  name: string;
  type: "organization" | "project" | "station" | "camera";
  children?: ProjectNode[];
  stats?: {
    totalImages: number;
    annotatedImages: number;
    pendingImages: number;
    lastActivity: string;
  };
}

const ProjectView = () => {
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState<string[]>(["org-001"]);
  const [currentView, setCurrentView] = useState<"hierarchy" | "details">(
    "hierarchy"
  );

  // Dummy hierarchical data
  const projectStructure: ProjectNode = {
    id: "org-001",
    name: "ITC Limited",
    type: "organization",
    stats: {
      totalImages: 12470,
      annotatedImages: 8920,
      pendingImages: 3550,
      lastActivity: "2024-12-20 14:30",
    },
    children: [
      {
        id: "proj-001",
        name: "Quality Control System - Line A",
        type: "project",
        stats: {
          totalImages: 8470,
          annotatedImages: 6120,
          pendingImages: 2350,
          lastActivity: "2024-12-20 14:30",
        },
        children: [
          {
            id: "station-alpha",
            name: "Station Alpha",
            type: "station",
            stats: {
              totalImages: 4235,
              annotatedImages: 3060,
              pendingImages: 1175,
              lastActivity: "2024-12-20 14:30",
            },
            children: [
              {
                id: "cam-001",
                name: "Camera A - Line 1",
                type: "camera",
                stats: {
                  totalImages: 2117,
                  annotatedImages: 1530,
                  pendingImages: 587,
                  lastActivity: "2024-12-20 14:30",
                },
              },
              {
                id: "cam-002",
                name: "Camera B - Line 1",
                type: "camera",
                stats: {
                  totalImages: 2118,
                  annotatedImages: 1530,
                  pendingImages: 588,
                  lastActivity: "2024-12-20 14:25",
                },
              },
            ],
          },
          {
            id: "station-beta",
            name: "Station Beta",
            type: "station",
            stats: {
              totalImages: 4235,
              annotatedImages: 3060,
              pendingImages: 1175,
              lastActivity: "2024-12-20 14:20",
            },
            children: [
              {
                id: "cam-003",
                name: "Camera A - Line 2",
                type: "camera",
                stats: {
                  totalImages: 2117,
                  annotatedImages: 1530,
                  pendingImages: 587,
                  lastActivity: "2024-12-20 14:20",
                },
              },
              {
                id: "cam-004",
                name: "Camera B - Line 2",
                type: "camera",
                stats: {
                  totalImages: 2118,
                  annotatedImages: 1530,
                  pendingImages: 588,
                  lastActivity: "2024-12-20 14:15",
                },
              },
            ],
          },
        ],
      },
      {
        id: "proj-002",
        name: "Quality Control System - Line B",
        type: "project",
        stats: {
          totalImages: 4000,
          annotatedImages: 2800,
          pendingImages: 1200,
          lastActivity: "2024-12-20 13:45",
        },
        children: [
          {
            id: "station-gamma",
            name: "Station Gamma",
            type: "station",
            stats: {
              totalImages: 4000,
              annotatedImages: 2800,
              pendingImages: 1200,
              lastActivity: "2024-12-20 13:45",
            },
            children: [
              {
                id: "cam-005",
                name: "Camera A - Line B",
                type: "camera",
                stats: {
                  totalImages: 2000,
                  annotatedImages: 1400,
                  pendingImages: 600,
                  lastActivity: "2024-12-20 13:45",
                },
              },
              {
                id: "cam-006",
                name: "Camera B - Line B",
                type: "camera",
                stats: {
                  totalImages: 2000,
                  annotatedImages: 1400,
                  pendingImages: 600,
                  lastActivity: "2024-12-20 13:40",
                },
              },
            ],
          },
        ],
      },
    ],
  };

  const getNodeByPath = (path: string[]): ProjectNode | null => {
    let current: ProjectNode | null = projectStructure;
    for (const id of path) {
      if (!current?.children) return null;
      current = current.children.find((child) => child.id === id) || null;
      if (!current) return null;
    }
    return current;
  };

  const getBreadcrumbPath = (path: string[]): ProjectNode[] => {
    const breadcrumbs: ProjectNode[] = [projectStructure];
    let current = projectStructure;

    for (const id of path) {
      if (current.children) {
        const child = current.children.find((c) => c.id === id);
        if (child) {
          breadcrumbs.push(child);
          current = child;
        }
      }
    }

    return breadcrumbs;
  };

  const currentNode = getNodeByPath(selectedPath);
  const breadcrumbs = getBreadcrumbPath(selectedPath);

  const getIcon = (type: string) => {
    switch (type) {
      case "organization":
        return <Building2 className="w-5 h-5" />;
      case "project":
        return <FolderOpen className="w-5 h-5" />;
      case "station":
        return <MapPin className="w-5 h-5" />;
      case "camera":
        return <Camera className="w-5 h-5" />;
      default:
        return <FolderOpen className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "organization":
        return "bg-blue-100 text-blue-800";
      case "project":
        return "bg-green-100 text-green-800";
      case "station":
        return "bg-purple-100 text-purple-800";
      case "camera":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleNodeClick = (nodeId: string) => {
    const nodeIndex = selectedPath.indexOf(nodeId);
    if (nodeIndex !== -1) {
      // Clicked on a node in the current path, truncate to that point
      setSelectedPath(selectedPath.slice(0, nodeIndex + 1));
    } else {
      // Clicked on a child node, add to path
      setSelectedPath([...selectedPath, nodeId]);
    }
  };

  const getProgressPercentage = (stats: any) => {
    return stats
      ? Math.round((stats.annotatedImages / stats.totalImages) * 100)
      : 0;
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
                  Project Structure
                </h1>
                <p className="text-sm text-gray-600">
                  Navigate through your organization hierarchy
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((node, index) => (
                <div key={node.id} className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNodeClick(node.id)}
                    className="h-auto p-1 text-gray-600 hover:text-gray-900"
                  >
                    {getIcon(node.type)}
                    <span className="ml-2">{node.name}</span>
                  </Button>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Only the left section, now centered and full width */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                {getIcon(currentNode?.type || "project")}
                <div>
                  <CardTitle className="text-lg">{currentNode?.name}</CardTitle>
                  <Badge
                    className={`${getTypeColor(
                      currentNode?.type || "project"
                    )}`}
                  >
                    {currentNode?.type?.replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {currentNode?.stats && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {currentNode.stats.totalImages.toLocaleString()}
                      </div>
                      <div className="text-xs text-blue-600">Total Images</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {currentNode.stats.annotatedImages.toLocaleString()}
                      </div>
                      <div className="text-xs text-green-600">Annotated</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{getProgressPercentage(currentNode.stats)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${getProgressPercentage(currentNode.stats)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Last activity: {currentNode.stats.lastActivity}
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-2">
                <Button className="w-full" onClick={() => navigate("/upload")}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Images
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/annotation")}
                >
                  <Database className="w-4 h-4 mr-2" />
                  Annotate Images
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/gallery")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Gallery
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Organization Overview</CardTitle>
              <CardDescription>
                High-level statistics across all projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {projectStructure.stats?.totalImages.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Images</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {projectStructure.stats?.annotatedImages.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Annotated</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {projectStructure.stats?.pendingImages.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {projectStructure.children?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Active Projects</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;

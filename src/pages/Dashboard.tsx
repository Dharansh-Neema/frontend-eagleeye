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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Image,
  Database,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const dummyProjects = [
  {
    id: "proj-001",
    name: "Quality Control System - Line A",
    organization: "ITC Limited",
    status: "active",
    totalImages: 1247,
    annotatedImages: 892,
    pendingImages: 355,
  },
  {
    id: "proj-002",
    name: "Quality Control System - Line B",
    organization: "ITC Limited",
    status: "active",
    totalImages: 980,
    annotatedImages: 700,
    pendingImages: 280,
  },
  {
    id: "proj-003",
    name: "Cigratte Box Packaging Inspection",
    organization: "ITC Limited",
    status: "archived",
    totalImages: 500,
    annotatedImages: 500,
    pendingImages: 0,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedProjectId, setSelectedProjectId] = useState(
    dummyProjects[0].id
  );
  const currentProject = dummyProjects.find((p) => p.id === selectedProjectId)!;

  const recentActivity = [
    {
      id: 1,
      type: "upload",
      message: "Uploaded 50 training images",
      time: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "annotation",
      message: "Annotated 25 images",
      time: "4 hours ago",
      status: "completed",
    },
    {
      id: 3,
      type: "dataset",
      message: "Created dataset 'Defect_Detection_v2'",
      time: "1 day ago",
      status: "completed",
    },
    {
      id: 4,
      type: "upload",
      message: "Production inference upload failed",
      time: "2 days ago",
      status: "error",
    },
  ];

  const quickStats = [
    {
      label: "Total Images",
      value: "1,247",
      icon: Image,
      color: "text-blue-600",
    },
    {
      label: "Annotated",
      value: "892",
      icon: CheckCircle,
      color: "text-green-600",
    },
    { label: "Pending", value: "355", icon: Clock, color: "text-orange-600" },
    { label: "Datasets", value: "8", icon: Database, color: "text-purple-600" },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <Upload className="w-4 h-4" />;
      case "annotation":
        return <Image className="w-4 h-4" />;
      case "dataset":
        return <Database className="w-4 h-4" />;
      default:
        return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-orange-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4 justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              <Select
                value={selectedProjectId}
                onValueChange={setSelectedProjectId}
              >
                <SelectTrigger className="w-72">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {dummyProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={() => navigate("/login")}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentProject.name}
              </h2>
              <p className="text-gray-600">{currentProject.organization}</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Active Project
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>
                  Start working on your machine vision project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => navigate("/upload")}
                    className="h-20 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Upload className="w-6 h-6 mb-2" />
                    <span>Upload Training Data</span>
                  </Button>

                  <Button
                    onClick={() => navigate("/upload")}
                    className="h-20 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Eye className="w-6 h-6 mb-2" />
                    <span>Upload Production Data</span>
                  </Button>

                  <Button
                    onClick={() => navigate("/annotation")}
                    className="h-20 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Image className="w-6 h-6 mb-2" />
                    <span>Annotate Images</span>
                  </Button>

                  <Button
                    onClick={() => navigate("/datasets")}
                    className="h-20 flex flex-col items-center justify-center bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Database className="w-6 h-6 mb-2" />
                    <span>Manage Datasets</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates from your project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusIcon(activity.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Project Navigation */}
        <div className="mt-8">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Project Navigation</CardTitle>
              <CardDescription>
                Access different areas of your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/project")}
                  className="h-12 justify-start"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Project Overview
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/gallery")}
                  className="h-12 justify-start"
                >
                  <Image className="w-4 h-4 mr-2" />
                  Image Gallery
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/datasets")}
                  className="h-12 justify-start"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Dataset Management
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

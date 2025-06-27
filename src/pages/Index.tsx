import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileImage, Eye } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-slate-900 text-white py-6 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Industrial Image Management System</h1>
          <p className="text-slate-300 mt-2">Streamlined inspection image processing and organization with EXIF metadata embedding</p>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Choose Your Workflow</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Select the action you want to perform. Whether you're processing new inspection images,
            updating existing data, searching through your image library, or viewing embedded metadata.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Classify New Images */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105 group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <FileImage className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-slate-800">Classify New Images</CardTitle>
              <CardDescription className="text-slate-600">
                Upload and categorize new inspection images with embedded EXIF metadata
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                onClick={() => navigate('/classify')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
              >
                Start Classification
              </Button>
              <div className="mt-4 text-sm text-slate-500">
                • Bulk image upload
                • Project organization
                • EXIF metadata embedding
              </div>
            </CardContent>
          </Card>

          {/* View EXIF Metadata */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105 group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl text-slate-800">View EXIF Metadata</CardTitle>
              <CardDescription className="text-slate-600">
                Read and display embedded metadata from processed images
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                onClick={() => navigate('/metadata-viewer')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-medium"
              >
                View Metadata
              </Button>
              <div className="mt-4 text-sm text-slate-500">
                • Read EXIF data
                • JSON export
                • Detailed view
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Section */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">System Overview</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-slate-600">Images Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-slate-600">Projects Created</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

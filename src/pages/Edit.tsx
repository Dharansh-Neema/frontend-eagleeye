
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FolderOpen } from "lucide-react";

const Edit = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-slate-900 text-white py-6 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-white hover:bg-slate-800 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Existing Images</h1>
            <p className="text-slate-300">Modify metadata of previously processed images</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <FolderOpen className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-2xl text-slate-800">Select Image Directory</CardTitle>
            <p className="text-slate-600 mt-2">
              Choose a directory containing previously processed images to edit their metadata
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg">
                Browse for Image Directory
              </Button>
              <p className="text-sm text-slate-500 mt-4">
                This feature will be available in the next version
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Edit;

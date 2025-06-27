
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";

const Search = () => {
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
            <h1 className="text-2xl font-bold">Search Images</h1>
            <p className="text-slate-300">Find and filter images by metadata criteria</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <SearchIcon className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-slate-800">Advanced Image Search</CardTitle>
            <p className="text-slate-600 mt-2">
              Search through your image library using filters and metadata criteria
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                Start Searching
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

export default Search;

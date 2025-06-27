import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { ProjectData } from "@/lib/exifMetadataManager";

interface ProjectSetupProps {
  onNext: (data: ProjectData) => void;
}

const ProjectSetup = ({ onNext }: ProjectSetupProps) => {
  const [formData, setFormData] = useState({
    organisationName: '',
    projectName: '',
    inspectionStation: '',
    cameraName: ''
  });

  const handleNext = () => {
    if (formData.organisationName && formData.projectName && formData.inspectionStation && formData.cameraName) {
      onNext(formData);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-800">Project Setup</CardTitle>
        <p className="text-slate-600">
          Configure project details that will be applied to all images in this batch. 
          You'll be prompted to select a storage location when saving the processed images.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="organisationName" className="text-sm text-slate-600">
              Organization Name *
            </Label>
            <Input
              id="organisationName"
              value={formData.organisationName}
              onChange={(e) => setFormData(prev => ({ ...prev, organisationName: e.target.value }))}
              placeholder="e.g., Metro Construction Ltd"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="projectName" className="text-sm text-slate-600">
              Project Name *
            </Label>
            <Input
              id="projectName"
              value={formData.projectName}
              onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
              placeholder="e.g., Pipeline Integrity Assessment 2025"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="inspectionStation" className="text-sm text-slate-600">
              Inspection Station *
            </Label>
            <Input
              id="inspectionStation"
              value={formData.inspectionStation}
              onChange={(e) => setFormData(prev => ({ ...prev, inspectionStation: e.target.value }))}
              placeholder="e.g., Station-A-012"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="cameraName" className="text-sm text-slate-600">
              Camera Name *
            </Label>
            <Input
              id="cameraName"
              value={formData.cameraName}
              onChange={(e) => setFormData(prev => ({ ...prev, cameraName: e.target.value }))}
              placeholder="e.g., CAM-THERMAL-05"
              className="mt-1"
              required
            />
          </div>
        </div>

        <div className="pt-6 border-t">
          <Button 
            onClick={handleNext}
            className="w-full bg-slate-800 hover:bg-slate-900"
            disabled={!formData.organisationName || !formData.projectName || !formData.inspectionStation || !formData.cameraName}
          >
            Next: Upload Images
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectSetup;

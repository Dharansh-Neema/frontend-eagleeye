import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProjectSetup from "@/components/classify/ProjectSetup";
import ObservationTemplates from "@/components/classify/ObservationTemplates";
import ImageUpload from "@/components/classify/ImageUpload";
import ImageCategorization from "@/components/classify/ImageCategorization";
import { ProjectData } from "@/lib/exifMetadataManager";

type ClassifyStep = 'project' | 'templates' | 'upload' | 'categorize';

const Classify = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<ClassifyStep>('project');
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [templates, setTemplates] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const steps = [
    { id: 'project', title: 'Project Setup', description: 'Configure project details' },
    { id: 'templates', title: 'Observation Templates', description: 'Define observation types' },
    { id: 'upload', title: 'Upload Images', description: 'Bulk image upload' },
    { id: 'categorize', title: 'Categorize Images', description: 'Add metadata to images' }
  ];

  const handleProjectSetup = (data: ProjectData) => {
    console.log('Classify - received project data:', data);
    setProjectData(data);
    setCurrentStep('templates');
  };

  const handleTemplatesSetup = (templateData: any) => {
    setTemplates(templateData);
    setCurrentStep('upload');
  };

  const handleImagesUploaded = (images: any) => {
    setUploadedImages(images);
    setCurrentStep('categorize');
  };

  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep);

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
            <h1 className="text-2xl font-bold">Classify New Images</h1>
            <p className="text-slate-300">Process new inspection images with metadata</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium ${
                  index <= getCurrentStepIndex() 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-slate-300 text-slate-400'
                }`}>
                  {index + 1}
                </div>
                <div className="ml-3">
                  <div className={`font-medium ${index <= getCurrentStepIndex() ? 'text-slate-800' : 'text-slate-400'}`}>
                    {step.title}
                  </div>
                  <div className="text-sm text-slate-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-8 ${
                    index < getCurrentStepIndex() ? 'bg-blue-600' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            {currentStep === 'project' && (
              <ProjectSetup onNext={handleProjectSetup} />
            )}
            {currentStep === 'templates' && (
              <ObservationTemplates 
                onNext={handleTemplatesSetup}
                onBack={() => setCurrentStep('project')}
              />
            )}
            {currentStep === 'upload' && projectData && (
              <ImageUpload 
                projectData={projectData}
                onNext={handleImagesUploaded}
                onBack={() => setCurrentStep('templates')}
              />
            )}
            {currentStep === 'categorize' && projectData && (
              <ImageCategorization 
                images={uploadedImages}
                templates={templates}
                projectData={projectData}
                onBack={() => setCurrentStep('upload')}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Classify;

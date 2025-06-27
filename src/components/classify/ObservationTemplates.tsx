
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

interface ObservationTemplate {
  id: string;
  name: string;
  type: 'string' | 'numeric' | 'boolean';
  defaultValue?: string | number | boolean;
}

interface ObservationTemplatesProps {
  onNext: (templates: ObservationTemplate[]) => void;
  onBack: () => void;
}

const ObservationTemplates = ({ onNext, onBack }: ObservationTemplatesProps) => {
  const [templates, setTemplates] = useState<ObservationTemplate[]>([
    { id: '1', name: 'Temperature Reading', type: 'numeric', defaultValue: 0 }
  ]);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'string' as 'string' | 'numeric' | 'boolean',
    defaultValue: ''
  });

  const addTemplate = () => {
    if (newTemplate.name) {
      const template: ObservationTemplate = {
        id: Date.now().toString(),
        name: newTemplate.name,
        type: newTemplate.type,
        defaultValue: newTemplate.defaultValue || undefined
      };
      setTemplates(prev => [...prev, template]);
      setNewTemplate({ name: '', type: 'string', defaultValue: '' });
    }
  };

  const removeTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleNext = () => {
    onNext(templates);
  };

  const getPlaceholderText = () => {
    switch (newTemplate.type) {
      case 'numeric':
        return 'e.g., 0';
      case 'boolean':
        return 'true or false';
      default:
        return 'e.g., Normal';
    }
  };

  return (
    <div>
      <CardHeader className="px-0 pb-6">
        <CardTitle className="text-2xl text-slate-800">Observation Templates</CardTitle>
        <p className="text-slate-600">
          Define custom observation types for this classification session
        </p>
      </CardHeader>

      <div className="space-y-6">
        {/* Current Templates */}
        <div>
          <Label className="text-base font-medium text-slate-700 mb-3 block">
            Current Observation Templates
          </Label>
          <div className="space-y-3">
            {templates.map((template) => (
              <Card key={template.id} className="border border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-slate-800">{template.name}</div>
                      <div className="text-sm text-slate-500">
                        Type: {template.type}
                        {template.defaultValue !== undefined && (
                          <span> • Default: {template.defaultValue.toString()}</span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTemplate(template.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Add New Template */}
        <Card className="border-2 border-dashed border-slate-300">
          <CardHeader>
            <CardTitle className="text-lg">Add New Observation Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="templateName" className="text-sm text-slate-600">
                Observation Name
              </Label>
              <Input
                id="templateName"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Leak Detected, Pressure Reading"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="templateType" className="text-sm text-slate-600">
                Data Type
              </Label>
              <Select value={newTemplate.type} onValueChange={(value: 'string' | 'numeric' | 'boolean') => 
                setNewTemplate(prev => ({ ...prev, type: value }))
              }>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">Text (String)</SelectItem>
                  <SelectItem value="numeric">Number (Numeric)</SelectItem>
                  <SelectItem value="boolean">True/False (Boolean)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="defaultValue" className="text-sm text-slate-600">
                Default Value (Optional)
              </Label>
              <Input
                id="defaultValue"
                value={newTemplate.defaultValue}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, defaultValue: e.target.value }))}
                placeholder={getPlaceholderText()}
                className="mt-1"
              />
            </div>

            <Button onClick={addTemplate} className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Template
            </Button>
          </CardContent>
        </Card>

        <div className="pt-6 border-t flex justify-between">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Project Setup
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            disabled={templates.length === 0}
          >
            Continue to Upload
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ObservationTemplates;

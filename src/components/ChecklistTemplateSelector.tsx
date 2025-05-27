
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Shield, Flame, Wrench, Users, FileText } from 'lucide-react';

export interface ChecklistTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  standards: string[];
  questionCount: number;
  icon: React.ReactNode;
}

const CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
  {
    id: 'fire-safety',
    name: 'Fire Safety Inspection',
    description: 'Comprehensive fire safety equipment and procedures checklist',
    category: 'Safety',
    standards: ['SOLAS', 'ISM Code'],
    questionCount: 45,
    icon: <Flame className="h-5 w-5" />
  },
  {
    id: 'equipment-maintenance',
    name: 'Equipment Maintenance',
    description: 'Engine room and deck equipment maintenance verification',
    category: 'Technical',
    standards: ['DNV', 'ISM Code'],
    questionCount: 62,
    icon: <Wrench className="h-5 w-5" />
  },
  {
    id: 'crew-quarters',
    name: 'Crew Quarters & Welfare',
    description: 'Living conditions and crew welfare facilities inspection',
    category: 'Welfare',
    standards: ['MLC', 'SOLAS'],
    questionCount: 38,
    icon: <Users className="h-5 w-5" />
  },
  {
    id: 'safety-management',
    name: 'Safety Management System',
    description: 'ISM Code compliance and safety management procedures',
    category: 'Management',
    standards: ['ISM Code', 'ISPS Code'],
    questionCount: 55,
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 'general-inspection',
    name: 'General Inspection',
    description: 'Basic multi-category inspection for routine surveys',
    category: 'General',
    standards: ['SOLAS', 'DNV'],
    questionCount: 30,
    icon: <CheckSquare className="h-5 w-5" />
  },
  {
    id: 'custom',
    name: 'Custom Checklist',
    description: 'Create your own checklist or start from blank template',
    category: 'Custom',
    standards: ['Custom'],
    questionCount: 0,
    icon: <FileText className="h-5 w-5" />
  }
];

interface ChecklistTemplateSelectorProps {
  onSelect: (template: ChecklistTemplate) => void;
  selectedTemplate?: string;
}

const ChecklistTemplateSelector: React.FC<ChecklistTemplateSelectorProps> = ({
  onSelect,
  selectedTemplate
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Checklist Template</h3>
        <p className="text-gray-600 text-sm">
          Choose a checklist template based on your survey requirements and compliance standards.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CHECKLIST_TEMPLATES.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelect(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {template.icon}
                  <CardTitle className="text-sm font-medium">
                    {template.name}
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-3">
                {template.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Questions:</span>
                  <span className="font-medium">
                    {template.questionCount > 0 ? template.questionCount : 'Custom'}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {template.standards.map((standard) => (
                    <Badge 
                      key={standard} 
                      variant="secondary" 
                      className="text-xs px-2 py-0.5"
                    >
                      {standard}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {selectedTemplate === template.id && (
                <Button 
                  size="sm" 
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                >
                  Selected
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChecklistTemplateSelector;
export { CHECKLIST_TEMPLATES };

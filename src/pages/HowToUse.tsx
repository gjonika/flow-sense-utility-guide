
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import MainHeader from '@/components/MainHeader';
import { 
  Ship, 
  CheckCircle, 
  MapPin, 
  AlertTriangle, 
  Plane, 
  Camera, 
  BarChart3,
  Plus,
  Clock,
  FileText,
  Users,
  Settings,
  Zap,
  Target,
  Upload
} from 'lucide-react';

const HowToUse = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const quickTips = [
    { icon: Ship, title: "Start with Survey Setup", description: "Always begin with client and vessel information" },
    { icon: CheckCircle, title: "Checklist First", description: "Complete checklist before detailed estimator work" },
    { icon: MapPin, title: "Zone-Based Estimator", description: "Select zone before adding assessment items" },
    { icon: AlertTriangle, title: "Priority Review", description: "Use for pre-survey quality assurance" },
    { icon: Camera, title: "Photo Everything", description: "Attach media evidence to support findings" },
    { icon: BarChart3, title: "Track Progress", description: "Monitor completion via dashboard analytics" }
  ];

  const guideSection = [
    {
      id: 'survey-setup',
      title: 'Survey Setup',
      icon: FileText,
      description: 'Getting started with a new survey',
      content: {
        overview: 'Survey setup is the foundation of your assessment. Proper initial configuration ensures smooth data collection.',
        steps: [
          {
            title: 'Create New Survey',
            details: 'Click "New Survey" from main navigation or dashboard. This opens the survey form wizard.'
          },
          {
            title: 'Client Information',
            details: 'Enter client details first: Company name, country/HQ location, and contact information. This establishes the business context.'
          },
          {
            title: 'Survey Details',
            details: 'Add survey-specific info: Ship name, survey location, date, duration, and project scope. These fields drive the assessment workflow.'
          },
          {
            title: 'Required Fields',
            details: 'Survey title, client name, and survey date are mandatory. Other fields enhance reporting but are optional.'
          }
        ],
        bestPractices: [
          'Always save draft surveys if interrupted',
          'Use descriptive survey titles for easy identification',
          'Verify client contact details for final reporting'
        ]
      }
    },
    {
      id: 'checklist',
      title: 'Checklist',
      icon: CheckCircle,
      description: 'Systematic inspection workflow',
      content: {
        overview: 'The checklist provides structured inspection guidance with standardized questions and response options.',
        steps: [
          {
            title: 'Response Options',
            details: 'Mark items as Yes (compliant), No (non-compliant), Skipped (unable to assess), or N/A (not applicable to this vessel).'
          },
          {
            title: 'Progress Logic',
            details: 'Completion percentage updates automatically. All questions must be answered to achieve 100% completion.'
          },
          {
            title: 'Media Evidence',
            details: 'Attach photos to support findings, especially for "No" responses that require follow-up action.'
          },
          {
            title: 'Category Navigation',
            details: 'Use category accordion to jump between inspection areas. Progress is saved automatically.'
          }
        ],
        bestPractices: [
          'Take photos for any non-compliant findings',
          'Use "Skipped" sparingly - try to assess when possible',
          'Complete entire categories before moving on'
        ]
      }
    },
    {
      id: 'estimator',
      title: 'Estimator',
      icon: MapPin,
      description: 'Zone-based assessment and material estimation',
      content: {
        overview: 'The Estimator follows a zone-first approach, organizing all assessment items by specific ship locations.',
        steps: [
          {
            title: 'Zone Selection',
            details: 'Always select a zone first from the dropdown. All assessment items are tied to specific ship locations.'
          },
          {
            title: 'Assessment Cards',
            details: 'Fill out material type, planned materials, quantities, and action required for each item. Status tracks completion.'
          },
          {
            title: 'Dimensional Rules',
            details: 'For flooring: enter length × width in meters. For other items: specify quantity, area, or linear measurements as appropriate.'
          },
          {
            title: 'Add Items',
            details: 'Use "+ Add Assessment Item" to create custom entries for items not in the standard categories.'
          },
          {
            title: 'Early Procurement',
            details: 'Toggle "Mark for Early Procurement" for items requiring advance ordering due to lead times.'
          }
        ],
        bestPractices: [
          'Create zones before starting assessments',
          'Group similar work by location for efficiency',
          'Be specific with material descriptions',
          'Mark long-lead items for early procurement'
        ]
      }
    },
    {
      id: 'priority-review',
      title: 'Priority Review',
      icon: AlertTriangle,
      description: 'Pre-survey quality assurance',
      content: {
        overview: 'Priority Review helps validate assessment quality before finalizing estimates, focusing on high-impact items.',
        steps: [
          {
            title: 'Pre-Survey Logic',
            details: 'This tab appears after initial assessments are complete, highlighting items requiring additional attention.'
          },
          {
            title: 'Review Status',
            details: 'Mark items as "Confirmed" (ready for estimate) or "Needs Attention" (requires additional review or information).'
          },
          {
            title: 'Quality Improvement',
            details: 'Items marked "Needs Attention" should be revisited with additional photos, measurements, or notes.'
          }
        ],
        bestPractices: [
          'Review all high-value items thoroughly',
          'Add detailed notes for complex assessments',
          'Confirm measurements for large areas'
        ]
      }
    },
    {
      id: 'travel',
      title: 'Travel',
      icon: Plane,
      description: 'Journey tracking and logistics',
      content: {
        overview: 'Travel section tracks surveyor journey times and logistics for accurate project costing.',
        steps: [
          {
            title: 'Outbound Journey',
            details: 'Record departure time, travel method, and arrival at survey location.'
          },
          {
            title: 'Return Journey',
            details: 'Log completion time and return travel details for complete trip documentation.'
          },
          {
            title: 'Sync Rules',
            details: 'Travel times sync with surveyor records for payroll and project cost tracking.'
          }
        ],
        bestPractices: [
          'Record actual travel times, not scheduled times',
          'Include any delays or route changes',
          'Verify times before survey completion'
        ]
      }
    },
    {
      id: 'notes-media',
      title: 'Notes & Media',
      icon: Camera,
      description: 'Documentation and evidence management',
      content: {
        overview: 'Comprehensive documentation through photos, notes, and zone-specific evidence collection.',
        steps: [
          {
            title: 'Photo Management',
            details: 'Attach photos to specific zones and categories. Use clear, well-lit images that show the full context.'
          },
          {
            title: 'Zone Notes',
            details: 'Add detailed notes by zone/category to provide context that photos cannot capture.'
          },
          {
            title: 'Offline/Online Sync',
            details: 'Media captured offline syncs automatically when connection is restored. Check sync status in settings.'
          }
        ],
        bestPractices: [
          'Take multiple angles for complex areas',
          'Include reference objects for scale',
          'Write descriptive notes while fresh in memory'
        ]
      }
    },
    {
      id: 'dashboards',
      title: 'Dashboards',
      icon: BarChart3,
      description: 'Progress monitoring and analytics',
      content: {
        overview: 'Three dashboard views provide different perspectives on survey progress and project management.',
        steps: [
          {
            title: 'Overview Dashboard',
            details: 'Shows current survey status, recent activity, and quick access to active projects.'
          },
          {
            title: 'Analytics View',
            details: 'Provides completion metrics, progress charts, and performance indicators across all surveys.'
          },
          {
            title: 'Projects View',
            details: 'Lists all surveys with filtering and sorting options. Best for project management overview.'
          }
        ],
        bestPractices: [
          'Check progress regularly during surveys',
          'Use analytics to identify bottlenecks',
          'Review project status before client meetings'
        ]
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Use Survey Dashboard</h1>
          <p className="text-lg text-gray-600">
            Complete guide to field surveying, assessment workflow, and data management
          </p>
        </div>

        {/* Quick Tips Panel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickTips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Icon className="h-5 w-5 text-blue-600 shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm text-gray-900">{tip.title}</h4>
                      <p className="text-xs text-gray-600">{tip.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Guide Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detailed Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
              {guideSection.map((section) => {
                const Icon = section.icon;
                return (
                  <AccordionItem key={section.id} value={section.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{section.title}</h3>
                          <p className="text-sm text-gray-600">{section.description}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="space-y-6">
                        {/* Overview */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Overview</h4>
                          <p className="text-gray-600">{section.content.overview}</p>
                        </div>

                        {/* Steps */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Step-by-Step Process</h4>
                          <div className="space-y-3">
                            {section.content.steps.map((step, index) => (
                              <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                <Badge variant="outline" className="shrink-0">
                                  {index + 1}
                                </Badge>
                                <div>
                                  <h5 className="font-medium text-sm text-gray-900 mb-1">{step.title}</h5>
                                  <p className="text-sm text-gray-600">{step.details}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Best Practices */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Best Practices</h4>
                          <ul className="space-y-2">
                            {section.content.bestPractices.map((practice, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Target className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-600">{practice}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="mt-8">
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Additional Help?</h3>
            <p className="text-gray-600 mb-4">
              For technical support or detailed training, contact your system administrator
            </p>
            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                <Users className="h-4 w-4 mr-1" />
                Training Available
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <Settings className="h-4 w-4 mr-1" />
                Technical Support
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HowToUse;

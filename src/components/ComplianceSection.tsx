
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Info, Ship } from 'lucide-react';
import { SurveyZone } from '@/types/survey';

interface ComplianceSectionProps {
  surveyId: string;
  zones: SurveyZone[];
}

const COMPLIANCE_STANDARDS = [
  {
    id: 'solas',
    name: 'SOLAS (Safety of Life at Sea)',
    description: 'International maritime safety regulations',
    status: 'pending',
    critical: true
  },
  {
    id: 'marpol',
    name: 'MARPOL (Marine Pollution)',
    description: 'Prevention of pollution from ships',
    status: 'compliant',
    critical: false
  },
  {
    id: 'dnv',
    name: 'DNV Classification',
    description: 'Det Norske Veritas standards',
    status: 'review_required',
    critical: true
  },
  {
    id: 'flag_state',
    name: 'Flag State Requirements',
    description: 'Country-specific maritime regulations',
    status: 'pending',
    critical: false
  },
  {
    id: 'port_state',
    name: 'Port State Control',
    description: 'Port authority inspection requirements',
    status: 'compliant',
    critical: false
  }
];

const ComplianceSection = ({ surveyId, zones }: ComplianceSectionProps) => {
  const [complianceData, setComplianceData] = useState(COMPLIANCE_STANDARDS);
  const [isOnline] = useState(navigator.onLine);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'review_required':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string, critical: boolean) => {
    if (critical && status !== 'compliant') {
      return 'bg-red-100 text-red-800';
    }
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'review_required':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const criticalIssues = complianceData.filter(item => item.critical && item.status !== 'compliant');
  const compliantCount = complianceData.filter(item => item.status === 'compliant').length;

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      {!isOnline && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You're currently offline. Compliance data will sync when connection is restored.
          </AlertDescription>
        </Alert>
      )}

      {/* Critical Issues Alert */}
      {criticalIssues.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{criticalIssues.length} critical compliance issue(s)</strong> require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Compliance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Ship className="h-5 w-5" />
            Maritime Compliance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{compliantCount}</div>
              <div className="text-sm text-gray-600">Compliant Standards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {complianceData.filter(item => item.status === 'review_required').length}
              </div>
              <div className="text-sm text-gray-600">Need Review</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {complianceData.filter(item => item.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Assessment</div>
            </div>
          </div>

          <div className="space-y-3">
            {complianceData.map((standard) => (
              <div key={standard.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  {getStatusIcon(standard.status)}
                  <div>
                    <h4 className="font-medium text-gray-900">{standard.name}</h4>
                    <p className="text-sm text-gray-600">{standard.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {standard.critical && (
                    <Badge variant="destructive" className="text-xs">Critical</Badge>
                  )}
                  <Badge className={getStatusColor(standard.status, standard.critical)}>
                    {standard.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Zone-Specific Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700">Zone-Specific Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          {zones.length > 0 ? (
            <div className="space-y-3">
              {zones.map((zone) => (
                <div key={zone.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{zone.zone_name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{zone.zone_type.replace('_', ' ')}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    Assessment Pending
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Ship className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No zones defined for compliance assessment</p>
              <p className="text-sm">Add zones to perform zone-specific compliance checks</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceSection;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, FileDown, MapPin, Package, AlertCircle } from 'lucide-react';
import { useAssessmentItems } from '@/hooks/useAssessmentItems';
import { SurveyZone } from '@/types/survey';
import { AssessmentItem } from '@/types/assessment';

interface EstimatorSummaryContentProps {
  surveyId: string;
  zones: SurveyZone[];
}

const EstimatorSummaryContent = ({ surveyId, zones }: EstimatorSummaryContentProps) => {
  const { assessmentItems, loading } = useAssessmentItems(surveyId);
  const [expandedZones, setExpandedZones] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleZone = (zoneId: string) => {
    setExpandedZones(prev => 
      prev.includes(zoneId) 
        ? prev.filter(id => id !== zoneId)
        : [...prev, zoneId]
    );
  };

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryKey) 
        ? prev.filter(key => key !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  const getZoneName = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return 'General Assessment';
    
    let name = zone.zone_name;
    const metadata = zone.zone_metadata || {};
    const locationParts = [];
    
    if (metadata.deckNumber) locationParts.push(`Deck ${metadata.deckNumber}`);
    if (metadata.shipSection) locationParts.push(metadata.shipSection);
    if (metadata.shipSide) locationParts.push(metadata.shipSide);
    if (metadata.frameRange) locationParts.push(`Frame ${metadata.frameRange}`);
    
    if (locationParts.length > 0) {
      name += ` (${locationParts.join(', ')})`;
    }
    
    return name;
  };

  const formatCategory = (category: string): string => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDimensions = (item: AssessmentItem): string => {
    if (!item.dimensions) return '';
    const { width, height, length, area } = item.dimensions;
    const parts = [];
    
    if (width) parts.push(`W:${width}cm`);
    if (height) parts.push(`H:${height}cm`);
    if (length) parts.push(`L:${length}cm`);
    if (area) parts.push(`Area:${area}m²`);
    
    return parts.join(' × ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requires_attention': return 'destructive';
      case 'noted': return 'default';
      case 'not_applicable': return 'secondary';
      default: return 'outline';
    }
  };

  const getActionColor = (action?: string) => {
    switch (action) {
      case 'replace': return 'destructive';
      case 'refurbish': return 'default';
      case 'reuse': return 'secondary';
      default: return 'outline';
    }
  };

  // Group items by zone and category
  const groupedItems = React.useMemo(() => {
    const groups: { [zoneId: string]: { [category: string]: AssessmentItem[] } } = {};
    
    assessmentItems.forEach(item => {
      // For now, using 'default' as zone since AssessmentItem doesn't have zone_id
      const zoneId = 'default';
      
      if (!groups[zoneId]) groups[zoneId] = {};
      if (!groups[zoneId][item.category]) groups[zoneId][item.category] = [];
      
      groups[zoneId][item.category].push(item);
    });
    
    return groups;
  }, [assessmentItems]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading estimator summary...</p>
        </div>
      </div>
    );
  }

  const totalItems = assessmentItems.length;
  const priorityItems = assessmentItems.filter(item => item.isPriority).length;
  const earlyProcurementItems = assessmentItems.filter(item => item.markForEarlyProcurement).length;

  return (
    <div className="space-y-6">
      {/* Header with export button */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Package className="h-5 w-5" />
                Estimator Summary Report
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Read-only view of all Estimator entries grouped by zone and category
              </p>
            </div>
            <Button variant="outline" disabled className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalItems}</div>
              <div className="text-sm text-blue-700">Total Items</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{priorityItems}</div>
              <div className="text-sm text-orange-700">Priority Items</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{earlyProcurementItems}</div>
              <div className="text-sm text-green-700">Early Procurement</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grouped Items Display */}
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([zoneId, categories]) => {
          const zoneName = getZoneName(zoneId);
          const isZoneExpanded = expandedZones.includes(zoneId);
          const zoneItemCount = Object.values(categories).flat().length;

          return (
            <Card key={zoneId} className="border-2">
              <Collapsible open={isZoneExpanded} onOpenChange={() => toggleZone(zoneId)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isZoneExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <div>
                          <CardTitle className="text-lg">{zoneName}</CardTitle>
                          <p className="text-sm text-gray-600">{zoneItemCount} items</p>
                        </div>
                      </div>
                      <Badge variant="outline">{Object.keys(categories).length} categories</Badge>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {Object.entries(categories).map(([category, items]) => {
                        const categoryKey = `${zoneId}-${category}`;
                        const isCategoryExpanded = expandedCategories.includes(categoryKey);

                        return (
                          <Card key={category} className="border">
                            <Collapsible open={isCategoryExpanded} onOpenChange={() => toggleCategory(categoryKey)}>
                              <CollapsibleTrigger asChild>
                                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors py-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      {isCategoryExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                      <h4 className="font-medium">{formatCategory(category)}</h4>
                                    </div>
                                    <Badge variant="secondary">{items.length} items</Badge>
                                  </div>
                                </CardHeader>
                              </CollapsibleTrigger>

                              <CollapsibleContent>
                                <CardContent className="pt-0">
                                  <div className="space-y-3">
                                    {items.map((item) => (
                                      <Card key={item.id} className="border-l-4 border-l-gray-300">
                                        <CardContent className="p-4">
                                          <div className="space-y-3">
                                            {/* Item Header */}
                                            <div className="flex items-start justify-between">
                                              <h5 className="font-medium text-gray-900">{item.question || item.description || 'Assessment Item'}</h5>
                                              <div className="flex gap-2">
                                                {item.isPriority && (
                                                  <Badge variant="destructive" className="flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    Priority
                                                  </Badge>
                                                )}
                                                {item.markForEarlyProcurement && (
                                                  <Badge variant="default">Early Procurement</Badge>
                                                )}
                                              </div>
                                            </div>

                                            {/* Item Details */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                              <div className="space-y-2">
                                                <div className="flex justify-between">
                                                  <span className="text-gray-600">Status:</span>
                                                  <Badge variant={getStatusColor(item.status)} className="text-xs">
                                                    {item.status.replace(/_/g, ' ')}
                                                  </Badge>
                                                </div>
                                                {item.actionRequired && (
                                                  <div className="flex justify-between">
                                                    <span className="text-gray-600">Action Required:</span>
                                                    <Badge variant={getActionColor(item.actionRequired)} className="text-xs">
                                                      {item.actionRequired}
                                                    </Badge>
                                                  </div>
                                                )}
                                                {item.plannedMaterial && (
                                                  <div className="flex justify-between">
                                                    <span className="text-gray-600">Planned Material:</span>
                                                    <span className="font-medium">{item.plannedMaterial}</span>
                                                  </div>
                                                )}
                                              </div>

                                              <div className="space-y-2">
                                                {formatDimensions(item) && (
                                                  <div className="flex justify-between">
                                                    <span className="text-gray-600">Dimensions:</span>
                                                    <span className="font-medium">{formatDimensions(item)}</span>
                                                  </div>
                                                )}
                                                {item.quantity && (
                                                  <div className="flex justify-between">
                                                    <span className="text-gray-600">Quantity:</span>
                                                    <span className="font-medium">{item.quantity}</span>
                                                  </div>
                                                )}
                                                {item.positionCode && (
                                                  <div className="flex justify-between">
                                                    <span className="text-gray-600">Position Code:</span>
                                                    <span className="font-medium">{item.positionCode}</span>
                                                  </div>
                                                )}
                                              </div>
                                            </div>

                                            {/* Flooring-specific fields */}
                                            {item.flooring?.levelingNeeded && (
                                              <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                                                <h6 className="font-medium text-yellow-800 mb-2">Flooring Requirements</h6>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                  <div className="flex justify-between">
                                                    <span className="text-yellow-700">Leveling Needed:</span>
                                                    <span className="font-medium">Yes</span>
                                                  </div>
                                                  {item.flooring.levelingMm && (
                                                    <div className="flex justify-between">
                                                      <span className="text-yellow-700">Leveling (mm):</span>
                                                      <span className="font-medium">{item.flooring.levelingMm}mm</span>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            )}

                                            {/* Notes */}
                                            {item.notes && (
                                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                <h6 className="font-medium text-gray-700 mb-1">Notes</h6>
                                                <p className="text-sm text-gray-600">{item.notes}</p>
                                              </div>
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </CardContent>
                              </CollapsibleContent>
                            </Collapsible>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {totalItems === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Estimator Data</h3>
            <p className="text-gray-500">
              No assessment items have been created yet. Use the Estimator tab to start adding items.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EstimatorSummaryContent;

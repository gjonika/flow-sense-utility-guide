
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, AlertTriangle, XCircle, Filter } from 'lucide-react';

interface PriorityItem {
  id: string;
  title: string;
  category: string;
  status: 'pending' | 'confirmed' | 'needs_attention' | 'not_applicable';
}

const PRIORITY_ITEMS: Omit<PriorityItem, 'status'>[] = [
  { id: '1', title: 'Wall Material & Insulation Assessment', category: 'STRUCTURE, FIRE BOUNDARIES & BULKHEADS' },
  { id: '2', title: 'Bulkhead Structure & Fireproofing', category: 'STRUCTURE, FIRE BOUNDARIES & BULKHEADS' },
  { id: '3', title: 'Ceiling Systems & Overhead Insulation', category: 'DECKHEADS' },
  { id: '4', title: 'Top Covering & Deck Insulation Assessment', category: 'DECK & FLOORING' },
  { id: '5', title: 'Subfloor Structure & Soundproofing', category: 'DECK & FLOORING' },
  { id: '6', title: 'Thermal bridging assessment', category: 'STRUCTURE, FIRE BOUNDARIES & BULKHEADS' },
  { id: '7', title: 'Bathroom Unit Configuration', category: 'PLUMBING SUPPLIES & WASTEAGE' },
  { id: '8', title: 'Toilets, Sinks & Shower Equipment', category: 'PLUMBING SUPPLIES & WASTEAGE' },
  { id: '9', title: 'Surface Finishes & Sealing', category: 'PAINTING & FINISHES' },
  { id: '10', title: 'Plumbing & Slope Analysis', category: 'PLUMBING SUPPLIES & WASTEAGE' },
  { id: '11', title: 'Safety & Emergency Systems', category: 'ELECTRICAL & LIGHTING' },
  { id: '12', title: 'Fire Detection & Security', category: 'ELECTRICAL & LIGHTING' },
  { id: '13', title: 'Fire-rated insulation compliance', category: 'STRUCTURE, FIRE BOUNDARIES & BULKHEADS' },
  { id: '14', title: 'Water Supply & Waste Systems', category: 'PLUMBING SUPPLIES & WASTEAGE' },
  { id: '15', title: 'Physical Access Limitations', category: 'EQUIPMENT' },
  { id: '16', title: 'Hazardous Materials Assessment', category: 'MISCELLANEOUS' },
  { id: '17', title: 'Safety Protocols & Restrictions', category: 'MISCELLANEOUS' },
  { id: '18', title: 'Regulatory Compliance Check', category: 'MISCELLANEOUS' },
];

const ESTIMATOR_CATEGORIES = [
  'All Categories',
  'DEMOLITION',
  'DECKHEADS', 
  'STRUCTURE, FIRE BOUNDARIES & BULKHEADS',
  'DOORS & WINDOWS',
  'DECK & FLOORING',
  'PAINTING & FINISHES',
  'ELECTRICAL & LIGHTING',
  'HVAC / MECHANICAL & PIPING',
  'PLUMBING SUPPLIES & WASTEAGE',
  'EQUIPMENT',
  'SIGNAGE',
  'ARTWORK',
  'AUDIO / VISUAL',
  'FIXED FURNITURE',
  'LOOSE FURNITURE',
  'SOFT FURNISHINGS',
  'WINDOW TREATMENT',
  'MISCELLANEOUS'
];

interface PriorityReviewContentProps {
  surveyId: string;
}

const PriorityReviewContent = ({ surveyId }: PriorityReviewContentProps) => {
  const [items, setItems] = useState<PriorityItem[]>(
    PRIORITY_ITEMS.map(item => ({ ...item, status: 'pending' as const }))
  );
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [showOnlyUnconfirmed, setShowOnlyUnconfirmed] = useState(false);

  const updateItemStatus = (id: string, status: PriorityItem['status']) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status } : item
    ));
  };

  const getStatusIcon = (status: PriorityItem['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'needs_attention':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'not_applicable':
        return <XCircle className="h-5 w-5 text-gray-400" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusColor = (status: PriorityItem['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'needs_attention':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'not_applicable':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const filteredItems = items.filter(item => {
    if (categoryFilter !== 'All Categories' && item.category !== categoryFilter) {
      return false;
    }
    if (showOnlyUnconfirmed && item.status === 'confirmed') {
      return false;
    }
    return true;
  });

  const stats = {
    total: items.length,
    confirmed: items.filter(item => item.status === 'confirmed').length,
    needsAttention: items.filter(item => item.status === 'needs_attention').length,
    notApplicable: items.filter(item => item.status === 'not_applicable').length,
    pending: items.filter(item => item.status === 'pending').length,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            🧠 Priority Review
          </h2>
          <p className="text-gray-600 mt-1">
            Pre-survey quality assurance checklist to ensure estimation accuracy
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <p className="text-sm text-gray-600">Total Items</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
              <p className="text-sm text-gray-600">Confirmed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.needsAttention}</div>
              <p className="text-sm text-gray-600">Needs Attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">{stats.notApplicable}</div>
              <p className="text-sm text-gray-600">N/A</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
              <p className="text-sm text-gray-600">Pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {ESTIMATOR_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            variant={showOnlyUnconfirmed ? "default" : "outline"}
            onClick={() => setShowOnlyUnconfirmed(!showOnlyUnconfirmed)}
            size="sm"
          >
            {showOnlyUnconfirmed ? "Show All" : "Only Unconfirmed"}
          </Button>
        </div>
      </div>

      {/* Priority Items List */}
      <div className="space-y-4">
        {filteredItems.map(item => (
          <Card key={item.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(item.status)}
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                      {item.status === 'pending' ? 'Pending Review' :
                       item.status === 'confirmed' ? 'Confirmed' :
                       item.status === 'needs_attention' ? 'Needs Attention' :
                       'Not Applicable'}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={item.status === 'confirmed' ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateItemStatus(item.id, 'confirmed')}
                    className="flex items-center gap-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Confirmed
                  </Button>
                  
                  <Button
                    variant={item.status === 'needs_attention' ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateItemStatus(item.id, 'needs_attention')}
                    className="flex items-center gap-1"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Needs Attention
                  </Button>
                  
                  <Button
                    variant={item.status === 'not_applicable' ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateItemStatus(item.id, 'not_applicable')}
                    className="flex items-center gap-1"
                  >
                    <XCircle className="h-4 w-4" />
                    N/A
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No items match the current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PriorityReviewContent;

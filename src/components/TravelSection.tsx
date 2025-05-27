import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plane, Hotel, Plus, X, Bell } from 'lucide-react';
import { Survey } from '@/types/survey';
import { StoredSurvey } from '@/types/storage';

interface TravelSectionProps {
  survey: Survey | StoredSurvey;
  onUpdate: (survey: Survey | StoredSurvey) => void;
}

interface TravelerInfo {
  surveyor: string;
  outbound_date?: string;
  return_date?: string;
  airline?: string;
  confirmation?: string;
  hotel_checkin?: string;
  hotel_checkout?: string;
  hotel_name?: string;
  hotel_confirmation?: string;
}

const TravelSection = ({ survey, onUpdate }: TravelSectionProps) => {
  // Get surveyors from Survey Details
  const surveyors = useMemo(() => {
    try {
      return survey.custom_fields?.surveyors ? JSON.parse(survey.custom_fields.surveyors) : [];
    } catch {
      return [];
    }
  }, [survey.custom_fields?.surveyors]);

  // Initialize travelers from travel data or create from surveyors
  const [travelers, setTravelers] = useState<TravelerInfo[]>(() => {
    const existingTravelers = survey.custom_fields?.travelers ? 
      JSON.parse(survey.custom_fields.travelers) : [];
    
    // If no travelers but we have surveyors, create travelers for each surveyor
    if (existingTravelers.length === 0 && surveyors.length > 0) {
      return surveyors.map((surveyor: string) => ({ surveyor }));
    }
    
    return existingTravelers.length > 0 ? existingTravelers : [{ surveyor: '' }];
  });

  const updateTravelers = (newTravelers: TravelerInfo[]) => {
    setTravelers(newTravelers);
    const updatedCustomFields = {
      ...survey.custom_fields,
      travelers: JSON.stringify(newTravelers)
    };
    onUpdate({
      ...survey,
      custom_fields: updatedCustomFields,
    });
  };

  const addTraveler = () => {
    const newTravelers = [...travelers, { surveyor: '' }];
    updateTravelers(newTravelers);
  };

  const removeTraveler = (index: number) => {
    const newTravelers = travelers.filter((_, i) => i !== index);
    updateTravelers(newTravelers);
  };

  const updateTraveler = (index: number, field: keyof TravelerInfo, value: string) => {
    const newTravelers = [...travelers];
    newTravelers[index] = { ...newTravelers[index], [field]: value };
    updateTravelers(newTravelers);
  };

  // Mock notification logic
  const getUpcomingNotifications = () => {
    const notifications = [];
    const today = new Date();
    
    travelers.forEach((traveler, index) => {
      if (traveler.outbound_date) {
        const outboundDate = new Date(traveler.outbound_date);
        const daysDiff = Math.ceil((outboundDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        
        if (daysDiff === 1) {
          notifications.push(`${traveler.surveyor || `Traveler ${index + 1}`}: Flight tomorrow`);
        } else if (daysDiff === 0) {
          notifications.push(`${traveler.surveyor || `Traveler ${index + 1}`}: Flight today`);
        }
      }
      
      if (traveler.hotel_checkin) {
        const checkinDate = new Date(traveler.hotel_checkin);
        const daysDiff = Math.ceil((checkinDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        
        if (daysDiff === 0) {
          notifications.push(`${traveler.surveyor || `Traveler ${index + 1}`}: Hotel check-in today`);
        }
      }
    });
    
    return notifications;
  };

  const notifications = getUpcomingNotifications();

  return (
    <div className="space-y-6">
      {/* Notifications Section */}
      {notifications.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Travel Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {notifications.map((notification, index) => (
                <Badge key={index} className="bg-yellow-100 text-yellow-800 mr-2 mb-2">
                  {notification}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-700 flex items-center">
              <Plane className="mr-2 h-5 w-5" />
              Travel Information
            </CardTitle>
            <Button onClick={addTraveler} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Traveler
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {travelers.map((traveler, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Traveler {index + 1}</h4>
                {travelers.length > 1 && (
                  <Button
                    onClick={() => removeTraveler(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label>Surveyor</Label>
                  <Select
                    value={traveler.surveyor}
                    onValueChange={(value) => updateTraveler(index, 'surveyor', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select surveyor" />
                    </SelectTrigger>
                    <SelectContent>
                      {surveyors.map((surveyor: string, idx: number) => (
                        <SelectItem key={idx} value={surveyor}>
                          {surveyor}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {traveler.surveyor === 'other' && (
                    <Input
                      className="mt-2"
                      placeholder="Enter name"
                      value={traveler.surveyor === 'other' ? '' : traveler.surveyor}
                      onChange={(e) => updateTraveler(index, 'surveyor', e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <Label>Outbound Date</Label>
                  <Input
                    type="date"
                    value={traveler.outbound_date || ''}
                    onChange={(e) => updateTraveler(index, 'outbound_date', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Return Date</Label>
                  <Input
                    type="date"
                    value={traveler.return_date || ''}
                    onChange={(e) => updateTraveler(index, 'return_date', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Airline</Label>
                  <Input
                    placeholder="e.g., Emirates, British Airways"
                    value={traveler.airline || ''}
                    onChange={(e) => updateTraveler(index, 'airline', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Flight Confirmation Number</Label>
                  <Input
                    placeholder="Flight confirmation number"
                    value={traveler.confirmation || ''}
                    onChange={(e) => updateTraveler(index, 'confirmation', e.target.value)}
                  />
                </div>
              </div>

              {/* Hotel Information */}
              <div className="border-t pt-4">
                <h5 className="font-medium mb-3 flex items-center">
                  <Hotel className="mr-2 h-4 w-4" />
                  Hotel Information
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label>Hotel Name</Label>
                    <Input
                      placeholder="Hotel name"
                      value={traveler.hotel_name || ''}
                      onChange={(e) => updateTraveler(index, 'hotel_name', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Check-in Date</Label>
                    <Input
                      type="date"
                      value={traveler.hotel_checkin || ''}
                      onChange={(e) => updateTraveler(index, 'hotel_checkin', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Check-out Date</Label>
                    <Input
                      type="date"
                      value={traveler.hotel_checkout || ''}
                      onChange={(e) => updateTraveler(index, 'hotel_checkout', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Hotel Confirmation Number</Label>
                    <Input
                      placeholder="Hotel confirmation number"
                      value={traveler.hotel_confirmation || ''}
                      onChange={(e) => updateTraveler(index, 'hotel_confirmation', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {surveyors.length === 0 && (
            <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded border">
              💡 Tip: Add surveyors in the "Survey Details" section to automatically populate the traveler dropdown.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TravelSection;

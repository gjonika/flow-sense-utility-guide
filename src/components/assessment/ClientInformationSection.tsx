
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { Survey, ClientContact } from '@/types/survey';

interface ClientInformationSectionProps {
  survey: Survey;
  onUpdate: (field: string, value: string) => void;
  onMainFieldUpdate: (field: keyof Survey, value: string) => void;
  onClientContactsUpdate: (contacts: ClientContact[]) => void;
}

const ClientInformationSection = ({ survey, onUpdate, onMainFieldUpdate, onClientContactsUpdate }: ClientInformationSectionProps) => {
  const handleContactUpdate = (contactIndex: number, field: keyof ClientContact, value: string) => {
    console.log('[ClientInformationSection] Updating contact:', { contactIndex, field, value });
    const updatedContacts = [...(survey.client_contacts || [])];
    if (updatedContacts[contactIndex]) {
      updatedContacts[contactIndex] = { ...updatedContacts[contactIndex], [field]: value };
    }
    console.log('[ClientInformationSection] Updated contacts:', updatedContacts);
    onClientContactsUpdate(updatedContacts);
  };

  const addContact = () => {
    console.log('[ClientInformationSection] Adding new contact');
    const newContact: ClientContact = { name: '', email: '', phone: '', role: '' };
    const updatedContacts = [...(survey.client_contacts || []), newContact];
    onClientContactsUpdate(updatedContacts);
  };

  const removeContact = (contactIndex: number) => {
    console.log('[ClientInformationSection] Removing contact at index:', contactIndex);
    const updatedContacts = survey.client_contacts?.filter((_, i) => i !== contactIndex) || [];
    onClientContactsUpdate(updatedContacts);
  };

  return (
    <div>
      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <User className="h-4 w-4" />
        Client Information
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            value={survey.client_name || ''}
            onChange={(e) => onMainFieldUpdate('client_name', e.target.value)}
            placeholder="Client company name"
          />
        </div>
        
        <div>
          <Label htmlFor="clientCountry">Client HQ Country</Label>
          <Input
            id="clientCountry"
            value={survey.client_country || ''}
            onChange={(e) => onMainFieldUpdate('client_country', e.target.value)}
            placeholder="Client headquarters country"
          />
        </div>
      </div>

      {/* Client Contacts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium">Client Contacts</Label>
          <Button 
            type="button" 
            variant="outline"
            onClick={addContact}
          >
            Add Contact
          </Button>
        </div>
        
        {survey.client_contacts && survey.client_contacts.length > 0 ? (
          <div className="space-y-3">
            {survey.client_contacts.map((contact, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3 bg-gray-50 rounded border">
                <div>
                  <Label className="text-xs">Name</Label>
                  <Input
                    placeholder="Contact name"
                    value={contact.name || ''}
                    onChange={(e) => handleContactUpdate(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Role/Occupation</Label>
                  <Input
                    placeholder="Role"
                    value={contact.role || ''}
                    onChange={(e) => handleContactUpdate(index, 'role', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input
                    placeholder="Email"
                    type="email"
                    value={contact.email || ''}
                    onChange={(e) => handleContactUpdate(index, 'email', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Phone</Label>
                  <Input
                    placeholder="Phone"
                    value={contact.phone || ''}
                    onChange={(e) => handleContactUpdate(index, 'phone', e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeContact(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded border">
            No client contacts added yet. Click "Add Contact" to add contact information.
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientInformationSection;

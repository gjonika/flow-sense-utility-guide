
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClientContact } from "@/types/survey";
import ClientContactsForm from "../ClientContactsForm";

interface ClientInformationSectionProps {
  clientName: string;
  clientCountry: string;
  clientContacts: ClientContact[];
  onClientNameChange: (value: string) => void;
  onClientCountryChange: (value: string) => void;
  onClientContactsChange: (contacts: ClientContact[]) => void;
}

const ClientInformationSection = ({
  clientName,
  clientCountry,
  clientContacts,
  onClientNameChange,
  onClientCountryChange,
  onClientContactsChange,
}: ClientInformationSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-700 text-lg sm:text-xl">Client Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => onClientNameChange(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="clientCountry">Client HQ Country</Label>
            <Input
              id="clientCountry"
              value={clientCountry}
              onChange={(e) => onClientCountryChange(e.target.value)}
              required
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <Label className="text-base font-medium">Client Contacts</Label>
          <div className="mt-2">
            <ClientContactsForm
              contacts={clientContacts}
              onChange={onClientContactsChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInformationSection;

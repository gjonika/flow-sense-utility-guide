
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import { SORT_OPTIONS, SortOption } from "@/utils/surveySorting";

interface SurveySortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SurveySortDropdown = ({ value, onChange }: SurveySortDropdownProps) => {
  const currentOption = SORT_OPTIONS.find(option => option.value === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-48">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          <SelectValue placeholder="Sort surveys">
            {currentOption?.label}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex flex-col">
              <span className="font-medium">{option.label}</span>
              <span className="text-xs text-gray-500">{option.description}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SurveySortDropdown;

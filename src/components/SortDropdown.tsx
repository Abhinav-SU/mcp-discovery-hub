import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption } from "@/pages/Index";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SortDropdown = ({ value, onChange }: SortDropdownProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={value} onValueChange={(val) => onChange(val as SortOption)}>
        <SelectTrigger className="w-[180px] bg-card border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card border-border z-50">
          <SelectItem value="popular">Most Popular</SelectItem>
          <SelectItem value="recent">Recently Updated</SelectItem>
          <SelectItem value="alphabetical">A-Z</SelectItem>
          <SelectItem value="rating">Highest Rated</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortDropdown;

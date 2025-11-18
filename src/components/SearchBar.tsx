import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative max-w-2xl mx-auto px-4">
      <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
      <Input
        type="text"
        placeholder="Search MCP servers..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 h-14 text-lg bg-card border-border focus-visible:ring-primary"
      />
    </div>
  );
};

export default SearchBar;

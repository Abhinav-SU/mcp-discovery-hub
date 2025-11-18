import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface HeaderProps {
  onSubmitClick: () => void;
}

const Header = ({ onSubmitClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">MCP</span>
          </div>
          <span className="text-xl font-bold text-foreground hidden sm:inline">MCP Hub</span>
        </div>
        
        <Button onClick={onSubmitClick} className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Submit MCP</span>
          <span className="sm:hidden">Submit</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;

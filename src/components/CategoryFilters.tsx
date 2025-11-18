import { Badge } from "@/components/ui/badge";

const categories = ["All", "Development", "Data & APIs", "Productivity", "Cloud", "Databases"];

interface CategoryFiltersProps {
  selected: string;
  onSelect: (category: string) => void;
}

const CategoryFilters = ({ selected, onSelect }: CategoryFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center px-4 py-6">
      {categories.map((category) => (
        <Badge
          key={category}
          variant={selected === category ? "default" : "secondary"}
          className={`cursor-pointer px-4 py-2 text-sm transition-smooth ${
            selected === category
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "hover:bg-secondary/80"
          }`}
          onClick={() => onSelect(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
};

export default CategoryFilters;

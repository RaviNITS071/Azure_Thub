import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * FilterBar Component
 * Captures user input to query the backend database effectively.
 * 
 * @param {Object} filters - The current active filters (search keyword, tender type, etc.)
 * @param {Function} setFilters - Function to update the filters state, which triggers a refetch in useTenders
 */
export function FilterBar({ filters, setFilters }) {
  
  // Update specific filter fields without overwriting the others
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm mb-8 flex flex-col sm:flex-row gap-4 items-center">
      
      {/* Search Input Field */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search tenders by keyword, authority, or location..." 
          className="pl-9 w-full bg-background"
          value={filters.search || ""}
          // Debouncing (delaying API call while typing) should ideally be handled in the parent or custom hook
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>

      {/* Tender Type Dropdown */}
      <div className="w-full sm:w-[200px]">
        <Select 
          value={filters.type || "all"} 
          onValueChange={(value) => handleFilterChange("type", value === "all" ? "" : value)}
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Tender Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Govt">Government</SelectItem>
            <SelectItem value="Private">Private</SelectItem>
            <SelectItem value="PSU">PSU / Corporate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Additional Filters Button (Can open a modal/sidebar later) */}
      <Button variant="outline" className="w-full sm:w-auto gap-2">
        <SlidersHorizontal className="h-4 w-4" />
        More Filters
      </Button>

    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

/**
 * PaginationControls Component
 * Provides full navigation (First, Prev, Next, Last, Jump) for paginated datasets.
 */
export function PaginationControls({ currentPage, totalPages, onPageChange }) {
  const [jumpPage, setJumpPage] = useState("");

  // Handle the 'Jump to page' submission
  const handleJump = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPage, 10);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpPage("");
    }
  };

  // Don't render pagination if there's only 1 page or no data
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-border/40">
      
      {/* Page Info */}
      <div className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{currentPage}</span> of <span className="font-medium text-foreground">{totalPages}</span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => onPageChange(1)} disabled={currentPage === 1} title="First Page">
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} title="Previous Page">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} title="Next Page">
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="icon" onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} title="Last Page">
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Jump Input */}
      <form onSubmit={handleJump} className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground hidden sm:inline-block">Go to:</span>
        <Input 
          type="number" 
          min="1" 
          max={totalPages} 
          value={jumpPage} 
          onChange={(e) => setJumpPage(e.target.value)}
          className="w-16 h-9 text-center bg-background"
          placeholder="#"
        />
        <Button type="submit" variant="secondary" size="sm" disabled={!jumpPage}>
          Jump
        </Button>
      </form>
    </div>
  );
}
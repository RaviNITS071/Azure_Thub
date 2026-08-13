import { MapPin, Heart, Download, Megaphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Horizontal TenderCard Component
 * Redesigned to match enterprise list-based UI patterns.
 */
export function TenderCard({ title, authority, location, closingDate, tenderValue, type, tenderUrl }) {
  
  // Format the date to match the "DD/MM/YYYY" format from the reference image
  const formattedDate = new Date(closingDate).toLocaleDateString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  return (
    <Card className="flex flex-col p-5 bg-background border-border hover:shadow-md transition-shadow duration-300 w-full mb-4">
      
      {/* --- Top Row: Authority & Highlight Tags --- */}
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <h3 className="font-bold text-base text-foreground tracking-tight">
          {authority || "Unknown Authority"}
        </h3>
        
        {/* Yellow styling for Type tags */}
        <Badge variant="outline" className="border-yellow-400 text-yellow-700 bg-yellow-50 rounded px-2 py-0.5 text-xs font-normal">
          {type || "Works"}
        </Badge>
        <Badge variant="outline" className="border-yellow-400 text-yellow-700 bg-yellow-50 rounded px-2 py-0.5 text-xs font-normal flex items-center gap-1">
          <Megaphone className="w-3 h-3" /> Corrigendum
        </Badge>
      </div>

      {/* --- Middle Row: Description & Stat Boxes --- */}
      <div className="flex flex-col md:flex-row justify-between gap-6 mb-4">
        
        {/* Tender Title / Description */}
        <p className="text-muted-foreground text-sm flex-1 leading-relaxed line-clamp-3 md:line-clamp-2">
          {title || "Untitled Tender Document"}
        </p>

        {/* Amount & Date Boxes (Right Aligned) */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Green Amount Box */}
          <div className="border border-green-200 bg-green-50/40 rounded-md px-3 py-1.5 flex flex-col items-center justify-center min-w-[100px]">
            <span className="text-[11px] text-green-600 font-medium">Amount</span>
            <span className="text-sm font-semibold text-foreground">
              {tenderValue ? `₹${tenderValue}` : "N/A"}
            </span>
          </div>

          {/* Red/Pink Closing Date Box */}
          <div className="border border-rose-200 bg-rose-50/40 rounded-md px-3 py-1.5 flex flex-col items-center justify-center min-w-[100px]">
            <span className="text-[11px] text-rose-500 font-medium">Closing date</span>
            <span className="text-sm font-semibold text-foreground">{formattedDate}</span>
          </div>

        </div>
      </div>

      {/* --- Bottom Row: Location, Categories & Action Buttons --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-1">
        
        {/* Tags Section */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Location Badge */}
          <Badge variant="outline" className="rounded-full font-normal text-muted-foreground border-border/80 flex items-center gap-1 px-3 py-1">
            <MapPin className="w-3.5 h-3.5" /> {location || "India"}
          </Badge>
          
          {/* Extra Category Tags (You can map these dynamically from backend data later) */}
          <Badge variant="outline" className="rounded-full font-normal text-purple-700 border-purple-200 bg-purple-50/50 px-3 py-1">
            Drilling Work
          </Badge>
          <Badge variant="outline" className="rounded-full font-normal text-emerald-700 border-emerald-200 bg-emerald-50/50 px-3 py-1">
            Construction
          </Badge>
          <Badge variant="outline" className="rounded-full font-normal text-orange-700 border-orange-200 bg-orange-50/50 px-3 py-1">
            GEM
          </Badge>
        </div>

        {/* Action Buttons Section */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Ghost Follow Button */}
          <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium gap-2 hidden sm:flex">
            Follow <Heart className="w-4 h-4" />
          </Button>
          
          {/* Primary Solid Download Button */}
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto gap-2 shadow-sm"
            onClick={() => window.open(tenderUrl, "_blank")}
          >
            Download All <Download className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </Card>
  );
}
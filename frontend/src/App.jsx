import { useState, useEffect } from "react";
import { Navbar } from "./components/shared/Navbar";
import { StatsSection } from "./components/shared/StatsSection";
import { FilterBar } from "./components/shared/FilterBar";
import { TenderCard } from "./components/shared/TenderCard";
import { PaginationControls } from "./components/shared/PaginationControls";
import { useTenders } from "./hooks/useTenders";

export default function App() {
  const [filters, setFilters] = useState({
    search: "",
    type: "",
  });

  // 1. Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // 2. Reset to page 1 whenever a user types a new search or changes the filter
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // 3. Map frontend state to backend requirements and inject pagination limits
  const apiQuery = {
    search: filters.search,
    category: filters.type, // Map 'type' to 'category' for backend compatibility
    page: currentPage,
    limit: itemsPerPage
  };

  const { data, isLoading, isError, error } = useTenders(apiQuery);
  
  const tenders = data?.data || [];
  const totalTendersCount = data?.meta?.total || 0;
  
  // Calculate total pages for the pagination component
  const totalPages = Math.ceil(totalTendersCount / itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex flex-col mt-16 md:mt-20">
        <div className="text-center px-4 max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground font-sans tracking-tight">
            Welcome to the Future of <br className="hidden sm:block"/> 
            <span className="text-primary">Tender Intelligence</span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl">
            AI-powered platform to find, track, and win government and private tenders across India.
          </p>
        </div>

        <StatsSection totalTenders={totalTendersCount} />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Active Tender Database</h2>
          </div>

          <FilterBar filters={filters} setFilters={setFilters} />
          
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {isError && (
            <div className="text-center text-destructive py-20 bg-destructive/10 rounded-lg">
              <p className="font-semibold">Connection Error</p>
              <p className="text-sm mt-2">{error.message}</p>
            </div>
          )}

          {!isLoading && !isError && tenders.length > 0 && (
            <>
              <div className="flex flex-col gap-4">
                {tenders.map((tender) => (
                  <TenderCard 
                    key={tender._id || tender.id} 
                    title={tender.title || tender.name}
                    authority={tender.authority || tender.department}
                    location={tender.location || tender.state}
                    closingDate={tender.closingDate || tender.deadline}
                    tenderValue={tender.tenderValue || tender.value}
                    type={tender.category || tender.type}
                    tenderUrl={tender.documentUrl || tender.url}
                  />
                ))}
              </div>

              {/* 4. Render the Pagination Controls below the list */}
              <PaginationControls 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            </>
          )}

          {!isLoading && !isError && tenders.length === 0 && (
            <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20">
              <p className="font-medium text-lg">No tenders found.</p>
              <p className="text-sm mt-1">Try clearing your filters or checking a different category.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
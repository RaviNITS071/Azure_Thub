/**
 * StatsSection Component
 * Displays high-level platform metrics to build trust.
 * 
 * @param {number} totalTenders - The total count of tenders, passed down from the parent App component.
 * This prevents making a redundant API call, as the parent already fetches this metadata.
 */
export function StatsSection({ totalTenders = 0 }) {
  
  // Define the statistics to be rendered. 
  // 'Active Tenders' uses the live data passed from the database.
  const stats = [
    { label: "Active Tenders", value: totalTenders }, 
    { label: "Platform Status", value: "Live" },
    { label: "Database Sync", value: "Active" },
  ];

  return (
    <div className="w-full border-y border-border/40 bg-muted/30 py-10 my-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          
          {/* Dynamically map over the stats array to render each metric block */}
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
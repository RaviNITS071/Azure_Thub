import { Moon, Sun, Briefcase } from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Navbar Component
 * Renders the top navigation bar with branding, links, and a theme toggle.
 */
export function Navbar() {
  // Access the theme switching function from our custom ThemeProvider context
  const { setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">TenderHub</span>
        </div>

        {/* Navigation Links (Hidden on small screens, visible on medium and up) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#" className="transition-colors hover:text-foreground">Tenders</a>
          <a href="#" className="transition-colors hover:text-foreground">Authorities</a>
          <a href="#" className="transition-colors hover:text-foreground">Analytics</a>
          <a href="#" className="transition-colors hover:text-foreground">Pricing</a>
        </nav>

        {/* User Actions & Theme Toggle Button */}
        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden sm:inline-flex">Sign In</Button>
          <Button className="hidden sm:inline-flex">Get Started</Button>
          
          {/* 
            Theme Toggle Dropdown 
            Fixed Hydration Error: Removed 'asChild' and the nested <Button> component.
            Applied button styling directly to the DropdownMenuTrigger to prevent 
            <button> inside <button> HTML nesting issues in React.
          */}
          <DropdownMenu>
            <DropdownMenuTrigger className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              {/* Sun icon is visible in light mode, scales down in dark mode */}
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              {/* Moon icon is hidden in light mode, scales up in dark mode */}
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </DropdownMenuTrigger>
            
            {/* Dropdown options to change the application theme */}
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </header>
  );
}
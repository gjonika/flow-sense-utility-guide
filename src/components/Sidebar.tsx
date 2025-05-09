
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  PlusCircle, 
  History, 
  BarChart3, 
  Settings
} from "lucide-react";

interface SidebarProps {
  closeMobileSidebar: () => void;
}

const Sidebar = ({ closeMobileSidebar }: SidebarProps) => {
  const navItems = [
    { title: "Dashboard", path: "/", icon: <Home className="h-5 w-5" /> },
    { title: "Add Reading", path: "/add-reading", icon: <PlusCircle className="h-5 w-5" /> },
    { title: "History", path: "/history", icon: <History className="h-5 w-5" /> },
    { title: "Analytics", path: "/analytics", icon: <BarChart3 className="h-5 w-5" /> },
    { title: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> }
  ];

  return (
    <div className="h-full bg-card border-r flex flex-col">
      {/* App Logo/Title */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <span className="w-2 h-6 bg-primary rounded-sm animate-pulse-light"></span>
          UtilityFlow
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6 flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                onClick={closeMobileSidebar}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-md transition-colors
                  ${isActive 
                    ? 'bg-primary text-primary-foreground font-medium' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                  }`
                }
                end={item.path === "/"}
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold">
            U
          </div>
          <div>
            <p className="text-sm font-medium">User</p>
            <p className="text-xs text-muted-foreground">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

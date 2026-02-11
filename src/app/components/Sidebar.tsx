import { 
  LayoutDashboard, 
  BarChart3, 
  Mail, 
  Send, 
  Building2, 
  Users, 
  MapPin 
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'inward', label: 'Inward Mails', icon: Mail },
  { id: 'outward', label: 'Outward Mails', icon: Send },
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'tracking', label: 'Tracking', icon: MapPin },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col" style={{background: 'linear-gradient(90deg, #2563EB 0%, #9333EA 100%)'}}>
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Tapaal System</h2>
            <p className="text-xs text-white/80">Mail Management</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white font-medium'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-white/20">
        <p className="text-xs text-white/60 text-center">
          © 2026 Tapaal System
        </p>
      </div>
    </aside>
  );
}

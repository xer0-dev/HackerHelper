import React from 'react';
import { 
  Shield, Hash, Lock, Search,
  Key, Database, List, ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'hash', icon: Hash, label: 'Hash Calculator' },
    { id: 'password', icon: Key, label: 'Password Analyzer' },
    { id: 'encryption', icon: Lock, label: 'Encryption Suite' },
    { id: 'security', icon: Shield, label: 'Security Scanner' },
    { id: 'ssl', icon: ShieldCheck, label: 'SSL Validator' },
    { id: 'dns', icon: Database, label: 'DNS Lookup' },
    { id: 'headers', icon: List, label: 'Headers Analyzer' }
  ];

  return (
    <div className="w-64 bg-gray-900 bg-opacity-50 backdrop-blur-lg text-white p-4 flex flex-col border-r border-gray-800">
      <div className="flex items-center gap-2 mb-8">
        <Shield className="w-8 h-8 text-emerald-400" />
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">
          SecureScope
        </h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${activeTab === item.id 
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg shadow-emerald-900/20' 
                    : 'hover:bg-white/5'
                  }`}
              >
                <item.icon className={`w-5 h-5 transition-transform duration-200 
                  ${activeTab === item.id ? 'scale-110' : ''}`} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-800">
        <div className="px-4 py-2">
          <p className="text-xs text-gray-500">
            Use responsibly. Security analysis tools for educational purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}
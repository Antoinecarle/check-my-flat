import { useState, useMemo } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  DoorOpen,
  Users,
  CalendarCheck,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Home,
  CheckCircle2,
  ChevronRight as BreadcrumbSeparator,
  Shield,
  Wrench,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRole, type AppRole } from '../contexts/RoleContext';

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 64;

const navigationItems = [
  { name: 'Tableau de bord', path: '/', icon: LayoutDashboard },
  { name: 'Batiments', path: '/batiments', icon: Building2 },
  { name: 'Lots', path: '/lots', icon: DoorOpen },
  { name: 'Tiers', path: '/tiers', icon: Users },
  { name: 'Missions', path: '/missions', icon: CalendarCheck },
  { name: 'Etats des lieux', path: '/edl', icon: ClipboardList },
];

const secondaryItems = [
  { name: 'Parametres', path: '/settings', icon: Settings },
];

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { role, setRole, currentUser } = useRole();

  const currentPathLabel = useMemo(() => {
    const allItems = [...navigationItems, ...secondaryItems];
    const match = allItems.find(item => item.path === location.pathname);
    return match ? match.name : 'Tableau de bord';
  }, [location.pathname]);

  const initials = `${currentUser.prenom[0]}${currentUser.nom[0]}`;
  const roleLabel = role === 'admin' ? 'Administrateur' : 'Technicien';

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-blue-100">
      {/* Blueprint grid overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
        className="fixed top-0 left-0 h-screen bg-white border-r border-slate-200 z-30 flex flex-col"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Logo + Workspace */}
        <div className="px-5 pt-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0 w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
              <div className="relative">
                <Home size={16} className="text-white" strokeWidth={2.5} />
                <CheckCircle2 size={10} className="absolute -bottom-1 -right-1 text-blue-400 bg-slate-900 rounded-full" />
              </div>
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col min-w-0"
              >
                <span className="font-semibold text-sm tracking-tight text-slate-900 whitespace-nowrap">ImmoChecker</span>
                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">FlatChecker SAS</span>
              </motion.div>
            )}
          </div>

          {/* Role Switcher */}
          {!isCollapsed ? (
            <div className="mt-3 flex p-0.5 bg-slate-100 rounded-lg">
              {(['admin', 'technicien'] as AppRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${
                    role === r
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {r === 'admin' ? <Shield size={12} /> : <Wrench size={12} />}
                  {r === 'admin' ? 'Admin' : 'Tech'}
                </button>
              ))}
            </div>
          ) : (
            <button
              onClick={() => setRole(role === 'admin' ? 'technicien' : 'admin')}
              className="mt-3 w-full flex items-center justify-center p-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors group relative"
              title={`Role: ${roleLabel} (cliquer pour changer)`}
            >
              {role === 'admin' ? <Shield size={14} className="text-blue-600" /> : <Wrench size={14} className="text-amber-600" />}
              <div className="absolute left-14 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 shadow-xl font-bold tracking-wider uppercase">
                {roleLabel}
              </div>
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-4 space-y-1">
          {navigationItems.map((item) => (
            <NavItem key={item.path} item={item} isCollapsed={isCollapsed} />
          ))}
          <div className="my-4 px-2"><div className="h-px bg-slate-100" /></div>
          {secondaryItems.map((item) => (
            <NavItem key={item.path} item={item} isCollapsed={isCollapsed} />
          ))}
        </nav>

        {/* Bottom: Notification + User + Collapse */}
        <div className="border-t border-slate-100">
          {/* User info + notification */}
          <div className={`px-3 py-3 ${isCollapsed ? 'flex flex-col items-center gap-2' : 'flex items-center gap-3'}`}>
            {!isCollapsed ? (
              <>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 ring-2 ring-slate-100">
                    {initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-900 leading-none truncate">{currentUser.prenom} {currentUser.nom}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{roleLabel}</span>
                  </div>
                </div>
                <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all flex-shrink-0">
                  <Bell size={16} strokeWidth={2} />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full ring-2 ring-white" />
                </button>
              </>
            ) : (
              <>
                <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all group">
                  <Bell size={16} strokeWidth={2} />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full ring-2 ring-white" />
                  <div className="absolute left-14 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 shadow-xl font-bold">
                    Notifications
                  </div>
                </button>
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-slate-100 group relative cursor-default">
                  {initials}
                  <div className="absolute left-14 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 shadow-xl font-bold">
                    {currentUser.prenom} {currentUser.nom}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full h-10 flex items-center justify-center border-t border-slate-100 hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-600"
          >
            {isCollapsed ? <ChevronRight size={18} /> : (
              <div className="flex items-center gap-2 px-4 w-full text-xs font-medium uppercase tracking-widest">
                <ChevronLeft size={16} />
                <span>Reduire</span>
              </div>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main area */}
      <div
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
      >
        {/* Breadcrumb bar */}
        <div className="px-8 pt-4 pb-2">
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="text-slate-400">ImmoChecker</span>
            <BreadcrumbSeparator size={12} className="text-slate-300" />
            <span className="text-slate-900">{currentPathLabel}</span>
          </div>
        </div>

        {/* Content */}
        <main className="px-8 pb-8 relative z-10 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function NavItem({ item, isCollapsed }: {
  item: typeof navigationItems[0];
  isCollapsed: boolean;
}) {
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) => `
        relative flex items-center gap-3 h-10 px-3 rounded-md transition-all duration-200 group
        ${isActive
          ? 'bg-blue-50/50 text-blue-700'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
      `}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="active-nav-indicator"
              className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <div className={`flex-shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
            <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
          </div>
          {!isCollapsed && (
            <span className={`text-[13px] font-medium whitespace-nowrap truncate ${isActive ? 'font-bold' : ''}`}>
              {item.name}
            </span>
          )}
          {isCollapsed && (
            <div className="absolute left-14 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 shadow-xl font-bold tracking-wider uppercase">
              {item.name}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
}

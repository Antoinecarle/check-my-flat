import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './contexts/RoleContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Batiments from './pages/Batiments';
import BatimentDetail from './pages/BatimentDetail';
import Lots from './pages/Lots';
import LotDetail from './pages/LotDetail';
import TiersList from './pages/TiersList';
import TiersDetail from './pages/TiersDetail';
import Missions from './pages/Missions';
import EdlList from './pages/EdlList';

export default function App() {
  return (
    <BrowserRouter>
      <RoleProvider>
        <DataProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/batiments" element={<Batiments />} />
              <Route path="/batiments/:id" element={<BatimentDetail />} />
              <Route path="/lots" element={<Lots />} />
              <Route path="/lots/:id" element={<LotDetail />} />
              <Route path="/tiers" element={<TiersList />} />
              <Route path="/tiers/:id" element={<TiersDetail />} />
              <Route path="/missions" element={<Missions />} />
              <Route path="/edl" element={<EdlList />} />
              <Route path="/settings" element={<Placeholder title="Parametres" />} />
            </Route>
          </Routes>
        </DataProvider>
      </RoleProvider>
    </BrowserRouter>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-64 text-slate-400 text-sm font-medium">
      {title} — En construction
    </div>
  );
}

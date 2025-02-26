import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './HomeScreen';
import SortingShowdown from './SortingShowdown';
import BinaryTreeExplorer from './BinaryTreeExplorer'; // <--- Renamed or newly added BFS/DFS file
import WeightedGraphExplorer from './WeightedGraphExplorer'; // <--- Weighted Graph file
import DPDungeon from './DPDungeon';
import DataDefender from './DataDefender';
import Visualizer from './Visualizer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/sorting-showdown" element={<SortingShowdown />} />
        
        {/* BFS/DFS on a Binary Tree */}
        <Route path="/binary-tree-explorer" element={<BinaryTreeExplorer />} />
        
        {/* Weighted Graph (Dijkstra / A* / Bellman-Ford) */}
        <Route path="/weighted-graph-explorer" element={<WeightedGraphExplorer />} />
        
        <Route path="/dp-dungeon" element={<DPDungeon />} />
        <Route path="/data-defender" element={<DataDefender />} />
        <Route path="/visualizer" element={<Visualizer />} />
      </Routes>
    </Router>
  );
}

export default App;

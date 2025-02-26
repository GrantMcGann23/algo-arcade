import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './HomeScreen';
import SortingShowdown from './SortingShowdown';
import BinaryTreeExplorer from './BinaryTreeExplorer'; // <--- Renamed or newly added BFS/DFS file
import WeightedGraphExplorer from './WeightedGraphExplorer'; // <--- Weighted Graph file
import DPDungeon from './DPDungeon';
import DataDefender from './DataDefender';
import Visualizer from './Visualizer';
function App() {
    return (_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomeScreen, {}) }), _jsx(Route, { path: "/sorting-showdown", element: _jsx(SortingShowdown, {}) }), _jsx(Route, { path: "/binary-tree-explorer", element: _jsx(BinaryTreeExplorer, {}) }), _jsx(Route, { path: "/weighted-graph-explorer", element: _jsx(WeightedGraphExplorer, {}) }), _jsx(Route, { path: "/dp-dungeon", element: _jsx(DPDungeon, {}) }), _jsx(Route, { path: "/data-defender", element: _jsx(DataDefender, {}) }), _jsx(Route, { path: "/visualizer", element: _jsx(Visualizer, {}) })] }) }));
}
export default App;

import React from 'react';
import { Table, List, Filter } from 'lucide-react';

interface NodeContextMenuProps {
  onSelect: (type: string) => void;
}

const NodeContextMenu: React.FC<NodeContextMenuProps> = ({ onSelect }) => {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2">
      <div className="w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 relative">
        <button
          className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
          onClick={() => onSelect('table')}
        >
          <Table size={16} className="text-green-500 shrink-0" />
          <span className="text-gray-700">Add Table View</span>
        </button>
        <button
          className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
          onClick={() => onSelect('list')}
        >
          <List size={16} className="text-purple-500 shrink-0" />
          <span className="text-gray-700">Add List View</span>
        </button>
        <button
          className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
          onClick={() => onSelect('filter')}
        >
          <Filter size={16} className="text-orange-500 shrink-0" />
          <span className="text-gray-700">Add Filter</span>
        </button>
        {/* Callout arrow */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45 shadow-lg"></div>
      </div>
    </div>
  );
};

export default NodeContextMenu;
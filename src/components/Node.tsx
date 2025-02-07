import React, { useState, useEffect } from 'react';
import { Database, Table, Plus, List, Filter, Trash2, Pencil } from 'lucide-react';
import { NodeData, Position } from '../types';
import NodeContextMenu from './NodeContextMenu';

interface NodeProps {
  node: NodeData;
  onAddConnection: (fromId: string, type: 'dataset' | 'table' | 'list' | 'filter') => void;
  onMove: (nodeId: string, position: Position) => void;
  onDelete: (nodeId: string) => void;
  onEdit: (nodeId: string) => void;
  isEditing?: boolean;
}

const Node: React.FC<NodeProps> = ({ 
  node, 
  onAddConnection, 
  onMove, 
  onDelete, 
  onEdit,
  isEditing = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(node.position);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    setPosition(node.position);
  }, [node.position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: Math.max(0, e.clientX - dragStart.x),
        y: Math.max(0, e.clientY - dragStart.y)
      };
      setPosition(newPosition);
      onMove(node.id, newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('.node-actions') && !target.closest('.node-context-menu')) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showContextMenu]);

  const handleContextMenuClick = (type: string) => {
    onAddConnection(node.id, type as 'dataset' | 'table' | 'list' | 'filter');
    setShowContextMenu(false);
  };

  const NodeIcon = () => {
    switch (node.type) {
      case 'dataset':
        return <Database className="text-blue-500" />;
      case 'table':
        return <Table className="text-green-500" />;
      case 'list':
        return <List className="text-purple-500" />;
      case 'filter':
        return <Filter className="text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className="absolute group"
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        if (!showContextMenu) {
          setShowActions(false);
        }
      }}
    >
      {/* Action buttons */}
      <div 
        className={`absolute -top-8 right-0 flex gap-0 transition-opacity duration-200 node-actions ${
          showActions || showContextMenu ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {node.type === 'dataset' && (
          <div className="relative">
            <button
              className={`p-2 rounded hover:bg-gray-100/80 transition-colors ${
                showContextMenu ? 'bg-gray-100/80' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setShowContextMenu(!showContextMenu);
              }}
            >
              <Plus size={16} className="text-gray-600" />
            </button>
            {showContextMenu && (
              <div className="node-context-menu">
                <NodeContextMenu onSelect={handleContextMenuClick} />
              </div>
            )}
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(node.id);
          }}
          className="p-2 rounded hover:bg-gray-100/80 transition-colors"
        >
          <Pencil size={16} className="text-gray-600" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(node.id);
          }}
          className="p-2 rounded hover:bg-gray-100/80 transition-colors group"
        >
          <Trash2 size={16} className="text-gray-600 group-hover:text-red-500" />
        </button>
      </div>

      <div 
        className={`w-48 bg-white rounded-lg shadow-lg ${
          node.type === 'dataset' ? 'border-blue-500' : 
          node.type === 'table' ? 'border-green-500' :
          node.type === 'list' ? 'border-purple-500' :
          'border-orange-500'
        } border-2 transition-shadow ${
          isEditing ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
        }`}
      >
        <div 
          className="p-4 flex items-center gap-2"
          onMouseDown={handleMouseDown}
        >
          <NodeIcon />
          <span className="font-medium">
            {node.type === 'dataset' ? 'Stock Dataset' :
             node.type === 'table' ? 'Table View' :
             node.type === 'list' ? 'List View' :
             'Filter'}
          </span>
        </div>
        
        <div className="px-4 pb-4">
          {node.type === 'filter' ? (
            <div className="text-sm text-gray-600">
              Condition: {node.data.condition}
            </div>
          ) : node.type !== 'dataset' && (
            <div className="text-sm text-gray-600">
              Columns: {node.data.columns?.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Node;
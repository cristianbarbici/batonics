import { useState } from 'react'
import { Plus } from 'lucide-react'
import Node from './Node'
import PropertyPane from './PropertyPane'
import { NodeData, Connection, Position } from '../types'

const Canvas = () => {
  const [nodes, setNodes] = useState<NodeData[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)

  // Spawns a fresh node in the middle, like a popup ad but useful
  const handleAddNode = (type: 'dataset' | 'table' | 'list' | 'filter') => {
    const newNode: NodeData = {
      id: `node-${Date.now()}`,
      type,
      position: {
        x: window.innerWidth / 2 - 96,
        y: window.innerHeight / 2 - 50
      },
      data:
        type === 'dataset'
          ? {
              type: 'stock',
              name: 'AAPL Stock Data'
            }
          : type === 'filter'
          ? {
              condition: 'price > 100'
            }
          : {
              columns: ['Date', 'Open', 'Close', 'High', 'Low', 'Volume']
            }
    }
    setNodes([...nodes, newNode])
  }

  // Adds a node's BFF to the right - they're connected forever
  const handleAddConnection = (fromId: string, type: 'dataset' | 'table' | 'list' | 'filter') => {
    const sourceNode = nodes.find((n) => n.id === fromId)
    if (!sourceNode) return

    const newNode: NodeData = {
      id: `node-${Date.now()}`,
      type,
      position: {
        x: sourceNode.position.x + 300,
        y: sourceNode.position.y
      },
      data:
        type === 'filter'
          ? { condition: 'price > 100' }
          : { columns: ['Date', 'Open', 'Close', 'High', 'Low', 'Volume'] }
    }

    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      fromId,
      toId: newNode.id
    }

    setNodes([...nodes, newNode])
    setConnections([...connections, newConnection])
  }

  // Lets nodes go wherever they want, like free-range chickens
  const handleNodeMove = (nodeId: string, position: Position) => {
    setNodes(nodes.map((node) => (node.id === nodeId ? { ...node, position } : node)))
  }

  // The node deletion ceremony - goodbye old friend
  const handleDeleteNode = (nodeId: string) => {
    setNodes(nodes.filter((node) => node.id !== nodeId))
    setConnections(connections.filter((conn) => conn.fromId !== nodeId && conn.toId !== nodeId))
    if (editingNodeId === nodeId) {
      setEditingNodeId(null)
    }
  }

  // Opens the property pane for node customization
  const handleEditNode = (nodeId: string) => {
    setEditingNodeId(nodeId)
  }

  // Summons the magical property pane from the void
  const handleUpdateNodeData = (nodeId: string, data: NodeData['data']) => {
    setNodes(nodes.map((node) => (node.id === nodeId ? { ...node, data } : node)))
  }

  // Hunt down the chosen node in our collection
  const editingNode = nodes.find((node) => node.id === editingNodeId)

  return (
    <div
      className='relative w-full h-screen overflow-hidden'
      style={{
        background: `
          radial-gradient(circle at 1px 1px, rgb(226 232 240 / 0.5) 1px, transparent 0)
        `,
        backgroundSize: '40px 40px',
        backgroundColor: 'rgb(249 250 251)'
      }}>
      <svg className='absolute top-0 left-0 w-full h-full pointer-events-none'>
        {connections.map((connection) => {
          const fromNode = nodes.find((n) => n.id === connection.fromId)
          const toNode = nodes.find((n) => n.id === connection.toId)
          if (!fromNode || !toNode) return null

          const fromX = fromNode.position.x + 192
          const fromY = fromNode.position.y + 40
          const toX = toNode.position.x
          const toY = toNode.position.y + 40

          const dx = toX - fromX
          const controlX = dx * 0.4

          return (
            <path
              key={connection.id}
              d={`M ${fromX} ${fromY} 
                  C ${fromX + controlX} ${fromY},
                    ${toX - controlX} ${toY},
                    ${toX} ${toY}`}
              fill='none'
              stroke='#94a3b8'
              strokeWidth='2'
            />
          )
        })}
      </svg>

      {nodes.length === 0 ? (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center'>
          <button
            onClick={() => handleAddNode('dataset')}
            className='w-32 h-32 border-2 border-dashed border-blue-400 rounded-xl flex items-center justify-center hover:bg-blue-50 transition-colors group'>
            <Plus size={32} className='text-blue-400 group-hover:scale-110 transition-transform' />
          </button>
          <span className='mt-4 text-gray-500 text-sm'>Add first step...</span>
        </div>
      ) : (
        nodes.map((node) => (
          <Node
            key={node.id}
            node={node}
            onAddConnection={handleAddConnection}
            onMove={handleNodeMove}
            onDelete={handleDeleteNode}
            onEdit={handleEditNode}
            isEditing={node.id === editingNodeId}
          />
        ))
      )}

      {editingNode && (
        <PropertyPane node={editingNode} onClose={() => setEditingNodeId(null)} onUpdate={handleUpdateNodeData} />
      )}
    </div>
  )
}

export default Canvas

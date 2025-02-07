import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { PropertyPaneProps } from '../types'

const PropertyPane: React.FC<PropertyPaneProps> = ({ node, onClose, onUpdate }) => {
  const [isPaneClosing, setIsPaneClosing] = useState(false)
  const [isPaneMounted, setIsPaneMounted] = useState(false)

  const ANIMATION_DURATION = 300

  useEffect(() => {
    setIsPaneMounted(true)
    setIsPaneClosing(false)
  }, [node.id])

  const handlePaneClose = () => {
    setIsPaneClosing(true)
    setTimeout(onClose, ANIMATION_DURATION)
  }

  const handlePropertyUpdate = (propertyKey: string, propertyValue: string | string[]) => {
    const updatedData = { ...node.data, [propertyKey]: propertyValue }
    onUpdate(node.id, updatedData)
  }

  const renderDatasetFields = () => (
    <>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Dataset Type</label>
        <input
          type='text'
          value={node.data.type || ''}
          onChange={(e) => handlePropertyUpdate('type', e.target.value)}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Dataset Name</label>
        <input
          type='text'
          value={node.data.name || ''}
          onChange={(e) => handlePropertyUpdate('name', e.target.value)}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>
    </>
  )

  return (
    <div
      className={`fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out property-pane ${
        !isPaneMounted ? 'translate-x-full' : isPaneClosing ? 'translate-x-full' : 'translate-x-0'
      }`}>
      <div className='p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold'>Properties</h2>
          <button onClick={handlePaneClose} className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
            <X size={20} className='text-gray-500' />
          </button>
        </div>

        <div className='space-y-4'>
          {node.type === 'dataset' && renderDatasetFields()}

          {(node.type === 'table' || node.type === 'list') && (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Columns</label>
              <textarea
                value={node.data.columns?.join('\n') || ''}
                onChange={(e) => handlePropertyUpdate('columns', e.target.value.split('\n'))}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-40'
                placeholder='One column per line'
              />
            </div>
          )}

          {node.type === 'filter' && (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Filter Condition</label>
              <input
                type='text'
                value={node.data.condition || ''}
                onChange={(e) => handlePropertyUpdate('condition', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='e.g., price > 100'
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PropertyPane

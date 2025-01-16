import { useHistoryContext } from '@/context/history-context';
import React from 'react'

const HistoryButton = () => {
  const { undo, redo, canUndo,canRedo } = useHistoryContext(); // Get undo and redo functions
  return (
    <div className="flex z-10">
    <button
      className={`bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 transition mr-2 ${canUndo ? '' : 'opacity-50 cursor-not-allowed'}`}
      onClick={undo}
      disabled={!canUndo}
    >
      Undo
    </button>
    <button
      className={`bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 transition ${canRedo ? '' : 'opacity-50 cursor-not-allowed'}`}
      onClick={redo}
      disabled={!canRedo}
    >
      Redo
    </button>
  </div>
  )
}

export default HistoryButton

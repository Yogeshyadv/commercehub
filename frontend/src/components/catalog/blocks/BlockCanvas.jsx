import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Trash2 } from 'lucide-react';

import HeroBlock from './HeroBlock';
import ProductGridBlock from './ProductGridBlock';
import FeatureBlock from './FeatureBlock';

const BlockRenderer = ({ block, onChange, isEditor, products }) => {
  const normalizedType = block.type === 'productGrid' ? 'product_grid' : 
                         block.type === 'feature' ? 'features' : 
                         block.type;
                         
  switch (normalizedType) {
    case 'hero':
      return <HeroBlock block={block} onChange={onChange} isEditor={isEditor} />;
    case 'product_grid':
      return <ProductGridBlock block={block} onChange={onChange} isEditor={isEditor} products={products} />;
    case 'features':
      return <FeatureBlock block={block} onChange={onChange} isEditor={isEditor} />;
    default:
      return (
        <div className="p-8 border-2 border-dashed border-gray-300 rounded text-center text-gray-500">
          Unknown Block Type: {block.type}
        </div>
      );
  }
};

export default function BlockCanvas({ blocks = [], onChange, isEditor = false, catalogDesign = {}, products = [] }) {
  const handleDragEnd = (result) => {
    if (!result.destination || !isEditor) return;
    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    if (onChange) onChange(items);
  };

  const updateBlock = (index, newBlockContent) => {
    if (!onChange) return;
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], content: newBlockContent };
    onChange(newBlocks);
  };

  const removeBlock = (index) => {
    if (!onChange) return;
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    onChange(newBlocks);
  };

  if (!isEditor) {
    return (
      <div className="w-full h-full" style={{ backgroundColor: catalogDesign?.backgroundColor || "#ffffff", color: catalogDesign?.textColor || "#111827", fontFamily: catalogDesign?.fontFamily || "Inter" }}>
        {blocks.map((block, index) => (
          <div key={block.id || index}>
            <BlockRenderer block={block} isEditor={false} products={products} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="blocks-canvas">
        {(provided) => (
          <div 
            {...provided.droppableProps} 
            ref={provided.innerRef}
            className="w-full min-h-screen pb-24" style={{ backgroundColor: catalogDesign?.backgroundColor || "#f9fafb", color: catalogDesign?.textColor || "#111827", fontFamily: catalogDesign?.fontFamily || "Inter" }}
          >
            {blocks.map((block, index) => (
              <Draggable key={block.id || `block-${index}`} draggableId={block.id || `block-${index}`} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`relative group mb-4 ${snapshot.isDragging ? 'z-50' : ''}`}
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2 bg-white p-1 rounded-md shadow-sm border border-gray-200">
                      <div 
                        {...provided.dragHandleProps}
                        className="p-1.5 cursor-grab hover:bg-gray-100 rounded text-gray-500"
                      >
                        <GripVertical size={16} />
                      </div>
                      <button 
                        onClick={() => removeBlock(index)}
                        className="p-1.5 cursor-pointer hover:bg-red-50 hover:text-red-500 rounded text-gray-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className={snapshot.isDragging ? 'shadow-2xl ring-2 ring-indigo-500' : ''}>
                       <BlockRenderer 
                        block={block}
                        onChange={(newContent) => updateBlock(index, newContent)}
                        isEditor={isEditor}                        products={products}                       />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {blocks.length === 0 && (
              <div className="p-12 text-center text-gray-400 border-2 border-dashed border-gray-300 m-8 rounded-lg">
                Your canvas is empty. Generate a template to get started.
              </div>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

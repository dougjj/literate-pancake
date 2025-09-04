import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';
import categories from '../data/categories.js';

const tiers = ['S', 'A', 'B', 'C', 'D'];

export default function Category() {
  const { categoryId } = useParams();
  const category = categories[categoryId];
  const [tierItems, setTierItems] = useState(() => ({
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
    unranked: category ? category.items.map(i => i.id) : []
  }));

  if (!category) return <p>Category not found</p>;

  const onDragEnd = result => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    const sourceList = Array.from(tierItems[source.droppableId]);
    sourceList.splice(source.index, 1);
    const destList = Array.from(tierItems[destination.droppableId]);
    destList.splice(destination.index, 0, draggableId);
    setTierItems(prev => ({
      ...prev,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destList
    }));
  };

  const submit = async () => {
    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryId, tiers: tierItems })
    });
    alert('Submitted!');
  };

  return (
    <div>
      <h2>{category.title}</h2>
      <button onClick={submit}>Submit</button>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          {tiers.map(tier => (
            <Droppable droppableId={tier} key={tier}>
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    border: '1px solid #ccc',
                    minHeight: '200px',
                    width: '150px'
                  }}
                >
                  <h4 style={{ textAlign: 'center' }}>{tier}</h4>
                  {tierItems[tier].map((id, idx) => (
                    <Draggable draggableId={id} index={idx} key={id}>
                      {prov => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          style={{
                            padding: '4px',
                            margin: '4px',
                            background: '#eee',
                            width: '120px',
                            textAlign: 'center',
                            ...prov.draggableProps.style
                          }}
                        >
                          <img src={category.items.find(i=>i.id===id).image} alt="" style={{ width: '100px', height: '100px' }} />
                          <div>{category.items.find(i=>i.id===id).name}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
          <Droppable droppableId="unranked">
            {provided => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  border: '1px solid #ccc',
                  minHeight: '200px',
                  width: '150px'
                }}
              >
                <h4 style={{ textAlign: 'center' }}>Unranked</h4>
                {tierItems.unranked.map((id, idx) => (
                  <Draggable draggableId={id} index={idx} key={id}>
                    {prov => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        style={{
                          padding: '4px',
                          margin: '4px',
                          background: '#eee',
                          width: '120px',
                          textAlign: 'center',
                          ...prov.draggableProps.style
                        }}
                      >
                        <img src={category.items.find(i=>i.id===id).image} alt="" style={{ width: '100px', height: '100px' }} />
                        <div>{category.items.find(i=>i.id===id).name}</div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
}

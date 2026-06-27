import { useState } from 'react';

interface Props {
  selectedId: string | null;
}

export default function LeftPanel({ selectedId }: Props) {
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <div
      style={{
        width: panelOpen ? 100 : 20,
        borderRight: '1px solid #ccc',
        transition: 'width 0.2s',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* collapse button */}
      <button onClick={() => setPanelOpen((p) => !p)}>{panelOpen ? '<' : '>'}</button>

      {/* PANEL CONTENT */}
      {panelOpen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
            padding: 10,
          }}
        >
          <div>
            <h4>Tools</h4>
            <button>Add Aircraft</button>
            <button>Toggle Grid</button>
          </div>
          <div style={{ borderTop: '1px solid #ddd', paddingTop: 10 }}>
            <h4>Aircraft Info</h4>

            {selectedId ? (
              <div>
                <p>ID: {selectedId}</p>
                <p>Type: rectangle</p>
                <p>X: ...</p>
                <p>Y: ...</p>
              </div>
            ) : (
              <p>No selection</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

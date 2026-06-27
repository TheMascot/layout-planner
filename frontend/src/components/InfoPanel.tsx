import { useState } from 'react';
import type { Shape } from '../types/shapes';

interface Props {
  selectedShape: Shape | null;
}

export default function InfoPanel({ selectedShape }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div
      style={{
        height: open ? 30 : 0,
        borderTop: '1px solid #ccc',
        background: '#f8f8f8',
        display: 'flex',
        flexDirection: 'column',
        transition: 'height 0.2s',
      }}
    >
      {/* HEADER STRIP */}
      <div
        style={{
          height: 20,
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          fontSize: 12,
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setOpen(!open)}
      >
        <span>{open ? '▼' : '▲'} Info panel</span>
      </div>

      {open && (
        <div style={{ padding: '6px 10px', fontSize: 12 }}>
          {selectedShape ? (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <span>
                <b>Name:</b> {selectedShape ? selectedShape.name : 'None'}
              </span>
              <span>
                <b>Type:</b> {selectedShape.type}
              </span>
              <span>
                <b>Width:</b> {selectedShape.width} m
              </span>
              <span>
                <b>Length:</b> {selectedShape.height} m
              </span>
              <span>
                <b>Rotation:</b> {selectedShape.rotation ?? 0} deg
              </span>
            </div>
          ) : (
            <div style={{ opacity: 0.6 }}>Nothing is selected</div>
          )}
        </div>
      )}
    </div>
  );
}

interface TopBarProps {
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
}

export default function TopBar({ setZoom, onToggleGrid, onToggleSnap }: TopBarProps) {
  return (
    <div
      style={{
        height: 25,
        borderBottom: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        gap: 10,
      }}
    >
      <button>Load</button>
      <button>Save</button>
      <button onClick={onToggleGrid}>Grid</button>
      <button onClick={onToggleSnap}>Snap</button>
      <button>Settings</button>
      <button onClick={() => setZoom((z) => z + 0.1)}>+</button>
      <button onClick={() => setZoom((z) => z - 0.1)}>-</button>
    </div>
  );
}

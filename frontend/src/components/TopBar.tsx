import type {ToolMode} from '../types/tools';
import {useNavigate} from 'react-router';


interface TopBarProps {
    setZoom: React.Dispatch<React.SetStateAction<number>>;
    onToggleGrid: () => void;
    onToggleSnap: () => void;
    onChangeActiveTool: () => void;
    activeTool: ToolMode;
    onSaveAll: () => void;
}

export default function TopBar({
                                   setZoom,
                                   onToggleGrid,
                                   onToggleSnap,
                                   onChangeActiveTool,
                                   activeTool,
                                   onSaveAll,
                               }: Readonly<TopBarProps>) {

    const navigate = useNavigate();

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
            <button>New Shape</button>
            <button>New Layout</button>
            <button>Load Shape</button>
            <button onClick={() => navigate('/load-layout')}>Load Layout</button>
            <button onClick={onSaveAll}>Save All</button>
            <button onClick={onToggleGrid}>Grid</button>
            <button onClick={onToggleSnap}>Snap</button>
            <button onClick={onChangeActiveTool}>
                {`${activeTool.charAt(0).toUpperCase()}${activeTool.substring(1)}`}
            </button>
            <button>Settings</button>
            <button onClick={() => setZoom((z) => z + 0.1)}>+</button>
            <button onClick={() => setZoom((z) => z - 0.1)}>-</button>
        </div>
    );
}
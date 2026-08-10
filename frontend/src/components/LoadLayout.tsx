import {useMemo, useState} from 'react';
import {useQuery} from '@tanstack/react-query'
import {
    Box,
    Button,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import type {SurfaceListItemModel} from "../models/surface-list-item.model.ts";
import {formatTimestamp} from '../utils/dateTimeFormatter.ts'
import type {Shape} from '../types/shapes.ts'
import {fetchShapes} from "../services/layout.service.ts";

interface LoadLayoutProps {
    surfaces: SurfaceListItemModel[];
    onLoadSurface?: (surfaceId: number) => void;
}

export function LoadLayout({surfaces, onLoadSurface}: Readonly<LoadLayoutProps>) {
    const [selectedSurfaceId, setSelectedSurfaceId] = useState<number | null>(null);

    const selectedSurface = useMemo(
        () => surfaces.find((surface) => surface.id === selectedSurfaceId) ?? null,
        [surfaces, selectedSurfaceId],
    );

    const shapesQuery = useQuery({
        queryKey: ['shapes', selectedSurfaceId],
        queryFn: () => fetchShapes(selectedSurfaceId as number),
        enabled: selectedSurfaceId !== null,
        refetchOnWindowFocus: false,
    })

    const shapes = shapesQuery.data ?? [];

    return (
        <Box sx={{display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 2, height: 480, boxShadow: 3}}>
            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column', minHeight: 0, boxShadow: 'none'}}>
                <Typography variant="h6" gutterBottom>
                    Load layout
                </Typography>

                <TableContainer sx={{flex: 1}}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Last modified</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {surfaces.map((surface) => {
                                const isSelected = surface.id === selectedSurfaceId;
                                return (
                                    <TableRow
                                        key={surface.id}
                                        hover
                                        selected={isSelected}
                                        onClick={() => {
                                            setSelectedSurfaceId(surface.id);
                                        }}
                                        sx={{cursor: 'pointer'}}
                                    >
                                        <TableCell>{surface.name}</TableCell>
                                        <TableCell>{formatTimestamp(surface.updatedAt)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Stack direction="row" sx={{mt: 2, justifyContent: 'flex-end'}}>
                    <Button
                        variant="contained"
                        disabled={!selectedSurface}
                        onClick={() => selectedSurface && onLoadSurface?.(selectedSurface.id)}
                    >
                        Load selected
                    </Button>
                </Stack>
            </Paper>

            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column', boxShadow: 'none'}}>
                <Typography variant="h6" gutterBottom>
                    Preview
                </Typography>

                {!selectedSurface ? (
                    <Typography variant="body2" color="text.secondary">
                        Select a surface from the table.
                    </Typography>
                ) : (
                    <Box sx={{border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1}}>
                        <svg width="100%" height="260" viewBox="0 0 300 220" role="img" aria-label="Surface preview">
                            <rect x="0" y="0" width="300" height="220" fill="#fafafa"/>
                            <rect
                                x="20"
                                y="20"
                                width="260"
                                height="180"
                                fill="#e3f2fd"
                                stroke="#1976d2"
                                strokeWidth="2"
                                rx="4"
                            />
                            <text x="150" y="106" textAnchor="middle" fill="#0d47a1" fontSize="14" fontWeight="600">
                                {selectedSurface.name}
                            </text>
                            <text x="150" y="126" textAnchor="middle" fill="#1565c0" fontSize="12">
                                {selectedSurface.width}m × {selectedSurface.length}m
                            </text>
                            <text x="150" y="146" textAnchor="middle" fill="#1565c0" fontSize="12">
                                Objects on surface: {shapes.length}
                            </text>
                        </svg>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
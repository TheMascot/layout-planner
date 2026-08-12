import {useNavigate} from 'react-router';
import {useQuery} from '@tanstack/react-query';
import {Box, CircularProgress, Typography} from '@mui/material';
import {LoadLayout} from '../components/LoadLayout.tsx';
import {fetchSurfaceList} from '../services/layout.service.ts';

export function LoadLayoutPage() {
    const navigate = useNavigate();

    const {data: surfaces, isLoading, isError, error} = useQuery({
        queryKey: ['surfaces'],
        queryFn: fetchSurfaceList,
        refetchOnWindowFocus: false,
    });

    function handleLoadSurface(surfaceId: number) {
        navigate(`/?surfaceId=${surfaceId}`);
    }

    if (isLoading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', mt: 8}}>
                <CircularProgress/>
            </Box>
        );
    }
    if (isError) {
        return (
            <Typography color="error" sx={{m: 4}}>
                {error instanceof Error ? error.message : 'Failed to load surfaces'}
            </Typography>
        );
    }

    return (
        <Box sx={{p: 4}}>
            <LoadLayout surfaces={surfaces ?? []} onLoadSurface={handleLoadSurface}/>
        </Box>
    );
}
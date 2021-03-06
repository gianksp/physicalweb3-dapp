import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Card, Grid, Typography, IconButton } from '@mui/material';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import { gridSpacing } from 'store/constant';

// assets
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useConfiguration from 'hooks/useConfiguration';

// ==============================|| USER CONTACT CARD ||============================== //

const NetworkFragment = () => {
    const { config } = useConfiguration();
    const theme = useTheme();

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(
            () => {
                console.log('Async: Copying to clipboard was successful!');
            },
            (err) => {
                console.error('Async: Could not copy text: ', err);
            }
        );
    };

    const trimAddress = (address) => {
        if (!address) return;

        const first = address.substring(0, 12);
        const last = address.substr(-8);
        // eslint-disable-next-line consistent-return
        return `${first}...${last}`;
    };

    return (
        <Card
            sx={{
                p: 2,
                bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
                border: theme.palette.mode === 'dark' ? 'none' : '1px solid',
                borderColor: theme.palette.grey[100],
                width: '100%'
            }}
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={8}>
                    <Typography variant="caption">Network</Typography>
                    <Typography variant="h5">{config?.network?.name}</Typography>
                    <Typography variant="caption">Chain Id</Typography>
                    <Typography variant="h6">{config?.network?.id}</Typography>
                    <Typography variant="caption">Currency Symbol</Typography>
                    <Typography variant="h6">{config?.network?.currencySymbol}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Grid container>
                        <Grid item xs zeroMinWidth style={{ cursor: 'pointer' }}>
                            <Avatar size="lg" src={config?.network?.imageUrl} sx={{ width: 72, height: 72 }} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption">RPC URL</Typography>
                    <Typography variant="h6">
                        {config?.network?.rpcUrl}
                        <IconButton
                            color="primary"
                            aria-label="copy to clipboard"
                            size="small"
                            onClick={() => copyToClipboard(config?.network?.rpcUrl)}
                        >
                            <ContentCopyIcon />
                        </IconButton>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption">Block Explorer URL</Typography>
                    <Typography variant="h6">
                        {config?.network?.blockExplorerUrl}
                        <IconButton
                            color="primary"
                            aria-label="copy to clipboard"
                            size="small"
                            onClick={() => copyToClipboard(config?.network?.blockExplorerUrl)}
                        >
                            <ContentCopyIcon />
                        </IconButton>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption">Smart Contract</Typography>
                    <Typography variant="h5">
                        {trimAddress(config?.network?.contract)}
                        <IconButton
                            color="primary"
                            aria-label="copy to clipboard"
                            size="small"
                            onClick={() => copyToClipboard(config?.network?.contract)}
                        >
                            <ContentCopyIcon />
                        </IconButton>
                        <Button variant="outlined">View in explorer</Button>
                    </Typography>
                </Grid>
            </Grid>
        </Card>
    );
};

export default NetworkFragment;

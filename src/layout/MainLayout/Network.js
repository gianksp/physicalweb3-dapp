import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Card, Grid, Menu, MenuItem, Typography, IconButton } from '@mui/material';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import { gridSpacing } from 'store/constant';

// assets
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import PhoneTwoToneIcon from '@mui/icons-material/PhoneTwoTone';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useConfiguration from 'utils/hooks/useConfiguration';

const avatarImage = require.context('assets/images/users', true);

// ==============================|| USER CONTACT CARD ||============================== //

const Network = ({ avatar, contact, email, name, location, onActive, role }) => {
    const { config } = useConfiguration();
    const theme = useTheme();

    const avatarProfile = avatar && avatarImage(`./${avatar}`).default;

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
                        <Grid
                            item
                            xs
                            zeroMinWidth
                            onClick={() => {
                                onActive();
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            <Avatar alt={name} size="lg" src={config?.network?.imageUrl} sx={{ width: 72, height: 72 }} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption">RPC URL</Typography>
                    <Typography variant="h6">
                        {config?.network?.rpcUrl}
                        <IconButton
                            color="primary"
                            aria-label="add to shopping cart"
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
                            aria-label="add to shopping cart"
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
                            aria-label="add to shopping cart"
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

Network.propTypes = {
    avatar: PropTypes.string,
    contact: PropTypes.string,
    email: PropTypes.string,
    location: PropTypes.string,
    name: PropTypes.string,
    onActive: PropTypes.func,
    role: PropTypes.string
};

export default Network;

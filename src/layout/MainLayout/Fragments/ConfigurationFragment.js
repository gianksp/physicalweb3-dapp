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
import useConfiguration from 'hooks/useConfiguration';

// ==============================|| USER CONTACT CARD ||============================== //

const Configuration = ({ avatar, contact, email, name, location, onActive, role }) => {
    const { applicationId } = useConfiguration();
    const theme = useTheme();

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

    const configCard = (
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
                <Grid item xs={9}>
                    <Typography variant="caption">App Id</Typography>
                    <Typography variant="h5">{applicationId}</Typography>
                </Grid>
                <Grid item xs={3}>
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
                            <Avatar
                                alt={name}
                                size="lg"
                                src="https://moralis.io/wp-content/uploads/2021/07/bigicon_hero2.svg"
                                sx={{ width: 40, height: 40 }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );

    return applicationId ? configCard : null;
};

Configuration.propTypes = {
    avatar: PropTypes.string,
    contact: PropTypes.string,
    email: PropTypes.string,
    location: PropTypes.string,
    name: PropTypes.string,
    onActive: PropTypes.func,
    role: PropTypes.string
};

export default Configuration;

import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, Grid, Typography } from '@mui/material';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import { gridSpacing } from 'store/constant';

// assets
import useConfiguration from 'hooks/useConfiguration';

// ==============================|| USER CONTACT CARD ||============================== //

const AppIdFragment = () => {
    const { applicationId } = useConfiguration();
    const theme = useTheme();

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
                        <Grid item xs zeroMinWidth style={{ cursor: 'pointer' }}>
                            <Avatar
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

export default AppIdFragment;

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import useConfiguration from 'utils/hooks/useConfiguration';
import useWallet from 'utils/hooks/useWallet';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// styles
const CardStyle = styled(Card)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? theme.palette.dark[800] : theme.palette.warning.light,
    marginTop: '16px',
    marginBottom: '16px',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: '200px',
        height: '200px',
        border: '19px solid ',
        borderColor: theme.palette.mode === 'dark' ? theme.palette.warning.main : theme.palette.warning.main,
        borderRadius: '50%',
        top: '65px',
        right: '-150px'
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: '200px',
        height: '200px',
        border: '3px solid ',
        borderColor: theme.palette.mode === 'dark' ? theme.palette.warning.main : theme.palette.warning.main,
        borderRadius: '50%',
        top: '145px',
        right: '-70px'
    }
}));

// ==============================|| PROFILE MENU - UPGRADE PLAN CARD ||============================== //

const BalanceCard = () => {
    const theme = useTheme();
    const { chain } = useConfiguration();
    const { isLoading, data, tokenIsLoading, tokenData, nftLoading, nftData } = useWallet();
    console.log(data);
    console.log(tokenData);
    console.log(nftData);
    return (
        <CardStyle>
            <CardContent>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Typography variant="h4">Upgrade your plan</Typography>
                    </Grid>
                    <Grid item>
                        <Typography
                            variant="subtitle2"
                            color={theme.palette.mode === 'dark' ? 'textSecondary' : 'grey.900'}
                            sx={{ opacity: theme.palette.mode === 'dark' ? 1 : 0.6 }}
                        >
                            70% discount for 1 years <br />
                            subscriptions.
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction="row">
                            <AnimateButton>
                                <Button variant="contained" color="warning" sx={{ boxShadow: 'none' }}>
                                    Go Premium
                                </Button>
                            </AnimateButton>
                        </Stack>
                    </Grid>
                    <Grid item>
                        <Typography>{chain} Balance</Typography>
                        {!isLoading && data && data.balance / `1e${18}`}
                    </Grid>
                </Grid>
            </CardContent>
        </CardStyle>
    );
};

export default BalanceCard;

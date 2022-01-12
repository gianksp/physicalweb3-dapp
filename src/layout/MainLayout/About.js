// material-ui
import { Typography, Grid, Box, Container } from '@mui/material';

import useConfiguration from 'utils/hooks/useConfiguration';

// project imports
import MainCard from 'ui-component/cards/MainCard';

import Network from 'layout/MainLayout/Network';
import Options from 'views/deeplink-page/Options';

// ==============================|| SAMPLE PAGE ||============================== //

const About = () => {
    const { config } = useConfiguration();

    const getAboutTitle = () => {
        if (!config) return '';
        // eslint-disable-next-line consistent-return
        return config?.about?.title;
    };

    const getAboutDescription = () => {
        if (!config) return '';
        // eslint-disable-next-line consistent-return
        return config?.about?.description;
    };

    return (
        <Grid item sx={{ p: 0, m: 0 }} xs={12}>
            <Container sx={{ maxWidth: '100%' }} maxWidth={false} disableGutters>
                <Grid item xs={12} sx={{ p: 0, m: 0 }}>
                    <Box
                        direction="column"
                        justifyContent="center"
                        sx={{
                            height: 175,
                            backgroundColor: 'black',
                            p: 0
                        }}
                    >
                        <Box
                            sx={{
                                height: 175,
                                backgroundImage: `url(${config?.about?.imageUrl})`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                verticalAlign: 'middle',
                                backgroundSize: 'cover',
                                p: 0,
                                opacity: 0.7,
                                width: '100%',
                                position: 'absolute',
                                x: 0,
                                y: 0
                            }}
                        />
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            style={{ height: 175, color: 'white' }}
                        >
                            <Typography variant="h2" color="white" component="span">
                                {config?.about?.appName}
                            </Typography>
                        </Grid>
                    </Box>
                </Grid>
            </Container>
            <Grid container sx={{ p: 2 }}>
                <Grid item xs={12} sx={{ mb: 1 }}>
                    <Typography variant="h3" component="span">
                        {getAboutTitle()}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2" component="span">
                        {getAboutDescription()}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container sx={{ p: 2 }}>
                <Network />
            </Grid>
        </Grid>
    );
};

export default About;

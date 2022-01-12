// material-ui
import { Typography } from '@mui/material';

import useConfiguration from 'utils/hooks/useConfiguration';

// project imports
import MainCard from 'ui-component/cards/MainCard';

import Options from 'views/deeplink-page/Options';

// ==============================|| SAMPLE PAGE ||============================== //

const DeeplinkPage = () => {
    const { config } = useConfiguration();

    return (
        <MainCard title={config?.about?.appName}>
            <Typography variant="body2" sx={{ mb: 2 }}>
                Your browser does not natively support Web3. To work around this, please use any of the options below.
            </Typography>
            <Options />
        </MainCard>
    );
};

export default DeeplinkPage;

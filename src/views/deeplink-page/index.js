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
        <MainCard title={config.name}>
            <Typography variant="body2">
                Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa. Ut
                enif enif, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos reprehended in voltage
                veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non president, sunk in culpa qui officiate
                descent molls anim id est labours.
            </Typography>
            <Options />
        </MainCard>
    );
};

export default DeeplinkPage;

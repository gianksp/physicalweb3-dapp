import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { Box, Grid } from '@mui/material';
import AboutTab from 'layout/MainLayout/Tabs/AboutTab';
import SmartContracTab from 'layout/MainLayout/Tabs/SmartContracTab';
import useConfiguration from 'hooks/useConfiguration';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 0 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`
    };
}

export default function FullWidthTabs() {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const { config } = useConfiguration();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    return (
        <Box>
            <Grid container>
                <AppBar position="static" sx={{ backgroundColor: config?.theme?.primary, color: config?.theme?.secondary }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="secondary"
                        textColor="inherit"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab label="About" {...a11yProps(0)} />
                        <Tab label="Controls" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex}>
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <AboutTab />
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <SmartContracTab />
                    </TabPanel>
                </SwipeableViews>
            </Grid>
        </Box>
    );
}

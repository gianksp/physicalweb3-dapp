import { useEffect, useState } from 'react';

// material-ui
import { Typography, Button, Grid, IconButton, TextField, FormControl, FormHelperText, Input, InputLabel } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import useConfig from 'utils/configHook';
import { createTheme } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const customTheme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                outlined: {
                    backgroundColor: 'green'
                }
            }
        }
    }
});

// ==============================|| SAMPLE PAGE ||============================== //

const SmartContractInterface = () => {
    const { config = {} } = useConfig();
    const [funcs, setFuncs] = useState([]);
    const [getInputs, setInputs] = useState({});

    const loadFunctions = (abi = []) => {
        const functions = [];
        abi.forEach((item) => {
            if (item.type === 'function') {
                functions.push(item);
            }
        });
        setFuncs(functions);
    };

    useEffect(() => {
        loadFunctions(config.abi);
    }, [config]);

    const getButtonColor = (stateMutability) => {
        let statusColor;
        switch (stateMutability) {
            case 'payable':
                statusColor = 'error';
                break;
            case 'nonpayable':
                statusColor = 'secondary';
                break;
            default:
                statusColor = 'primary';
                break;
        }
        return statusColor;
    };

    const trimAddress = (address) => {
        if (!address) return;

        const first = address.substring(0, 12);
        const last = address.substr(-8);
        // eslint-disable-next-line consistent-return
        return `${first}...${last}`;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const getExplorerAddressUrl = () => `${config.blockExplorerUrl}address/${config.contract}`;

    const displayMetadata = () => (
        <Grid item xs={12}>
            <MainCard title={config.name}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="h4">
                            {trimAddress(config.contract)}
                            <IconButton aria-label="fingerprint" color="primary" onClick={() => copyToClipboard(config.contract)}>
                                <ContentCopyIcon />
                            </IconButton>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="outlined" size="small" href={getExplorerAddressUrl()} target="_blank">
                            View in explorer
                        </Button>
                    </Grid>
                </Grid>
            </MainCard>
        </Grid>
    );

    const onInputChange = (e) => {
        const components = e.target.id.split('.');
        const funKey = components[0];
        const attrKey = components[1];
        const attrValue = e.target.value;
        const inputs = getInputs;
        const currentDefinition = inputs[funKey] ? inputs[funKey] : {};
        currentDefinition[attrKey] = attrValue;
        inputs[funKey] = currentDefinition;
        setInputs(inputs);
    };

    const displayInputs = (item) => {
        const inputs = [];
        item.inputs.forEach((inputItem) => {
            const id = `${item.name}.${inputItem.name}`;
            inputs.push(
                <FormControl variant="standard">
                    <InputLabel htmlFor={id}>{inputItem.name}</InputLabel>
                    <Input id={id} onChange={onInputChange} aria-describedby={`${id}-text`} />
                    <FormHelperText id={`${id}-text`}>{inputItem.type}</FormHelperText>
                </FormControl>
            );
        });
        return inputs;
    };

    const invokeFunction = (fn) => {
        console.log(fn);
        console.log(getInputs[fn.name]);
    };

    const displayFunctions = () => {
        const functions = [];
        funcs.forEach((item) => {
            functions.push(
                <Grid item xs={12}>
                    <MainCard>
                        <FormControl variant="standard">
                            {displayInputs(item)}
                            <Button variant="outlined" color={getButtonColor(item.stateMutability)} onClick={() => invokeFunction(item)}>
                                {item.name}
                            </Button>
                        </FormControl>
                    </MainCard>
                </Grid>
            );
        });
        return functions;
    };

    return (
        <Grid container>
            {config && displayMetadata()}
            {config && displayFunctions()}
        </Grid>
    );
};

export default SmartContractInterface;

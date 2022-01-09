import { useEffect, useState } from 'react';

// material-ui
import { Typography, Button, Grid, IconButton, Box, FormControl, FormHelperText, Input, InputLabel } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import useConfig from 'utils/configHook';
import { createTheme } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useMoralis } from 'react-moralis';

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
    const { Moralis, user } = useMoralis();
    const { config = {} } = useConfig();
    const [funcs, setFuncs] = useState([]);
    const [getInputs, setInputs] = useState({});
    const [getResponses, setResponses] = useState({});

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

    const getExplorerAddressUrl = (address) => `${config.blockExplorerUrl}address/${address}`;

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
                        <Button variant="outlined" size="small" href={getExplorerAddressUrl(config.contract)} target="_blank">
                            View in explorer
                        </Button>
                    </Grid>
                </Grid>
            </MainCard>
        </Grid>
    );

    const isAddresss = (value = '') => {
        if (typeof value === 'string' || value instanceof String) {
            return value.startsWith('0x');
        }
        return false;
    };

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

    const setResponse = (method, value) => {
        const responses = getResponses;
        responses[method] = value;
        setResponses({});
        setResponses(responses);
    };

    const invokeSendFunction = async (fn) => {
        setResponse(fn.name, '');
        console.log('invoked send');
        const userInputs = getInputs[fn.name];
        const fnValues = userInputs ? Object.values(userInputs) : [];

        const web3 = await Moralis.enableWeb3();

        let callStatus = {};
        try {
            const encodedFunction = web3.eth.abi.encodeFunctionCall(fn, fnValues);

            const transactionParameters = {
                to: config.address,
                from: user.get('ethAddress'),
                data: encodedFunction
            };

            const response = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters]
            });
            callStatus = {
                success: true,
                message: response
            };
        } catch (e) {
            console.log(e.Error);
            callStatus = {
                success: false,
                message: JSON.stringify(e)
            };
        } finally {
            setResponse(fn.name, callStatus);
        }
    };

    const getResponseMessage = (method) => getResponses[method]?.message;

    const getResponseStatus = (method) => getResponses[method]?.success;

    const invokeReadFunction = async (fn) => {
        setResponse(fn.name, '');
        console.log('invoked read');
        const userInputs = getInputs[fn.name];
        const fnValues = userInputs ? Object.values(userInputs) : [];

        const web3 = await Moralis.enableWeb3();
        let callStatus = {};
        try {
            const NameContract = new web3.eth.Contract(config.abi, config.contract);
            const response = await NameContract.methods[fn.name](...fnValues).call();
            callStatus = {
                success: true,
                message: response
            };
        } catch (e) {
            callStatus = {
                success: false,
                message: JSON.stringify(e)
            };
        } finally {
            setResponse(fn.name, callStatus);
        }
    };

    const invokeFunction = (fn) => {
        console.log(fn);
        switch (fn.stateMutability) {
            case 'view':
                invokeReadFunction(fn);
                break;
            default:
                invokeSendFunction(fn);
                break;
        }
    };

    const getResponseColor = (name) => {
        let targetColor;
        const message = getResponseMessage(name);
        const status = getResponseStatus(name);
        switch (status) {
            case true:
                targetColor = 'success.main';
                break;
            case false:
                targetColor = 'error.main';
                break;
            default:
                targetColor = 'white';
                break;
        }
        console.log(message);
        console.log(status);
        // getResponseMessage(item.name) === null
        // ? 'white'
        // : getResponseStatus(item.name)
        // ? 'success.light'
        // : 'error.light'
        return targetColor;
    };

    const getResponseTextColor = (name) => {
        let targetColor;
        const message = getResponseMessage(name);
        const status = getResponseStatus(name);
        switch (status) {
            case true:
                targetColor = 'white';
                break;
            case false:
                targetColor = 'white';
                break;
            default:
                targetColor = 'black';
                break;
        }
        console.log(message);
        console.log(status);
        // getResponseMessage(item.name) === null
        // ? 'white'
        // : getResponseStatus(item.name)
        // ? 'success.light'
        // : 'error.light'
        return targetColor;
    };

    const displayFunctions = () => {
        const functions = [];
        funcs.forEach((item) => {
            functions.push(
                <Grid item xs={12}>
                    <MainCard xs={12}>
                        <FormControl variant="standard">
                            {displayInputs(item)}
                            <Button variant="outlined" color={getButtonColor(item.stateMutability)} onClick={() => invokeFunction(item)}>
                                {item.name}
                            </Button>
                            <Box
                                sx={{
                                    p: 2,
                                    mt: 1,
                                    backgroundColor: getResponseColor(item.name),
                                    color: getResponseTextColor(item.name)
                                }}
                            >
                                {getResponseMessage(item.name) && isAddresss(getResponseMessage(item.name)) ? (
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Typography variant="body2">
                                                {trimAddress(getResponseMessage(item.name))}
                                                <IconButton
                                                    aria-label="fingerprint"
                                                    color="primary"
                                                    onClick={() => copyToClipboard(getResponseMessage(item.name))}
                                                >
                                                    <ContentCopyIcon />
                                                </IconButton>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                href={getExplorerAddressUrl(getResponseMessage(item.name))}
                                                target="_blank"
                                            >
                                                View in explorer
                                            </Button>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Typography>{getResponseMessage(item.name)}</Typography>
                                )}
                            </Box>
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

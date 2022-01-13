import { useEffect, useState } from 'react';

// material-ui
import { Typography, Button, Grid, IconButton, Box, FormControl, FormHelperText, Input, InputLabel } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import useConfiguration from 'hooks/useConfiguration';
import { createTheme, styled } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useMoralis } from 'react-moralis';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SaveIcon from '@mui/icons-material/Save';

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

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0
    },
    '&:before': {
        display: 'none'
    }
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)'
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1)
    }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)'
}));

// ==============================|| SAMPLE PAGE ||============================== //

const SmartContractTab = () => {
    const { Moralis, user, isAuthenticated } = useMoralis();
    const { config = {} } = useConfiguration();
    const [funcs, setFuncs] = useState([]);
    const [getInputs, setInputs] = useState({});
    const [getResponses, setResponses] = useState({});
    const [expanded, setExpanded] = useState();
    const [clipboardValues, setClipboardValues] = useState({});
    const [isLoading, setLoading] = useState();

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

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

    const getExplorerAddressUrl = (address) => {
        if (!config || !address) return '';
        const prefix = address.length > 60 ? 'tx' : 'address';
        return `${config?.network?.blockExplorerUrl}${prefix}/${address}`;
    };

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

    const setFieldValue = (funKey, attrKey, attrValue) => {
        const inputs = getInputs;
        const currentDefinition = inputs[funKey] ? inputs[funKey] : {};
        currentDefinition[attrKey] = attrValue;
        inputs[funKey] = currentDefinition;
        setInputs(inputs);
    };

    const onInputChange = (e) => {
        const components = e.target.id.split('.');
        const funKey = components[0];
        const attrKey = components[1];
        const attrValue = e.target.value;
        setFieldValue(funKey, attrKey, attrValue);
    };

    const fieldComponentId = (item, inputItem) => `${item.name}.${inputItem.name}`;

    const pasteFromClipboard = async (id) => {
        const text = await navigator.clipboard.readText();
        const val = {};
        val[`${id}`] = text;
        setClipboardValues(val);
        const comps = id.split('.');
        setFieldValue(comps[0], comps[1], text);
    };

    const pasteFromWallet = async (id) => {
        if (!isAuthenticated) {
            await Moralis.authenticate();
        }
        const val = {};
        val[`${id}`] = user.get('ethAddress');
        setClipboardValues(val);
        const comps = id.split('.');
        setFieldValue(comps[0], comps[1], user.get('ethAddress'));
    };

    const utilsButtons = (id, type) => (
        <Box component="span" sx={{ display: 'flex' }}>
            {type === 'address' && (
                <IconButton aria-label="paste" color="primary" size="small" position="end">
                    <AccountBalanceWalletIcon position="end" onClick={() => pasteFromWallet(id)} />
                </IconButton>
            )}
            <IconButton aria-label="paste" color="primary" size="small" position="end">
                <ContentPasteIcon position="end" onClick={() => pasteFromClipboard(id)} />
            </IconButton>
        </Box>
    );

    const displayInputs = (item) => {
        const inputs = [];
        item.inputs.forEach((inputItem) => {
            const id = fieldComponentId(item, inputItem);
            inputs.push(
                <Grid container>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel htmlFor={id}>{inputItem.name}</InputLabel>
                        <Input
                            id={id}
                            onChange={onInputChange}
                            aria-describedby={`${id}-text`}
                            endAdornment={utilsButtons(id, inputItem.type)}
                            value={clipboardValues[id]}
                        />
                        <FormHelperText id={`${id}-text`}>{inputItem.type}</FormHelperText>
                    </FormControl>
                </Grid>
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
        let callStatus = {
            success: false
        };
        try {
            setLoading(fn.name);
            const userInputs = getInputs[fn.name];
            const fnValues = userInputs ? Object.values(userInputs) : [];

            const web3 = await Moralis.enableWeb3();

            if (!isAuthenticated) await Moralis.authenticate();

            const encodedFunction = web3.eth.abi.encodeFunctionCall(fn, fnValues);

            const transactionParameters = {
                to: config.network.contract,
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
            const errMsg = e.stack;
            callStatus = {
                success: false,
                message: errMsg
            };
        } finally {
            setResponse(fn.name, callStatus);
            setLoading();
        }
    };

    const getResponseMessage = (method) => getResponses[method]?.message;

    const getResponseStatus = (method) => getResponses[method]?.success;

    const invokeReadFunction = async (fn) => {
        setResponse(fn.name, '');
        console.log('invoked read');
        const userInputs = getInputs[fn.name];
        const fnValues = userInputs ? Object.values(userInputs) : [];
        let callStatus = {};
        try {
            setLoading(fn.name);
            const web3 = await Moralis.enableWeb3();
            const NameContract = new web3.eth.Contract(config.abi, config.network.contract);
            const response = await NameContract.methods[fn.name](...fnValues).call();
            callStatus = {
                success: true,
                message: response
            };
        } catch (e) {
            console.log(e);
            callStatus = {
                success: false,
                message: e.stack
            };
        } finally {
            console.log(callStatus);
            setResponse(fn.name, callStatus);
            setLoading();
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
                targetColor = 'rgba(141, 255, 86, 0.26)';
                break;
            case false:
                targetColor = 'rgba(255, 101, 173, 0.26)';
                break;
            default:
                targetColor = 'white';
                break;
        }
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
        // getResponseMessage(item.name) === null
        // ? 'white'
        // : getResponseStatus(item.name)
        // ? 'success.light'
        // : 'error.light'
        return targetColor;
    };

    const displayFunctions = () => {
        const functions = [];
        for (let i = 0; i < funcs.length; i += 1) {
            const item = funcs[i];
            functions.push(
                <Grid item xs={12}>
                    <Accordion expanded={expanded === `panel${i}`} onChange={handleChange(`panel${i}`)}>
                        <AccordionSummary aria-controls={`panel${i}-content`} id={`panel${i}-header`}>
                            <Grid item xs={9}>
                                <Typography variant="h3" fontWeight="100">
                                    {item.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={3} justifyContent="flex-end">
                                <Chip label={item.stateMutability} color="primary" variant="outlined" size="small" width="100%" />
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails sx={{ width: '100%' }}>
                            {displayInputs(item)}
                            {isLoading !== item.name && (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color={getButtonColor(item.stateMutability)}
                                    onClick={() => invokeFunction(item)}
                                    sx={{ my: 3 }}
                                >
                                    {item.name}
                                </Button>
                            )}
                            {isLoading === item.name && (
                                <LoadingButton fullWidth loading variant="outlined" sx={{ my: 3 }}>
                                    {item.name}
                                </LoadingButton>
                            )}
                            <Box>
                                {getResponseMessage(item.name) && (
                                    <Grid
                                        container
                                        sx={{
                                            p: 2,
                                            border: `1px solid #ddd`,
                                            backgroundColor: getResponseColor(item.name)
                                        }}
                                    >
                                        <Grid item xs={12}>
                                            <Typography variant="h6">
                                                {getResponseStatus(item.name) ? 'Response' : 'Request failed'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography
                                                variant="body2"
                                                fontWeight="100"
                                                fontSize="0.8em"
                                                style={{ wordWrap: 'break-word' }}
                                            >
                                                {getResponseMessage(item.name)}
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
                                            <IconButton
                                                aria-label="fingerprint"
                                                color="primary"
                                                onClick={() => copyToClipboard(getResponseMessage(item.name))}
                                            >
                                                <ContentCopyIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                )}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            );
        }
        // funcs.forEach((item) => {
        //     functions.push(
        //         <Grid item xs={12}>
        //             <MainCard xs={12}>
        //                 {/* <a id="url" href="https://metamask.app.link/dapp/b286-86-45-255-5.ngrok.io">
        //                     https://metamask.app.link/dapp/b286-86-45-255-5.ngrok.io
        //     </a> */}
        //                 <FormControl variant="standard">
        //                     {displayInputs(item)}
        //                     <Button variant="outlined" color={getButtonColor(item.stateMutability)} onClick={() => invokeFunction(item)}>
        //                         {item.name}
        //                     </Button>
        //                     <Box
        //                         sx={{
        //                             p: 2,
        //                             mt: 1,
        //                             backgroundColor: getResponseColor(item.name),
        //                             color: getResponseTextColor(item.name)
        //                         }}
        //                     >
        //                         {getResponseMessage(item.name) && isAddresss(getResponseMessage(item.name)) ? (
        //                             <Grid container>
        //                                 <Grid item xs={12}>
        //                                     <Typography variant="body2">
        //                                         {trimAddress(getResponseMessage(item.name))}
        //                                         <IconButton
        //                                             aria-label="fingerprint"
        //                                             color="primary"
        //                                             onClick={() => copyToClipboard(getResponseMessage(item.name))}
        //                                         >
        //                                             <ContentCopyIcon />
        //                                         </IconButton>
        //                                     </Typography>
        //                                 </Grid>
        //                                 <Grid item xs={12}>
        //                                     <Button
        //                                         variant="outlined"
        //                                         size="small"
        //                                         href={getExplorerAddressUrl(getResponseMessage(item.name))}
        //                                         target="_blank"
        //                                     >
        //                                         View in explorer
        //                                     </Button>
        //                                 </Grid>
        //                             </Grid>
        //                         ) : (
        //                             <Typography>{getResponseMessage(item.name)}</Typography>
        //                         )}
        //                     </Box>
        //                 </FormControl>
        //             </MainCard>
        //         </Grid>
        //     );
        // });
        return functions;
    };

    const legacy = (
        <Grid container>
            {config && displayMetadata()}
            {config && displayFunctions()}
        </Grid>
    );

    return (
        <Grid container>
            {displayFunctions()}
            {/* <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography>Collapsible Group Item #1</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet
                        blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                    <Typography>Collapsible Group Item #2</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet
                        amet blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                    <Typography>Collapsible Group Item #3</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet
                        amet blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
    </Accordion> */}
        </Grid>
    );
};

export default SmartContractTab;

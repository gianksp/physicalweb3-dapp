import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// project imports
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import useConfiguration from 'utils/hooks/useConfiguration';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const SupportGuard = ({ children }) => {
    const { Moralis } = useMoralis();
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const { config } = useConfiguration();

    const switchNetwork = async () => {
        const web3 = await Moralis.enableWeb3();
        const target = `0x${config.network.id.toString(16)}`;
        try {
            await web3.currentProvider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: target }]
            });
            console.log('right chain again?');
        } catch (error) {
            console.log('trying switch');
            if (error.code === 4902) {
                try {
                    console.log('swtching???');
                    await web3.currentProvider.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: target,
                                chainName: config.network.name,
                                rpcUrls: [config.network.rpcUrl],
                                nativeCurrency: {
                                    name: config.network.currencyName,
                                    symbol: config.network.currencySymbol,
                                    decimals: 18
                                },
                                blockExplorerUrls: [config.network.blockExplorerUrl]
                            }
                        ]
                    });
                } catch (error) {
                    alert(error.message);
                }
            }
        }
    };

    const validateBrowserSupport = () => {
        if (!window.ethereum) {
            navigate('deeplink', { replace: true });
        }
    };

    const validateChain = async () => {
        if (config && config.network) {
            console.log('Config loaded');
            const web3 = await Moralis.enableWeb3();
            const chainIdHex = web3.currentProvider.chainId;
            const chainIdDec = await web3.eth.getChainId();
            console.log(chainIdHex);
            console.log(chainIdDec);
            if (chainIdDec === config.network.id) {
                console.log('right chain!');
            } else {
                console.log('prompt switch network');
                switchNetwork();
            }
        }
    };

    useEffect(() => {
        // Is not web3 supported browser
        validateBrowserSupport();

        // Is wrong chain?
        validateChain();
    }, [isLoggedIn, navigate, config]);

    return children;
};

SupportGuard.propTypes = {
    children: PropTypes.node
};

export default SupportGuard;

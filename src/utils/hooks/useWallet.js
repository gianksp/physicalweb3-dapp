import { useState, useEffect } from 'react';
import { useMoralis, useMoralisWeb3ApiCall, useMoralisWeb3Api, useMoralisQuery, useMoralisCloudFunction } from 'react-moralis';
import useConfiguration from 'utils/hooks/useConfiguration';

const useWallet = () => {
    const { config = {} } = useConfiguration();
    const { isAuthenticated } = useMoralis();

    const Web3Api = useMoralisWeb3Api();
    // ------ Moralis Web3 API methods for Native, ERC20 & NFT  ---------
    const { fetch, data, error, isLoading } = useMoralisWeb3ApiCall(Web3Api.account.getNativeBalance, {
        chain: config.chain
    });

    const { fetch: tokenFetch, data: tokenData, error: tokenError, isLoading: tokenIsLoading } = useMoralisWeb3ApiCall(
        Web3Api.account.getTokenBalances,
        {
            chain: config.chain
        }
    );

    // const { fetch: nftFetch, data: nftData, error: nftError, isLoading: nftLoading } = useMoralisWeb3ApiCall(Web3Api.account.getNFTs, {
    //     config.chain
    // });

    // ----------------- Setting User in state   ----------
    // const [userState, setUserState] = useState(null);
    // const [openModel, setOpenModel] = useState(false);

    useEffect(() => {
        // call API every 5 seconds
        // const interval = setInterval(() => {
        if (isAuthenticated) {
            fetch();
            tokenFetch();
        }
        // }, 5000);
        // return () => clearInterval(interval);
    }, [isAuthenticated]);

    // // if chain is changed let the user know
    // Moralis.onChainChanged(async (chain) => {
    //     if (chain !== '0xa86a') {
    //         setOpenModel(true);
    //     } else {
    //         setOpenModel(false);
    //     }
    // });

    // useEffect(() => {
    //     function handleStatusChange(status) {
    //     setIsOnline(status.isOnline);
    //     }

    //     ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    //     return () => {
    //     ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    //     };
    // });

    return { isLoading, data, tokenIsLoading, tokenData };
};

export default useWallet;

import { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';

export default function useConfiguration() {
    const [config, loadConfig] = useState([]);
    const [applicationId, setApplicationId] = useState();
    const [isCorrectNetwork, setCorrectNetwork] = useState(false);
    const { Moralis } = useMoralis();

    const getAppIdFromQueryParams = () => {
        const comps = window.location.href.split('appId=');
        if (comps.length > 1) {
            return comps[1];
        }
        return null;
    };

    const loadConfigFromMoralis = async (appId) => {
        // Example appId=Hu6TBckWYLh2cHHFgPpEP37W
        const Controller = Moralis.Object.extend('Controller');
        const query = new Moralis.Query(Controller);
        query.equalTo('objectId', appId);
        const item = await query.first();
        loadConfig(item.attributes.configuration);
    };

    const loadConfigFromUri = async (uri) => {
        fetch(uri, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then((response) => response.json())
            .then((json) => loadConfig(json));
    };

    useEffect(() => {
        const appId = getAppIdFromQueryParams();
        if (appId && appId !== 'undefined') {
            // Fron App Id
            console.log(`From app Id ${appId}`);
            setApplicationId(appId);
            loadConfigFromMoralis(appId);
        } else {
            const localConfigUrl = process.env.REACT_APP_CONFIGURATION_URL;
            // From local file
            if (localConfigUrl) {
                console.log(`From local config ${localConfigUrl}`);
                loadConfigFromUri(localConfigUrl);
            }
        }
    }, []);

    useEffect(async () => {
        if (!config || !config.network) return;
        if (!Moralis) return;
        const web3Provider = await Moralis.enableWeb3();
        if (!web3Provider) return;
        const id = await web3Provider.eth.net.getId();
        if (!id) return;
        setCorrectNetwork(id === config.network.id);
    }, [Moralis, config]);

    return { config, applicationId, setApplicationId, isCorrectNetwork, setCorrectNetwork };
}

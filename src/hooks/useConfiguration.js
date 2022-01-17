import { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';

export default function useConfiguration() {
    const [config, loadConfig] = useState([]);
    const [applicationId, setApplicationId] = useState();
    const { Moralis } = useMoralis();

    const getAppIdFromQueryParams = () => {
        console.log(window.location.href);
        const urlParams = new URLSearchParams(window.location.href);
        const appId = urlParams.get('appId');
        console.log(appId);
        return appId;
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
        if (appId) {
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

    return { config, applicationId, setApplicationId };
}

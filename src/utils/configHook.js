import { useState, useEffect } from 'react';

export default function useConfig() {
    const [config, loadConfig] = useState([]);

    useEffect(() => {
        fetch('abi.json', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then((response) => response.json())
            .then((json) => loadConfig(json));
    }, []);

    return { config };
}

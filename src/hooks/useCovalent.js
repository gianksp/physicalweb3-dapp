import { useState, useEffect } from 'react';
import useConfiguration from 'hooks/useConfiguration';

export default function useCovalent() {
    const [tickerPrice, setTicketPrice] = useState();
    const [ticker, setTicker] = useState();
    const { config } = useConfiguration();

    useEffect(() => {
        const symbol = config?.network?.currencySymbol;
        if (symbol) {
            setTicker(symbol);
        }
    }, [config]);

    useEffect(() => {
        if (!ticker) return;
        const target = ticker.toLowerCase();
        const apiK = process.env.REACT_APP_COVALENT_KEY;
        fetch(`https://api.covalenthq.com/v1/pricing/tickers/?quote-currency=USD&format=JSON&tickers=${target}&key=${apiK}`)
            .then((response) => response.json())
            .then((response) => {
                try {
                    const sym = response?.data?.items[0];
                    if (sym.contract_ticker_symbol.toLowerCase() === target) {
                        setTicketPrice(sym.quote_rate);
                    }
                } catch (e) {
                    console.log(e);
                }
            });
    }, [ticker]);

    return { tickerPrice };
}

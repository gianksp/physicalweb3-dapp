import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// project imports
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { useMoralis } from 'react-moralis';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const SupportGuard = ({ children }) => {
    const { Moralis } = useMoralis();
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!window.ethereum) {
            navigate('deeplink', { replace: true });
        }
    }, [isLoggedIn, navigate]);

    return children;
};

SupportGuard.propTypes = {
    children: PropTypes.node
};

export default SupportGuard;

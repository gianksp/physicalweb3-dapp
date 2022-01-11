import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Box, Button, Container, Grid, Link, Typography } from '@mui/material';
import Avatar from 'ui-component/extended/Avatar';
import { useMoralis } from 'react-moralis';
import { useTheme, styled } from '@mui/material/styles';

import ProfileSection from 'layout/MainLayout/Header/ProfileSection';

const User = () => {
    const { authenticate, isAuthenticated, user = {} } = useMoralis();
    console.log(user);
    console.log(isAuthenticated);
    const loginButton = <Button onClick={() => authenticate()}>Sign in</Button>;
    const theme = useTheme();
    const userAvatar2 = isAuthenticated && <div>Welcome {user.get('username')}</div>;

    const userAvatar = isAuthenticated && <ProfileSection />;
    return isAuthenticated ? userAvatar : loginButton;
};

export default User;

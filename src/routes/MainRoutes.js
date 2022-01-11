import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import SupportGuard from 'utils/route-guard/SupportGuard';

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <SupportGuard>
            <MainLayout />
        </SupportGuard>
    ),
    children: []
};

export default MainRoutes;

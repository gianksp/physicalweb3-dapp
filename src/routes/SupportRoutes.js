import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import SupportGuard from 'utils/route-guard/SupportGuard';

// sample page routing
const DeeplinkPage = Loadable(lazy(() => import('views/deeplink-page')));

// ==============================|| MAIN ROUTING ||============================== //

const SupportRoutes = {
    path: '/deeplink',
    element: <DeeplinkPage />
};

export default SupportRoutes;

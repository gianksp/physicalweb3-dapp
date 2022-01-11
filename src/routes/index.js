import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import SupportRoutes from './SupportRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([MainRoutes, SupportRoutes]);
}

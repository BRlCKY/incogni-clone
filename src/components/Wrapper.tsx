import NavComp from "./NavComp";
import Dashboard from "./views/DashboardComp";
import Cases from "./views/CasesComp";
import HelpCenter from "./views/HelpCenterComp";
import Log from "./views/LogComp";
import Mail from "./views/MailComp";
import BrokerList from "./views/BrokerListComp";
import Settings from "./views/SettingsComp";

const views = ['DASHBOARD', 'CASES', 'HELPCENTER', 'LOG', 'MAIL', 'BROKERLIST', 'SETTINGS'];
let active_view = views[0];

const Wrapper = () => {
    return (
        <div>
            <NavComp />
            if (active_view === 'DASHBOARD') (
                <Dashboard />
            ) else if (active_view === 'CASES') (
                <Cases />
            ) else if (active_view === 'HELPCENTER') (
                <HelpCenter />
            ) else if (active_view === 'LOG') (
                <Log />
            ) else if (active_view === 'MAIL') (
                <Mail />
            ) else if (active_view === 'BROKERLIST') (
                <BrokerList />
            ) else if (active_view === 'SETTINGS') (
                <Settings />
            )
            <h1>Wrapper</h1>
        </div>
    )
};

export default Wrapper;
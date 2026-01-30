import { useState } from "react";
import NavComp from "./NavComp";
import Dashboard from "./views/DashboardComp";
import Cases from "./views/CasesComp";
import HelpCenter from "./views/HelpCenterComp";
import Log from "./views/LogComp";
import Mail from "./views/MailComp";
import BrokerList from "./views/BrokerListComp";
import Settings from "./views/SettingsComp";

const views = ['DASHBOARD', 'CASES', 'HELPCENTER', 'LOG', 'MAIL', 'BROKERLIST', 'SETTINGS'];

const Wrapper = () => {
    const [active_view, setActiveView] = useState(views[0]);

    const handleNavClick = (index: number) => {
        setActiveView(views[index]);
    };

    return (
        <div>
            <NavComp onNavClick={handleNavClick} />
            {active_view === 'DASHBOARD' && <Dashboard />}
            {active_view === 'CASES' && <Cases />}
            {active_view === 'HELPCENTER' && <HelpCenter />}
            {active_view === 'LOG' && <Log />}
            {active_view === 'MAIL' && <Mail />}
            {active_view === 'BROKERLIST' && <BrokerList />}
            {active_view === 'SETTINGS' && <Settings />}
        </div>
    )
};

export default Wrapper;
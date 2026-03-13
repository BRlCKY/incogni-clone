import { useState } from "react";
import NavComp from "./NavComp";
import Dashboard from "./views/DashboardComp";
import Cases from "./views/CasesComp";
import HelpCenter from "./views/HelpCenterComp";
import Log from "./views/LogComp";
import Mail from "./views/MailComp";
import BrokerList from "./views/BrokerListComp";
import Settings from "./views/SettingsComp";
import ColorBlendBackground from "./backgrounds/ColorBlendBackground";

const view_data = {
    'DASHBOARD': { icon: 'dashboard.svg', alt: 'dashboard', text: 'Dashboard' },
    'CASES': { icon: 'cases.svg', alt: 'cases', text: 'Einzelfälle' },
    'HELPCENTER': { icon: 'help.svg', alt: 'helpcenter', text: 'Hilfe' },
    'LOG': { icon: 'log.svg', alt: 'log', text: 'Logs' },
    'MAIL': { icon: 'mail.svg', alt: 'mail', text: 'Benachrichtigungen' },
    'BROKERLIST': { icon: 'broker.svg', alt: 'brokerlist', text: 'Broker Liste' },
    'SETTINGS': { icon: 'settings.svg', alt: 'settings', text: 'Einstellungen' },
}

const Wrapper = () => {
    const [active_view, setActiveView] = useState(Object.keys(view_data)[0]);

    const handleNavClick = (key: string) => {
        setActiveView(key);
    };

    return (
        <div>
            <NavComp onNavClick={handleNavClick} viewData={view_data} />
            {active_view === 'DASHBOARD' && <Dashboard onTileClick={handleNavClick} />}
            {active_view === 'CASES' && <Cases />}
            {active_view === 'HELPCENTER' && <HelpCenter />}
            {active_view === 'LOG' && <Log />}
            {active_view === 'MAIL' && <Mail />}
            {active_view === 'BROKERLIST' && <BrokerList />}
            {active_view === 'SETTINGS' && <Settings />}
            <div className="fixed w-full h-full -z-50 top-0 left-0">
                <ColorBlendBackground />
            </div>
        </div>
    )
};

export default Wrapper;
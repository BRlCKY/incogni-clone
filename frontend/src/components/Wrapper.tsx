import { useEffect, useState } from "react";
import NavComp from "./NavComp";
import Dashboard from "./views/DashboardComp";
import Cases from "./views/CasesComp";
import HelpCenter from "./views/HelpCenterComp";
import Log from "./views/LogComp";
import Mail from "./views/MailComp";
import BrokerList from "./views/BrokerListComp";
import Settings from "./views/SettingsComp";
import PresetComp, { type Template } from "./views/PresetComp";
import ColorBlendBackground from "./backgrounds/ColorBlendBackground";
import OnboardingComp from "./views/OnboardingComp";
import OnboardingDataComp from "./views/OnboardingDataComp";
import LoginComp from "./views/LoginComp";
import {
    getAuthenticated,
    getOnboardingCompleted,
    getOnboardingPasswordStepCompleted,
    getPasswordRequired,
    setAuthenticated,
    setOnboardingCompleted,
    setOnboardingPasswordStepCompleted,
    setPasswordRequired,
} from "../utils/appAccess";

const view_data = {
    'DASHBOARD': { icon: 'dashboard.svg', alt: 'dashboard', text: 'Dashboard' },
    'CASES': { icon: 'cases.svg', alt: 'cases', text: 'Einzelfälle' },
    'HELPCENTER': { icon: 'help.svg', alt: 'helpcenter', text: 'Hilfe' },
    'LOG': { icon: 'log.svg', alt: 'log', text: 'Logs' },
    'MAIL': { icon: 'mail.svg', alt: 'mail', text: 'Benachrichtigungen' },
    'BROKERLIST': { icon: 'broker.svg', alt: 'brokerlist', text: 'Broker Liste' },
    'SETTINGS': { icon: 'settings.svg', alt: 'settings', text: 'Einstellungen' },
}

type AuthStatePayload = {
    passwordConfigured: boolean;
    onboardingCompleted: boolean;
};

type AccessScreen = "LOADING" | "ONBOARDING" | "ONBOARDING_DATA" | "LOGIN" | "APP";

const Wrapper = () => {
    const [active_view, setActiveView] = useState(Object.keys(view_data)[0]);
    const [presetTemplate, setPresetTemplate] = useState<Template>();
    const [isLoadingAccessState, setIsLoadingAccessState] = useState(true);
    const [onboardingCompleted, setOnboardingCompletedState] = useState(getOnboardingCompleted);
    const [passwordStepCompleted, setPasswordStepCompleted] = useState(getOnboardingPasswordStepCompleted);
    const [passwordRequired, setPasswordRequiredState] = useState(getPasswordRequired);
    const [isAuthenticated, setIsAuthenticatedState] = useState(getAuthenticated);

    useEffect(() => {
        let isMounted = true;

        const loadAuthState = async () => {
            try {
                const response = await fetch("http://localhost:3000/auth/state");
                if (!response.ok) {
                    throw new Error(`Failed to load auth state (${response.status})`);
                }

                const payload = (await response.json()) as AuthStatePayload;

                if (!isMounted) {
                    return;
                }

                setPasswordRequiredState(Boolean(payload.passwordConfigured));
                setPasswordRequired(Boolean(payload.passwordConfigured));
                setOnboardingCompletedState(Boolean(payload.onboardingCompleted));
                setOnboardingCompleted(Boolean(payload.onboardingCompleted));

                if (!payload.passwordConfigured) {
                    setIsAuthenticatedState(true);
                    setAuthenticated(true);
                }
            } catch (error) {
                console.error("Failed to load auth state:", error);
            } finally {
                if (isMounted) {
                    setIsLoadingAccessState(false);
                }
            }
        };

        void loadAuthState();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleNavClick = (key: string) => {
        setActiveView(key);
    };

    const onPasswordConfigured = () => {
        setPasswordRequiredState(true);
        setPasswordRequired(true);
        setIsAuthenticatedState(true);
        setAuthenticated(true);
    };

    const onOnboardingPasswordStepCompleted = () => {
        setPasswordStepCompleted(true);
        setOnboardingPasswordStepCompleted(true);
    };

    const onOnboardingCompleted = () => {
        setOnboardingCompletedState(true);
        setOnboardingCompleted(true);

        setPasswordStepCompleted(false);
        setOnboardingPasswordStepCompleted(false);

        setIsAuthenticatedState(true);
        setAuthenticated(true);
    };

    const onLoginSuccess = () => {
        setIsAuthenticatedState(true);
        setAuthenticated(true);
    };

    const accessScreen: AccessScreen = isLoadingAccessState
        ? "LOADING"
        : !onboardingCompleted && passwordStepCompleted
          ? "ONBOARDING_DATA"
          : !onboardingCompleted && passwordRequired && !isAuthenticated
            ? "LOGIN"
            : !onboardingCompleted && passwordRequired && isAuthenticated
              ? "ONBOARDING_DATA"
              : !onboardingCompleted
                ? "ONBOARDING"
                : passwordRequired && !isAuthenticated
                  ? "LOGIN"
                  : "APP";

    if (accessScreen === "LOADING") {
        return (
            <div className="min-h-screen w-full flex items-center justify-center text-gray-300">
                Lade Anwendung...
            </div>
        );
    }

    if (accessScreen === "ONBOARDING") {
        return (
            <OnboardingComp
                onPasswordConfigured={onPasswordConfigured}
                onContinueToData={onOnboardingPasswordStepCompleted}
            />
        );
    }

    if (accessScreen === "ONBOARDING_DATA") {
        return <OnboardingDataComp onOnboardingComplete={onOnboardingCompleted} />;
    }

    if (accessScreen === "LOGIN") {
        return <LoginComp onLoginSuccess={onLoginSuccess} />;
    }

    return (
        <div>
            <NavComp onNavClick={handleNavClick} viewData={view_data} />
            {active_view === 'DASHBOARD' && <Dashboard onTileClick={handleNavClick} />}
            {active_view === 'CASES' && <Cases />}
            {active_view === 'HELPCENTER' && <HelpCenter />}
            {active_view === 'LOG' && <Log />}
            {active_view === 'MAIL' && <Mail />}
            {active_view === 'BROKERLIST' && <BrokerList />}
            {active_view === 'SETTINGS' && <Settings onOpenPreset={() => setActiveView('PRESET')} />}
            {active_view === 'PRESET' && (
                <PresetComp
                    initialTemplate={presetTemplate}
                    onBack={() => setActiveView('SETTINGS')}
                    onSave={(template) => {
                        setPresetTemplate(template);
                        setActiveView('SETTINGS');
                    }}
                />
            )}
            <div className="fixed w-full h-full -z-50 top-0 left-0">
                <ColorBlendBackground />
            </div>
        </div>
    )
};

export default Wrapper;

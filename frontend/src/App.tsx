import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";
import Wrapper from "./components/Wrapper";
import LoginComp from "./components/views/LoginComp";
import OnboardingComp from "./components/views/OnboardingComp";
import OnboardingDataComp from "./components/views/OnboardingDataComp";
import SettingsComp from "./components/views/SettingsComp";

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Wrapper />} />
			<Route path="/login" element={<LoginComp />} />
			<Route path="/onboarding" element={<OnboardingComp />} />
			<Route path="/onboarding/data" element={<OnboardingDataComp />} />
			<Route path="/settings" element={<SettingsComp />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
);

export default App;

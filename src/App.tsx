import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";
import Wrapper from "./components/Wrapper";
import LoginComp from "./components/views/LoginComp";
import OnboardingComp from "./components/views/OnboardingComp";

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Wrapper />} />
			<Route path="/login" element={<LoginComp />} />
			<Route path="/onboarding" element={<OnboardingComp />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
);

export default App;
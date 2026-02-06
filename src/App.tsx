import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./NotFound";
import Wrapper from "./components/Wrapper";
import LogComp from "./components/views/LogComp";

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Wrapper />} />
			<Route path="/log" element={<LogComp />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
);

export default App;
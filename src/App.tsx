import { BrowserRouter, Route, Routes } from "react-router-dom";
import LogPage from "./components/view_log/LogPage";
import NotFound from "./NotFound";
import LogComp from "./components/views/LogComp";

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<LogComp />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
);

export default App;
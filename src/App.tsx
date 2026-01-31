import { BrowserRouter, Route, Routes } from "react-router-dom";
import LogPage from "./components/view_log/LogPage";
import NotFound from "./NotFound";
import SelectComp from "./components/SelectComp";

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<SelectComp />} />
			<Route path="/logs" element={<LogPage />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
);

export default App;
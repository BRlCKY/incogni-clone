import { BrowserRouter, Route, Routes } from "react-router-dom";
import LogPage from "./components/view_log/LogPage";
import NotFound from "./NotFound";

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<LogPage />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
);

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelectComp from "./components/SelectComp";
import NotFound from "./NotFound";
import ListElement from "./components/logs/ListElement";

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<ListElement />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
);

export default App;
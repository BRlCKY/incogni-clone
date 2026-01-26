import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelectComp from "./components/SelectComp";
import NotFound from "./NotFound";

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<SelectComp />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
);

export default App;
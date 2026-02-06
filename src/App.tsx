import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./NotFound";
import Wrapper from "./components/Wrapper";

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Wrapper />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
);

export default App;
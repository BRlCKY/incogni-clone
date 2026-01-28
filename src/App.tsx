import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./NotFound";
import Wrapper from "./components/Wrapper";
/* import NavComp from "./components/NavComp"; */

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Wrapper />} />
			{/* <Route path="/nav" element={<NavComp />} /> */}
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
);

export default App;
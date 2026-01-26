import React, { useState } from "react";
import Select from "react-select";

const options = [
	{ value: 'color-red', label: 'Red' },
	{ value: 'color-green', label: 'Green' },
	{ value: 'color-blue', label: 'Blue' },
];

const SelectComp = () => {
	const [values, setValues] = useState<any[]>([]);

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="p-4" style={{ width: "500px" }}>
				<h1 className="text-2xl mb-4">Select example</h1>
				<div style={{ paddingBottom: 50 }}>
					<Select
						options={options}
						value={values}
						onChange={(selected) => setValues((selected as any) || [])}
						isMulti
						isSearchable
						isClearable
						placeholder="Choose Color…"
						menuPosition="fixed"
						menuPlacement="bottom"
					/>
				</div>
			</div>
		</div>
	);
};

export default SelectComp;
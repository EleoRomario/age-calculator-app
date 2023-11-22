import { useEffect, useState } from "react";

const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const day = new Date().getDate();

const Input = ({
	text,
	name,
	value,
	handleChange,
	placeholder,
	errors,
	maxLength,
}) => {
	return (
		<>
			<div className="flex flex-col gap-2">
				<label
					className={`${
						errors ? "text-red-600" : "text-text"
					} text-xs font-semibold uppercase`}
				>
					{text}
				</label>
				<input
					type="number"
					maxLength={maxLength}
					name={name}
					value={value}
					onChange={handleChange}
					className={`input-number ${
						errors ? "border-red-600" : "border-gray-300"
					} border rounded-lg h-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent p-4 w-24 text-black text-lg font-bold`}
					placeholder={placeholder}
					min={1}
				/>
				{errors ? (
					<label className="text-xs italic text-red-600 w-32">
						{errors}
					</label>
				) : null}
			</div>
		</>
	);
};

const Label = ({ text, value }) => {
	return (
		<li>
			<p className="text-5xl md:text-7xl font-black italic">
				<span className="text-primary">{value || "--"}</span> {text}
			</p>
		</li>
	);
};
export const Form = () => {
	const [inputFields, setInputFields] = useState({
		day: "",
		month: "",
		year: "",
	});

	const [fieldsConverter, setFieldsConverter] = useState({
		day: "",
		month: "",
		year: "",
	});

	const [errors, setErrors] = useState({});

	const [submitting, setSubmitting] = useState(false);

	const daysOfMonth = (month, year) => {
		const lastDay = new Date(year, month, 0).getDate();
		return lastDay;
	};

	const validateValues = (inputValues) => {
		let errors = {};
		if (!inputValues.day) {
			errors.day = "Day is required";
		}
		if (inputValues.day > 31) errors.day = "Day must be less than 31";
		if (daysOfMonth(inputValues.month, inputValues.year) < inputValues.day)
			errors.day = "Day must be less than days of month";

		if (!inputValues.month) {
			errors.month = "Month is required";
		}
		if (inputValues.month > 12) errors.month = "Month must be less than 12";

		if (!inputValues.year) {
			errors.year = "Year is required";
		}
		if (inputValues.year > year)
			errors.year = "Year must be less than current year";

		return errors;
	};

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setInputFields({ ...inputFields, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setErrors(validateValues(inputFields));
		setSubmitting(true);
	};

	const finishSubmit = () => {
		let years = year - inputFields.year;
		let months = month - inputFields.month;
		let days = day - inputFields.day;

		if (months < 0 || (months === 0 && days < 0)) {
			years -= 1;
			months += 12;
		}
		if (days < 0) {
			months -= 1;
			const prevMonth = new Date(year, month - 1, 1);
			days += new Date(
				prevMonth.getFullYear(),
				prevMonth.getMonth() + 1,
				0
			).getDate();
		}

		setFieldsConverter({
			day: days,
			month: months,
			year: years,
		});
		setSubmitting(false);
	};

	useEffect(() => {
		if (Object.keys(errors).length === 0 && submitting) {
			finishSubmit();
		}
	}, [errors]);

	return (
		<div>
			<form className="flex flex-col gap-4" autoComplete="off">
				<div className="flex gap-4">
					<Input
						text={"day"}
						name={"day"}
						value={inputFields.day}
						handleChange={handleChangeInput}
						placeholder={"DD"}
						errors={errors.day}
						maxLength={2}
					/>
					<Input
						text={"month"}
						name={"month"}
						value={inputFields.month}
						handleChange={handleChangeInput}
						placeholder={"MM"}
						errors={errors.month}
						maxLength={2}
					/>
					<Input
						text={"year"}
						name={"year"}
						value={inputFields.year}
						handleChange={handleChangeInput}
						placeholder={"YYYY"}
						errors={errors.year}
						maxLength={4}
					/>
				</div>
				<div className="flex w-full justify-center items-center relative h-20">
					<div className="bg-gray-200 h-[1px] w-full sm:w-[380px] " />
					<button
						onClick={handleSubmit}
						className="bg-primary hover:bg-black rounded-full text-white flex p-6 items-center justify-center transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:border-none
						absolute md:relative"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="46"
							height="44"
							viewBox="0 0 46 44"
							className="w-8 h-8"
						>
							<g fill="none" stroke="#FFF" strokeWidth="2">
								<path d="M1 22.019C8.333 21.686 23 25.616 23 44M23 44V0M45 22.019C37.667 21.686 23 25.616 23 44"></path>
							</g>
						</svg>
					</button>
				</div>
			</form>
			<div>
				<ul>
					<Label
						text={`year${fieldsConverter.year > 1 ? "s" : ""}`}
						value={fieldsConverter.year}
					/>
					<Label
						text={`month${fieldsConverter.month > 1 ? "s" : ""}`}
						value={fieldsConverter.month}
					/>
					<Label
						text={`day${fieldsConverter.day > 1 ? "s" : ""}`}
						value={fieldsConverter.day}
					/>
				</ul>
			</div>
		</div>
	);
};

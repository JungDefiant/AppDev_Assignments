import { useCallback, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

type Inputs = {
	fullName: string;
	emailAddress: string;
	password: string;
	confirmPassword: string;
	accountRole: string;
	termsConditions: boolean;
};

export default function App() {
	const accountRoles = ["Developer", "Designer", "Product Manager"];
	const defaultValues = {
		fullName: "",
		emailAddress: "",
		password: "",
		confirmPassword: "",
		accountRole: "",
		termsConditions: false,
	};

	const {
		control,
		register,
		handleSubmit,
		setFocus,
		reset,
		getValues,
		formState: { isSubmitted, errors },
	} = useForm<Inputs>({
		defaultValues,
	});

	const onSubmit: SubmitHandler<Inputs> = () => {
		setTimeout(() => {
			reset(defaultValues);
		}, 2000);
	};

	const resetAsyncForm = useCallback(async () => {
		reset(defaultValues);
	}, [reset]);

	useEffect(() => {
		resetAsyncForm();
	}, [resetAsyncForm]);

	useWatch({
		control,
		compute: (data: Inputs) => {
			localStorage.setItem("fullName", data.fullName);
			localStorage.setItem("emailAddress", data.emailAddress);
			localStorage.setItem("password", data.password);
			localStorage.setItem("accountRole", data.accountRole);
			localStorage.setItem("termsConditions", data.termsConditions.toString());
		},
	});

	useEffect(() => {
		setFocus("fullName");
	}, []);

	return (
		<form
			style={{
				display: "flex",
				flexDirection: "column",
				alignContent: "center",
				gap: 16,
			}}
			onSubmit={handleSubmit(onSubmit)}
		>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<label>Full Name</label>
				<input {...register("fullName", { required: true, min: 3 })} />
				{errors.fullName && <p>This field is required</p>}
			</div>

			<div style={{ display: "flex", flexDirection: "column" }}>
				<label>Email Address</label>
				<input
					{...register("emailAddress", {
						required: true,
						pattern: /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/,
					})}
				/>
				{errors.emailAddress && <p>Enter a proper email address</p>}
			</div>

			<div style={{ display: "flex", flexDirection: "column" }}>
				<label>Password</label>
				<input
					{...register("password", {
						required: true,
						min: 8,
						validate: {
							lowerCase: (pwd) => pwd.match(/[a-z]/) !== null,
							upperCase: (pwd) => pwd.match(/[A-Z]/) !== null,
							number: (pwd) => pwd.match(/\d/) !== null,
						},
					})}
				/>
				{errors.password && (
					<p>
						Invalid password. Requires 8 minimum characters, 1 uppercase
						character, 1 lowercase character, and 1 number.
					</p>
				)}

				<label>Confirm Password</label>
				<input
					{...register("confirmPassword", {
						required: true,
						validate: {
							pwdMatch: (pwd) => pwd === getValues("password"),
						},
					})}
				/>
				{errors.confirmPassword && <p>Passwords do not match!</p>}
			</div>

			<div style={{ display: "flex", flexDirection: "column" }}>
				<label>Account Role</label>
				<select
					{...register("accountRole", {
						required: true,
						validate: {
							emptyValue: (v) => v !== "",
						},
					})}
				>
					<option value={""} disabled>
						Select an Account Role
					</option>
					{accountRoles.map((role) => {
						return (
							<option key={role.trim().toLowerCase()} value={role}>
								{role}
							</option>
						);
					})}
				</select>
				{errors.accountRole && <p>This field is required</p>}
			</div>

			<div>
				<label>Terms & Conditions </label>
				<input
					type="checkbox"
					{...register("termsConditions", { required: true })}
				/>
				{errors.termsConditions && <p>This field is required</p>}
			</div>

			{isSubmitted && !errors ? (
				<span>Registering...</span>
			) : (
				<input type="submit" />
			)}
		</form>
	);
}

// components/SubmitButton.jsx
export default function SubmitButton({
	isSubmitting = false,
	loadingText = "Loading...",
	children = "Submit",
	className = "",
	...props
}) {
	return (
		<button
			type="submit"
			disabled={isSubmitting}
			className={`w-full bg-amber-400 text-black font-medium py-2.5 rounded-lg hover:bg-amber-500 disabled:opacity-50 ${className}`}
			{...props}
		>
			{isSubmitting ? loadingText : children}
		</button>
	);
}

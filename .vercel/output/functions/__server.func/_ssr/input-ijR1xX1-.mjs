import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { o as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as useBrand } from "./router-C2RzFU3r.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-ijR1xX1-.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function BrandMark({ className }) {
	const { brand } = useBrand();
	if (brand.logoUrl) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: brand.logoUrl,
		alt: "",
		className: cn("h-8 w-8 object-contain", className)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("h-8 w-8", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "32",
				height: "32",
				rx: "8",
				fill: "currentColor",
				className: "text-primary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "10",
				fill: "currentColor",
				className: "text-bg"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "5",
				fill: "currentColor",
				className: "text-primary"
			})
		]
	});
}
function Wordmark({ className }) {
	const { brand } = useBrand();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: cn("flex items-center gap-2 text-fg no-underline", className),
		"aria-label": brand.appName,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-xl tracking-tight",
			children: brand.appName
		})]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-[opacity,transform,background-color] duration-[var(--motion-fast,250ms)] ease-[var(--ease-smooth-out,cubic-bezier(0.22,1,0.36,1))] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] min-h-11", {
	variants: {
		variant: {
			primary: "bg-primary text-primary-fg hover:opacity-92",
			secondary: "bg-surface-2 text-fg hover:bg-surface",
			outline: "border border-border bg-surface text-fg hover:bg-surface-2",
			ghost: "text-fg hover:bg-surface-2",
			danger: "bg-danger text-primary-fg hover:opacity-92"
		},
		size: {
			md: "rounded-[var(--radius-md)] px-4 text-sm",
			lg: "rounded-[var(--radius-lg)] px-5 text-base",
			sm: "min-h-9 rounded-[var(--radius-sm)] px-3 text-sm",
			icon: "size-11 rounded-full p-0"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("flex min-h-11 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-base text-fg placeholder:text-subtle", className),
		...props
	});
}
//#endregion
export { cn as i, Input as n, Wordmark as r, Button as t };

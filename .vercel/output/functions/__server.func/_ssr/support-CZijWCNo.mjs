import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as useT } from "./router-C2RzFU3r.mjs";
import { t as Button } from "./input-ijR1xX1-.mjs";
import { l as useCurrentUserState, n as RedirectToSignIn, t as CustomerShell } from "./shell-m3G8JeAX.mjs";
import { a as listTickets, t as createTicket } from "./account-kZN00YTD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/support-CZijWCNo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TOPICS = [
	"where",
	"issue",
	"missing",
	"wrong",
	"payment",
	"cancel",
	"refund",
	"restaurant",
	"delivery",
	"other"
];
function SupportPage() {
	const { t } = useT();
	const { user, isPending } = useCurrentUserState();
	const [topic, setTopic] = (0, import_react.useState)("issue");
	const [message, setMessage] = (0, import_react.useState)("");
	const tickets = useQuery({
		queryKey: ["tickets"],
		queryFn: () => listTickets(),
		enabled: Boolean(user)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6",
		children: t("common.loading")
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: t("support.title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: t("support.hint")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					createTicket({ data: {
						topic,
						message
					} }).then(() => {
						setMessage("");
						toast.success(t("support.sent"));
						tickets.refetch();
					}).catch((err) => toast.error(err.message));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: [t("support.topic"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "mt-1 min-h-11 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3",
							value: topic,
							onChange: (e) => setTopic(e.target.value),
							children: TOPICS.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: key,
								children: t(`support.topics.${key}`)
							}, key))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: [t("support.message"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "mt-1 min-h-28 w-full rounded-[var(--radius-md)] border border-border bg-surface p-3",
							value: message,
							onChange: (e) => setMessage(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: t("support.send")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 font-display text-xl",
				children: t("support.tickets")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: (tickets.data?.tickets ?? []).map((tk) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-[var(--radius-lg)] bg-surface p-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: tk.topic
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: tk.message
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: tk.status
						})
					]
				}, tk.id))
			})
		]
	}) });
}
//#endregion
export { SupportPage as component };

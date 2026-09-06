//#region node_modules/.nitro/vite/services/ssr/assets/ids-BXI880_N.js
function newId(prefix) {
	return `${prefix}_${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().replace(/-/g, "").slice(0, 16) : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`}`;
}
function publicOrderCode(prefix) {
	const d = /* @__PURE__ */ new Date();
	return `${prefix}-${d.getFullYear().toString().slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
//#endregion
export { publicOrderCode as n, newId as t };

import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as authMiddleware } from "./middleware-ClaReecg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-zazn1Q7j.js
var placeOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("eff383686543aaf1d3781cf0aaa6a0b80974ddd9537d83f9cfc933b88b01f00f"));
var listMyOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d2d387e734d2b9ad38ff263d4ea22b591a11097849ddb7e854b3d1896e2dcb7e"));
var getMyOrder = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("4096b2026b038348e3866bd521ecc67e4d87fd9fb2bcbcb5a8b133f4d5ff293e"));
var cancelMyOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ce04adca7d8cf2e5655362378bfcda50dea2e05cc45f2f7d630ee90c323d90db"));
var advanceSimulatedOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("1b802b8c3455fb8f760dacc7746a602f14752310da779e615e7d3dc0919f5938"));
//#endregion
export { placeOrder as a, listMyOrders as i, cancelMyOrder as n, getMyOrder as r, advanceSimulatedOrder as t };

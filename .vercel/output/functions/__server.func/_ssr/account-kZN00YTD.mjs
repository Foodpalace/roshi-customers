import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as authMiddleware } from "./middleware-ClaReecg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-kZN00YTD.js
var ensureProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input ?? {}).handler(createSsrRpc("490861950fcd9141aae2f9961856697ed1cd40bc0b57e671ffd85e45abab75df"));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("f23116ccd8021e4eeff9e6ee47ae6b15fe44fb917fc10a9b79071c37d0dc7437"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e9e656cc52a0ab54c1451c3c6bcdd4d0c9183d44cb3e36a4a6ae12a241c117cd"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("b47af9d3d84286eef9854674463db25394f27cea97c0ad52dc494cd2b2a830cc"));
var toggleFavourite = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("8c5a873bcf5cb2ad5b118fc3b6176d3ac9a59a3393741e6f2b0bb1dc4a7ba57e"));
var listPromos = createServerFn({ method: "GET" }).handler(createSsrRpc("8d9f7913dc9f0b5ee4b00c3771467f47af7f528d52953603105c30f71ac77ef7"));
var getLoyalty = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("176cd1deb4152d5d1d1952e0ad6ad1181b4a9b922fb3a330cd6f5f0551e86ed3"));
var requestDeletion = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("8f2fa14fb93a2d34001d031b150820b95051f162ff04d95ce01d42657bbc5c68"));
var createTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("c6868e2d4a4fe12a40bca7379e178fc4d2f3b57d25db966dc42dfca2cd1fd5c8"));
var listTickets = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("30becb3d60b6e5c654fafb211acf4d70b656e20cc26203ff60f1301a75df8dd7"));
//#endregion
export { listTickets as a, updateProfile as c, listPromos as i, ensureProfile as n, requestDeletion as o, getLoyalty as r, toggleFavourite as s, createTicket as t };

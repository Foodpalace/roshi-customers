//#region node_modules/.nitro/vite/services/ssr/assets/geo-VuaDxie_.js
/** Haversine distance in kilometres. Coordinates are WGS84. */
var EARTH_KM = 6371;
function distanceKm(a, b) {
	const toRad = (d) => d * Math.PI / 180;
	const dLat = toRad(b.lat - a.lat);
	const dLng = toRad(b.lng - a.lng);
	const lat1 = toRad(a.lat);
	const lat2 = toRad(b.lat);
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
	return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}
function travelMinutes(distanceKmValue, speedKmh = 18) {
	if (distanceKmValue <= 0) return 5;
	return Math.max(5, Math.round(distanceKmValue / speedKmh * 60));
}
//#endregion
export { travelMinutes as n, distanceKm as t };

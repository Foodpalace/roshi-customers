//#region node_modules/.nitro/vite/services/ssr/assets/pricing-CnXKp7tT.js
function applyBps(amountPaise, bps) {
	if (bps <= 0 || amountPaise <= 0) return 0;
	return Math.floor(amountPaise * bps / 1e4);
}
function formatPaise(paise, opts) {
	const currency = opts?.currency ?? "INR";
	const locale = opts?.locale ?? "en-IN";
	const abs = Math.abs(paise) / 100;
	const formatted = new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(abs);
	if (paise < 0) return `−${formatted}`;
	if (opts?.signed && paise > 0) return `+${formatted}`;
	return formatted;
}
function formatPaiseCompact(paise, locale = "en-IN") {
	const rupees = paise / 100;
	const rounded = Math.round(rupees);
	if (Math.abs(paise) % 100 === 0) return `₹${new Intl.NumberFormat(locale).format(rounded)}`;
	return formatPaise(paise, { locale });
}
function deliveryFeePaise(distanceKm, fees, foodAfterDiscounts) {
	const distanceComponent = Math.round(distanceKm * fees.deliveryPerKmPaise);
	let delivery = Math.max(0, fees.deliveryBasePaise + distanceComponent);
	if (fees.deliveryFreeOverPaise != null && foodAfterDiscounts >= fees.deliveryFreeOverPaise) delivery = 0;
	return Math.round(delivery / 100) * 100;
}
function splitDiscount(amount, fundedBy) {
	if (fundedBy === "RESTAURANT") return {
		restaurant: amount,
		platform: 0
	};
	if (fundedBy === "PLATFORM") return {
		restaurant: 0,
		platform: amount
	};
	const restaurant = Math.floor(amount / 2);
	return {
		restaurant,
		platform: amount - restaurant
	};
}
function computePromoDiscount(foodPaise, promo, isFirstOrder) {
	if (!promo) return 0;
	if (promo.firstOrderOnly && !isFirstOrder) return 0;
	if (foodPaise < promo.minOrderPaise) return 0;
	let disc = 0;
	if (promo.kind === "percent" && promo.percentBps != null) disc = applyBps(foodPaise, promo.percentBps);
	else if (promo.kind === "fixed" && promo.amountPaise != null) disc = promo.amountPaise;
	if (promo.maxDiscountPaise != null) disc = Math.min(disc, promo.maxDiscountPaise);
	return Math.max(0, Math.min(disc, foodPaise));
}
function computeQuote(input) {
	const blockers = [];
	const foodSubtotalPaise = input.lines.reduce((sum, line) => {
		if (!line.available) blockers.push("UNAVAILABLE_ITEM");
		return sum + line.unitPaise * line.quantity;
	}, 0);
	if (input.lines.length === 0) blockers.push("EMPTY_CART");
	if (foodSubtotalPaise < input.fees.minOrderPaise) blockers.push("MIN_ORDER");
	const promoDiscount = computePromoDiscount(foodSubtotalPaise, input.promo, input.isFirstOrder);
	const split = input.promo ? splitDiscount(promoDiscount, input.promo.fundedBy) : {
		restaurant: 0,
		platform: 0
	};
	const restaurantDiscountPaise = split.restaurant;
	const platformDiscountPaise = split.platform;
	const foodAfterDiscounts = foodSubtotalPaise - restaurantDiscountPaise - platformDiscountPaise;
	const packagingPaise = Math.max(0, input.packagingPaise);
	const deliveryFeePaiseValue = deliveryFeePaise(input.distanceKm, input.fees, foodAfterDiscounts);
	const serviceFeePaise = Math.max(0, input.fees.serviceFeePaise) + applyBps(foodSubtotalPaise, input.fees.serviceFeeBps);
	let taxPaise = 0;
	if (!input.fees.menuPricesIncludeTax) taxPaise += applyBps(foodAfterDiscounts, input.fees.menuTaxBps);
	taxPaise += applyBps(serviceFeePaise, input.fees.serviceTaxBps);
	taxPaise += applyBps(deliveryFeePaiseValue, input.fees.deliveryTaxBps);
	const totalPaise = foodAfterDiscounts + packagingPaise + deliveryFeePaiseValue + serviceFeePaise + taxPaise;
	const commissionBps = input.commissionBps;
	const foodForCommission = foodSubtotalPaise - restaurantDiscountPaise;
	const commissionPaise = applyBps(foodForCommission, commissionBps);
	const restaurantPayablePaise = foodForCommission - commissionPaise + packagingPaise;
	const lines = [{
		code: "FOOD",
		name: "Food",
		amountPaise: foodSubtotalPaise,
		source: "item",
		fundedBy: "CUSTOMER",
		reason: "Sum of item prices including chosen variants and add-ons."
	}];
	if (restaurantDiscountPaise) lines.push({
		code: "RESTAURANT_DISCOUNT",
		name: input.promo?.name ?? "Kitchen discount",
		amountPaise: -restaurantDiscountPaise,
		source: "promotion",
		fundedBy: "RESTAURANT",
		reason: "Discount funded by the kitchen, not by the platform."
	});
	if (platformDiscountPaise) lines.push({
		code: "PLATFORM_DISCOUNT",
		name: input.promo?.name ?? "Platform discount",
		amountPaise: -platformDiscountPaise,
		source: "promotion",
		fundedBy: "PLATFORM",
		reason: "Discount funded by the platform. The kitchen is not charged for this amount."
	});
	if (packagingPaise) lines.push({
		code: "PACKAGING",
		name: "Packaging",
		amountPaise: packagingPaise,
		source: "packaging",
		fundedBy: "CUSTOMER",
		reason: "Packaging charged by the kitchen and paid through to the kitchen."
	});
	lines.push({
		code: "DELIVERY",
		name: "Delivery",
		amountPaise: deliveryFeePaiseValue,
		source: "delivery",
		fundedBy: "CUSTOMER",
		reason: deliveryFeePaiseValue === 0 ? "Delivery waived because the order crossed the free-delivery threshold." : "Base delivery fee plus distance component for this zone."
	});
	if (serviceFeePaise) lines.push({
		code: "SERVICE",
		name: "Service fee",
		amountPaise: serviceFeePaise,
		source: "service",
		fundedBy: "CUSTOMER",
		reason: "Optional platform service fee from marketplace configuration."
	});
	if (taxPaise) lines.push({
		code: "TAX",
		name: "Tax",
		amountPaise: taxPaise,
		source: "tax",
		fundedBy: "CUSTOMER",
		reason: "Tax on fees. Menu prices are configured separately as tax-inclusive or exclusive."
	});
	lines.push({
		code: "TOTAL",
		name: "To pay",
		amountPaise: totalPaise,
		source: "item",
		fundedBy: "CUSTOMER",
		reason: "Customer payable. Every other line is included in this total."
	});
	return {
		foodSubtotalPaise,
		restaurantDiscountPaise,
		platformDiscountPaise,
		packagingPaise,
		deliveryFeePaise: deliveryFeePaiseValue,
		serviceFeePaise,
		taxPaise,
		totalPaise,
		savingsPaise: restaurantDiscountPaise + platformDiscountPaise,
		commissionBps,
		commissionPaise,
		restaurantPayablePaise,
		minOrderPaise: input.fees.minOrderPaise,
		lines,
		blockers: [...new Set(blockers)]
	};
}
//#endregion
export { formatPaise as n, formatPaiseCompact as r, computeQuote as t };

//#region node_modules/.nitro/vite/services/ssr/assets/defaults-BTJwphDE.js
/** Fallback when the database has no row yet. Every visible brand string reads from here or from `app_config`. */
var DEFAULT_CONFIG = {
	brand: {
		appName: "Haat",
		shortName: "Haat",
		companyName: "Haat Marketplace",
		tagline: "Order from kitchens near you",
		description: "A fair local food marketplace for Sribhumi. Sample catalogue until real kitchens are verified.",
		logoUrl: "",
		logoLightUrl: "",
		logoDarkUrl: "",
		faviconUrl: "/favicon.svg",
		appIconUrl: "/icon-192.png",
		splashIconUrl: "/icon-512.png",
		primaryColor: "#1E4A3A",
		secondaryColor: "#F4F1EA",
		accentColor: "#1E4A3A",
		backgroundColor: "#F4F1EA",
		surfaceColor: "#FFFCF7",
		textColor: "#171614",
		mutedColor: "#6B6560",
		displayFont: "Fraunces",
		bodyFont: "Figtree",
		radiusPx: 16,
		density: "comfortable",
		themeMode: "light",
		seoTitle: "Haat — food delivery in Sribhumi",
		seoDescription: "Order from local kitchens in Karimganj / Sribhumi. Clear prices, no mystery fees.",
		ogImageUrl: "/og.jpg",
		promotionalHeadline: "Kitchens around Sribhumi, one table."
	},
	domain: {
		primaryDomain: "",
		webUrl: "/",
		supportUrl: "/support",
		privacyUrl: "/legal/privacy",
		termsUrl: "/legal/terms",
		refundsUrl: "/legal/refunds",
		restaurantPortalUrl: "/restaurant",
		riderPortalUrl: "/rider",
		adminUrl: "/admin"
	},
	store: {
		appStoreName: "Haat",
		playStoreName: "Haat",
		shortDescription: "Order food in Sribhumi",
		longDescription: "Haat is a local food marketplace for Karimganj / Sribhumi, Assam. Browse kitchens, customise items, and pay on delivery.",
		publisherName: "Haat Marketplace",
		supportUrl: "/support",
		privacyUrl: "/legal/privacy"
	},
	communication: {
		notificationSenderName: "Haat",
		smsSenderId: "",
		whatsappDisplayName: "Haat",
		emailSenderName: "Haat",
		emailFromAddress: "",
		supportName: "Haat Support",
		supportEmail: "support@localhost",
		supportPhone: "",
		grievanceOfficerName: "Grievance Officer",
		grievanceEmail: "grievance@localhost"
	},
	invoice: {
		companyName: "Haat Marketplace",
		logoUrl: "",
		address: "Sribhumi, Assam, India",
		gstin: "PENDING",
		fssai: "PENDING",
		supportContact: "support@localhost",
		footer: "Thank you for ordering.",
		legalFooter: "This is not a tax invoice until GSTIN is registered."
	},
	restaurantFacing: {
		portalName: "Haat for Kitchens",
		dashboardLogoUrl: "",
		notificationSender: "Haat Kitchens",
		settlementStatementBrand: "Haat Marketplace"
	},
	business: {
		legalEntityName: "Haat Marketplace",
		country: "IN",
		defaultCityId: "city_sribhumi",
		defaultLanguage: "en",
		supportedLanguages: ["en", "bn"],
		timezone: "Asia/Kolkata",
		currency: "INR",
		currencyMinorName: "paise"
	},
	marketplace: {
		defaultCommissionBps: 1e3,
		allowedCommissionBps: [
			0,
			500,
			800,
			1e3,
			1200
		],
		serviceFeePaise: 0,
		serviceFeeBps: 0,
		packagingDefaultPaise: 0,
		minOrderPaise: 8e3,
		deliveryBasePaise: 2500,
		deliveryPerKmPaise: 800,
		deliveryFreeOverPaise: 39900,
		riderSpeedKmh: 18,
		orderPrefix: "H",
		allowDevTools: true,
		sampleCatalogueBanner: true,
		launchMode: "development"
	},
	tax: {
		menuPricesIncludeTax: true,
		menuTaxBps: 500,
		deliveryTaxBps: 0,
		serviceTaxBps: 1800,
		commissionTaxBps: 1800,
		taxLabel: "GST"
	},
	notification: {
		inAppEnabled: true,
		pushProvider: "none",
		smsProvider: "none",
		whatsappProvider: "none",
		emailProvider: "none"
	}
};
function mergeConfig(partial) {
	if (!partial) return DEFAULT_CONFIG;
	return {
		brand: {
			...DEFAULT_CONFIG.brand,
			...partial.brand
		},
		domain: {
			...DEFAULT_CONFIG.domain,
			...partial.domain
		},
		store: {
			...DEFAULT_CONFIG.store,
			...partial.store
		},
		communication: {
			...DEFAULT_CONFIG.communication,
			...partial.communication
		},
		invoice: {
			...DEFAULT_CONFIG.invoice,
			...partial.invoice
		},
		restaurantFacing: {
			...DEFAULT_CONFIG.restaurantFacing,
			...partial.restaurantFacing
		},
		business: {
			...DEFAULT_CONFIG.business,
			...partial.business
		},
		marketplace: {
			...DEFAULT_CONFIG.marketplace,
			...partial.marketplace
		},
		tax: {
			...DEFAULT_CONFIG.tax,
			...partial.tax
		},
		notification: {
			...DEFAULT_CONFIG.notification,
			...partial.notification
		}
	};
}
//#endregion
export { mergeConfig as n, DEFAULT_CONFIG as t };

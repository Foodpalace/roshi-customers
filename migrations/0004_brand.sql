-- Window 1 identity: previous seed used a placeholder brand. Runtime UI already
-- reads BrandConfig; this overwrites stored rows so the live catalogue matches.

update app_config set value = $cfg${
  "appName": "Roshoi",
  "shortName": "Roshoi",
  "companyName": "Roshoi Marketplace",
  "tagline": "Home kitchens, at your door",
  "description": "A local food marketplace for Sribhumi. Sample catalogue until real kitchens are verified.",
  "logoUrl": "",
  "logoLightUrl": "",
  "logoDarkUrl": "",
  "faviconUrl": "/favicon.svg",
  "appIconUrl": "/icon-192.png",
  "splashIconUrl": "/icon-512.png",
  "primaryColor": "#1E4A3A",
  "secondaryColor": "#F4F1EA",
  "accentColor": "#1E4A3A",
  "backgroundColor": "#F4F1EA",
  "surfaceColor": "#FFFCF7",
  "textColor": "#171614",
  "mutedColor": "#6B6560",
  "displayFont": "Fraunces",
  "bodyFont": "Figtree",
  "radiusPx": 16,
  "density": "comfortable",
  "themeMode": "light",
  "seoTitle": "Roshoi — food delivery in Sribhumi",
  "seoDescription": "Order from local kitchens in Karimganj / Sribhumi. Clear prices, no mystery fees.",
  "ogImageUrl": "/og.jpg",
  "promotionalHeadline": "From the kitchen to your lane."
}$cfg$, updated_at = now() where key = 'brand';

update app_config set value = $cfg${
  "appStoreName": "Roshoi",
  "playStoreName": "Roshoi",
  "shortDescription": "Order food in Sribhumi",
  "longDescription": "Roshoi is a local food marketplace for Karimganj / Sribhumi, Assam.",
  "publisherName": "Roshoi Marketplace",
  "supportUrl": "/support",
  "privacyUrl": "/legal/privacy"
}$cfg$, updated_at = now() where key = 'store';

update app_config set value = $cfg${
  "notificationSenderName": "Roshoi",
  "smsSenderId": "",
  "whatsappDisplayName": "Roshoi",
  "whatsappNumber": "",
  "emailSenderName": "Roshoi",
  "emailFromAddress": "",
  "supportName": "Roshoi Support",
  "supportEmail": "support@localhost",
  "supportPhone": "",
  "grievanceOfficerName": "Grievance Officer",
  "grievanceEmail": "grievance@localhost"
}$cfg$, updated_at = now() where key = 'communication';

update app_config set value = $cfg${
  "companyName": "Roshoi Marketplace",
  "logoUrl": "",
  "address": "Sribhumi, Assam, India",
  "gstin": "PENDING",
  "fssai": "PENDING",
  "supportContact": "support@localhost",
  "footer": "Thank you for ordering.",
  "legalFooter": "This is not a tax invoice until GSTIN is registered."
}$cfg$, updated_at = now() where key = 'invoice';

update app_config set value = $cfg${
  "portalName": "Roshoi for Kitchens",
  "dashboardLogoUrl": "",
  "notificationSender": "Roshoi Kitchens",
  "settlementStatementBrand": "Roshoi Marketplace"
}$cfg$, updated_at = now() where key = 'restaurantFacing';

update app_config set value = $cfg${
  "legalEntityName": "Roshoi Marketplace",
  "country": "IN",
  "defaultCityId": "city_sribhumi",
  "defaultLanguage": "en",
  "supportedLanguages": ["en", "bn", "as", "hi"],
  "timezone": "Asia/Kolkata",
  "currency": "INR",
  "currencyMinorName": "paise"
}$cfg$, updated_at = now() where key = 'business';

update app_config set value = $cfg${
  "defaultCommissionBps": 1000,
  "allowedCommissionBps": [0, 500, 800, 1000, 1200],
  "serviceFeePaise": 0,
  "serviceFeeBps": 0,
  "packagingDefaultPaise": 0,
  "minOrderPaise": 8000,
  "deliveryBasePaise": 2500,
  "deliveryPerKmPaise": 800,
  "deliveryFreeOverPaise": 39900,
  "riderSpeedKmh": 18,
  "orderPrefix": "R",
  "allowDevTools": true,
  "sampleCatalogueBanner": true,
  "launchMode": "development"
}$cfg$, updated_at = now() where key = 'marketplace';

export type DataLabel = "SIMULATED" | "VERIFIED" | "REAL";

export type BrandConfig = {
  appName: string;
  shortName: string;
  companyName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  logoLightUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  appIconUrl: string;
  splashIconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedColor: string;
  displayFont: string;
  bodyFont: string;
  radiusPx: number;
  density: "comfortable" | "compact";
  themeMode: "light" | "dark" | "system";
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  promotionalHeadline: string;
};

export type DomainConfig = {
  primaryDomain: string;
  webUrl: string;
  supportUrl: string;
  privacyUrl: string;
  termsUrl: string;
  refundsUrl: string;
  restaurantPortalUrl: string;
  riderPortalUrl: string;
  adminUrl: string;
};

export type StoreIdentity = {
  appStoreName: string;
  playStoreName: string;
  shortDescription: string;
  longDescription: string;
  publisherName: string;
  supportUrl: string;
  privacyUrl: string;
};

export type CommunicationConfig = {
  notificationSenderName: string;
  smsSenderId: string;
  whatsappDisplayName: string;
  whatsappNumber: string;
  emailSenderName: string;
  emailFromAddress: string;
  supportName: string;
  supportEmail: string;
  supportPhone: string;
  grievanceOfficerName: string;
  grievanceEmail: string;
};

export type InvoiceConfig = {
  companyName: string;
  logoUrl: string;
  address: string;
  gstin: string;
  fssai: string;
  supportContact: string;
  footer: string;
  legalFooter: string;
};

export type RestaurantFacingConfig = {
  portalName: string;
  dashboardLogoUrl: string;
  notificationSender: string;
  settlementStatementBrand: string;
};

export type BusinessConfig = {
  legalEntityName: string;
  country: string;
  defaultCityId: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  timezone: string;
  currency: string;
  currencyMinorName: string;
};

export type MarketplaceConfig = {
  defaultCommissionBps: number;
  allowedCommissionBps: number[];
  serviceFeePaise: number;
  serviceFeeBps: number;
  packagingDefaultPaise: number;
  minOrderPaise: number;
  deliveryBasePaise: number;
  deliveryPerKmPaise: number;
  deliveryFreeOverPaise: number | null;
  riderSpeedKmh: number;
  orderPrefix: string;
  allowDevTools: boolean;
  sampleCatalogueBanner: boolean;
  launchMode: "development" | "pilot" | "live";
};

export type TaxConfig = {
  menuPricesIncludeTax: boolean;
  menuTaxBps: number;
  deliveryTaxBps: number;
  serviceTaxBps: number;
  commissionTaxBps: number;
  taxLabel: string;
};

export type NotificationProviderConfig = {
  inAppEnabled: boolean;
  pushProvider: "none" | "web-push";
  smsProvider: "none" | "msg91" | "twilio";
  whatsappProvider: "none" | "gupshup" | "meta";
  emailProvider: "none" | "resend" | "ses";
};

export type PublicAppConfig = {
  brand: BrandConfig;
  domain: DomainConfig;
  store: StoreIdentity;
  communication: CommunicationConfig;
  invoice: InvoiceConfig;
  restaurantFacing: RestaurantFacingConfig;
  business: BusinessConfig;
  marketplace: MarketplaceConfig;
  tax: TaxConfig;
  notification: NotificationProviderConfig;
};

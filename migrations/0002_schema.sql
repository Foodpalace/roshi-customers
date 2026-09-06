-- Marketplace core. Money is integer paise. user_id is text (Better Auth).

create table if not exists app_config (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create table if not exists cities (
  id text primary key,
  name text not null,
  state text not null,
  country_code text not null default 'IN',
  currency_code text not null default 'INR',
  timezone text not null default 'Asia/Kolkata',
  data_label text not null default 'SIMULATED',
  active boolean not null default true
);

create table if not exists service_zones (
  id text primary key,
  city_id text not null references cities(id),
  name text not null,
  min_order_paise integer not null,
  delivery_base_paise integer not null,
  delivery_per_km_paise integer not null,
  delivery_free_over_paise integer,
  radius_km numeric not null,
  center_lat double precision not null,
  center_lng double precision not null,
  polygon_geojson text,
  active boolean not null default true
);

create table if not exists categories (
  id text primary key,
  slug text unique not null,
  name_en text not null,
  name_bn text not null,
  image_url text,
  sort_order integer not null default 0,
  active boolean not null default true
);

create table if not exists restaurants (
  id text primary key,
  slug text unique not null,
  name text not null,
  description_en text not null,
  description_bn text not null,
  cover_image text,
  logo_image text,
  cuisine_summary text not null,
  veg_only boolean not null default false,
  rating_avg numeric,
  rating_count integer not null default 0,
  prep_minutes integer not null default 25,
  commission_bps integer not null default 1000,
  packaging_paise integer not null default 0,
  min_order_paise integer,
  promoted boolean not null default false,
  data_label text not null default 'SIMULATED',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists restaurant_outlets (
  id text primary key,
  restaurant_id text not null references restaurants(id),
  zone_id text not null references service_zones(id),
  name text not null,
  address_line text not null,
  area text not null,
  lat double precision not null,
  lng double precision not null,
  phone text,
  fssai_number text,
  data_label text not null default 'SIMULATED',
  open_override boolean,
  active boolean not null default true
);

create table if not exists restaurant_hours (
  outlet_id text not null references restaurant_outlets(id) on delete cascade,
  weekday integer not null,
  open_minute integer not null,
  close_minute integer not null,
  primary key (outlet_id, weekday)
);

create table if not exists restaurant_categories (
  restaurant_id text not null references restaurants(id) on delete cascade,
  category_id text not null references categories(id),
  primary key (restaurant_id, category_id)
);

create table if not exists menu_categories (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  name_en text not null,
  name_bn text not null,
  sort_order integer not null default 0
);

create table if not exists menu_items (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  category_id text not null references menu_categories(id),
  name_en text not null,
  name_bn text not null,
  description_en text not null default '',
  description_bn text not null default '',
  image_url text,
  veg boolean not null default true,
  spicy_level integer not null default 0,
  bestseller boolean not null default false,
  available boolean not null default true,
  base_price_paise integer not null,
  platform_category_id text references categories(id),
  sort_order integer not null default 0,
  data_label text not null default 'SIMULATED'
);

create table if not exists menu_variants (
  id text primary key,
  item_id text not null references menu_items(id) on delete cascade,
  name_en text not null,
  name_bn text not null,
  price_paise integer not null,
  is_default boolean not null default false,
  available boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists addon_groups (
  id text primary key,
  item_id text not null references menu_items(id) on delete cascade,
  name_en text not null,
  name_bn text not null,
  required boolean not null default false,
  min_select integer not null default 0,
  max_select integer not null default 1
);

create table if not exists addons (
  id text primary key,
  group_id text not null references addon_groups(id) on delete cascade,
  name_en text not null,
  name_bn text not null,
  price_paise integer not null default 0,
  available boolean not null default true
);

create table if not exists promotions (
  id text primary key,
  code text unique,
  name_en text not null,
  name_bn text not null,
  kind text not null,
  percent_bps integer,
  amount_paise integer,
  min_order_paise integer not null default 0,
  max_discount_paise integer,
  funded_by text not null,
  restaurant_id text references restaurants(id),
  first_order_only boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  max_redemptions integer,
  per_user_limit integer not null default 1,
  zone_id text references service_zones(id),
  active boolean not null default true,
  data_label text not null default 'SIMULATED'
);

create table if not exists profiles (
  user_id text primary key,
  role text not null default 'customer',
  display_name text,
  phone text,
  language text not null default 'en',
  notify_push boolean not null default true,
  notify_sms boolean not null default false,
  notify_email boolean not null default true,
  deletion_requested_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists customer_addresses (
  id text primary key,
  user_id text not null,
  label text not null,
  name text,
  phone text,
  line1 text not null,
  landmark text,
  area text not null,
  city_id text not null references cities(id),
  zone_id text references service_zones(id),
  lat double precision,
  lng double precision,
  instructions text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists customer_addresses_user_idx on customer_addresses (user_id);

create table if not exists orders (
  id text primary key,
  public_id text unique not null,
  user_id text not null,
  restaurant_id text not null references restaurants(id),
  outlet_id text not null references restaurant_outlets(id),
  zone_id text not null,
  address_snapshot text not null,
  status text not null,
  payment_method text not null,
  payment_status text not null,
  idempotency_key text unique not null,
  food_subtotal_paise integer not null,
  restaurant_discount_paise integer not null default 0,
  platform_discount_paise integer not null default 0,
  delivery_fee_paise integer not null,
  service_fee_paise integer not null default 0,
  tax_paise integer not null default 0,
  packaging_paise integer not null default 0,
  total_paise integer not null,
  commission_bps integer not null,
  commission_paise integer not null,
  restaurant_payable_paise integer not null,
  promotion_id text,
  notes text,
  delivery_otp text,
  data_label text not null default 'REAL',
  placed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_user_idx on orders (user_id);
create index if not exists orders_status_idx on orders (status);

create table if not exists order_items (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  item_id text not null,
  variant_id text,
  name_snapshot text not null,
  quantity integer not null,
  unit_price_paise integer not null,
  addons_snapshot text not null default '[]',
  instructions text,
  line_total_paise integer not null
);

create table if not exists order_price_lines (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  code text not null,
  name text not null,
  amount_paise integer not null,
  source text not null,
  funded_by text,
  reason text not null,
  sort_order integer not null default 0
);

create table if not exists order_events (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  from_status text,
  to_status text not null,
  actor_user_id text,
  actor_role text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id text primary key,
  order_id text not null references orders(id),
  provider text not null,
  provider_ref text,
  status text not null,
  amount_paise integer not null,
  currency text not null default 'INR',
  idempotency_key text unique not null,
  raw_payload text,
  created_at timestamptz not null default now()
);

create table if not exists refunds (
  id text primary key,
  payment_id text not null references payments(id),
  order_id text not null,
  amount_paise integer not null,
  reason text,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists promotion_redemptions (
  id text primary key,
  promotion_id text not null references promotions(id),
  user_id text not null,
  order_id text,
  created_at timestamptz not null default now()
);

create table if not exists loyalty_accounts (
  user_id text primary key,
  points integer not null default 0,
  lifetime_points integer not null default 0,
  tier text not null default 'starter',
  updated_at timestamptz not null default now()
);

create table if not exists loyalty_transactions (
  id text primary key,
  user_id text not null,
  order_id text,
  delta integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists favourites (
  user_id text not null,
  restaurant_id text not null references restaurants(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, restaurant_id)
);

create table if not exists favourite_items (
  user_id text not null,
  item_id text not null references menu_items(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create table if not exists support_tickets (
  id text primary key,
  user_id text not null,
  order_id text,
  topic text not null,
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id text primary key,
  user_id text not null,
  title text not null,
  body text not null,
  kind text not null,
  entity_id text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists notification_outbox (
  id text primary key,
  channel text not null,
  status text not null default 'pending',
  payload text not null,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  error text
);

create table if not exists analytics_events (
  id text primary key,
  user_id text,
  name text not null,
  payload text not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists analytics_name_idx on analytics_events (name);

create table if not exists audit_logs (
  id text primary key,
  actor_user_id text,
  actor_role text,
  action text not null,
  entity text not null,
  entity_id text,
  metadata text not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists otp_challenges (
  id text primary key,
  phone text not null,
  purpose text not null,
  code_hash text not null,
  attempts integer not null default 0,
  max_attempts integer not null default 5,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists otp_phone_idx on otp_challenges (phone, purpose);

create table if not exists restaurant_members (
  user_id text not null,
  restaurant_id text not null references restaurants(id) on delete cascade,
  member_role text not null default 'owner',
  created_at timestamptz not null default now(),
  primary key (user_id, restaurant_id)
);

create table if not exists riders (
  user_id text primary key,
  status text not null default 'offline',
  vehicle_type text,
  zone_id text,
  kyc_status text not null default 'pending',
  created_at timestamptz not null default now()
);

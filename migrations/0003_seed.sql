-- Sample catalogue. data_label = SIMULATED. Not live vendors.

insert into cities (id, name, state, country_code, currency_code, timezone, data_label, active)
values ('city_sribhumi', 'Sribhumi', 'Assam', 'IN', 'INR', 'Asia/Kolkata', 'SIMULATED', true)
on conflict (id) do nothing;

insert into service_zones (id, city_id, name, min_order_paise, delivery_base_paise, delivery_per_km_paise, delivery_free_over_paise, radius_km, center_lat, center_lng, active)
values
  ('zone_town', 'city_sribhumi', 'Sribhumi Town', 8000, 2500, 800, 39900, 4, 24.8697, 92.3542, true),
  ('zone_station', 'city_sribhumi', 'Station Road', 8000, 2500, 800, 39900, 3, 24.8725, 92.3588, true),
  ('zone_college', 'city_sribhumi', 'College Road', 8000, 2500, 800, 39900, 3, 24.8661, 92.3489, true),
  ('zone_silchar', 'city_sribhumi', 'Silchar Road', 8000, 2800, 900, 39900, 4, 24.8612, 92.3610, true),
  ('zone_bazaar', 'city_sribhumi', 'Central Bazaar', 8000, 2200, 700, 34900, 2.5, 24.8688, 92.3511, true)
on conflict (id) do nothing;

insert into categories (id, slug, name_en, name_bn, image_url, sort_order, active) values
  ('cat_biryani', 'biryani', 'Biryani', 'বিরিয়ানি', '/food/biryani.jpg', 1, true),
  ('cat_burgers', 'burgers', 'Burgers', 'বার্গার', '/food/burger.jpg', 2, true),
  ('cat_pizza', 'pizza', 'Pizza', 'পিজ্জা', '/food/pizza.jpg', 3, true),
  ('cat_chinese', 'chinese', 'Chinese', 'চাইনিজ', '/food/chinese.jpg', 4, true),
  ('cat_momos', 'momos', 'Momos', 'মোমো', '/food/momo.jpg', 5, true),
  ('cat_rolls', 'rolls', 'Rolls', 'রোল', '/food/rolls.jpg', 6, true),
  ('cat_indian', 'indian', 'Indian', 'ইন্ডিয়ান', '/food/thali.jpg', 7, true),
  ('cat_veg', 'veg', 'Veg', 'নিরামিষ', '/food/veg.jpg', 8, true),
  ('cat_chicken', 'chicken', 'Chicken', 'চিকেন', '/food/chicken.jpg', 9, true),
  ('cat_snacks', 'snacks', 'Snacks', 'স্ন্যাকস', '/food/snacks.jpg', 10, true),
  ('cat_drinks', 'drinks', 'Drinks', 'পানীয়', '/food/drinks.jpg', 11, true),
  ('cat_desserts', 'desserts', 'Desserts', 'মিষ্টি', '/food/sweets.jpg', 12, true)
on conflict (id) do nothing;

insert into restaurants (id, slug, name, description_en, description_bn, cover_image, cuisine_summary, veg_only, prep_minutes, commission_bps, packaging_paise, min_order_paise, promoted, data_label, active) values
  ('rst_biryani', 'station-biryani-house', 'Station Biryani House', 'Sample kitchen. Dum biryani and kebabs. Not a live vendor.', 'নমুনা কিচেন। দম বিরিয়ানি ও কাবাব।', '/food/biryani.jpg', 'Biryani, Mughlai', false, 30, 1000, 500, 12000, false, 'SIMULATED', true),
  ('rst_thali', 'central-thali-ghar', 'Central Thali Ghar', 'Sample kitchen. Everyday thalis and curries. Not a live vendor.', 'নমুনা কিচেন। থালি ও তরকারি।', '/food/thali.jpg', 'Indian, Thali', false, 22, 1000, 0, 8000, false, 'SIMULATED', true),
  ('rst_chinese', 'college-road-chinese', 'College Road Chinese', 'Sample kitchen. Hakka noodles and chilli dishes. Not a live vendor.', 'নমুনা কিচেন। হাক্কা নুডলস ও চিলি।', '/food/chinese.jpg', 'Chinese', false, 20, 1000, 0, 8000, true, 'SIMULATED', true),
  ('rst_momo', 'barak-momo-hut', 'Barak Momo Hut', 'Sample kitchen. Steam, fry and Kurkure momos. Not a live vendor.', 'নমুনা কিচেন। স্টিম ও ফ্রাই মোমো।', '/food/momo.jpg', 'Momos, Tibetan', false, 18, 800, 0, 6000, false, 'SIMULATED', true),
  ('rst_burger', 'link-lane-burgers', 'Link Lane Burgers', 'Sample kitchen. Grilled burgers and fries. Not a live vendor.', 'নমুনা কিচেন। বার্গার ও ফ্রাইজ।', '/food/burger.jpg', 'Burgers, Fast food', false, 16, 1000, 0, 8000, false, 'SIMULATED', true),
  ('rst_pizza', 'sribhumi-pizza-co', 'Sribhumi Pizza Co', 'Sample kitchen. Wood-fired style pizzas. Not a live vendor.', 'নমুনা কিচেন। পিজ্জা।', '/food/pizza.jpg', 'Pizza, Italian', false, 24, 1000, 0, 12000, false, 'SIMULATED', true),
  ('rst_rolls', 'roll-factory', 'Roll Factory', 'Sample kitchen. Kathi rolls and wraps. Not a live vendor.', 'নমুনা কিচেন। কাথি রোল।', '/food/rolls.jpg', 'Rolls, Wraps', false, 15, 1000, 0, 6000, false, 'SIMULATED', true),
  ('rst_fish', 'surma-fish-kitchen', 'Surma Fish Kitchen', 'Sample kitchen. Sylheti-style fish curries. Not a live vendor.', 'নমুনা কিচেন। সিলেটি মাছের ঝোল।', '/food/fish.jpg', 'Bengali, Fish', false, 28, 1000, 500, 10000, false, 'SIMULATED', true),
  ('rst_mishti', 'mishti-ghar', 'Mishti Ghar', 'Sample kitchen. Sweets and mishti doi. Not a live vendor.', 'নমুনা কিচেন। মিষ্টি ও দই।', '/food/sweets.jpg', 'Sweets, Desserts', true, 12, 500, 0, 5000, false, 'SIMULATED', true),
  ('rst_shakes', 'shakers-point', 'Shaker''s Point', 'Sample kitchen. Shakes, juices, mocktails. Not a live vendor.', 'নমুনা কিচেন। শেক ও জুস।', '/food/drinks.jpg', 'Beverages', true, 10, 1000, 0, 5000, false, 'SIMULATED', true),
  ('rst_tea', 'tea-leaf-cafe', 'Tea Leaf Cafe', 'Sample kitchen. Assam tea, puffs, light bites. Not a live vendor.', 'নমুনা কিচেন। চা ও লাইট বাইটস।', '/food/tea.jpg', 'Cafe, Tea', false, 12, 800, 0, 4000, false, 'SIMULATED', true),
  ('rst_green', 'green-bowl', 'Green Bowl', 'Sample kitchen. Pure vegetarian bowls and thalis. Not a live vendor.', 'নমুনা কিচেন। নিরামিষ বোল ও থালি।', '/food/veg.jpg', 'Vegetarian, Healthy', true, 20, 1000, 0, 8000, false, 'SIMULATED', true)
on conflict (id) do nothing;

insert into restaurant_outlets (id, restaurant_id, zone_id, name, address_line, area, lat, lng, fssai_number, data_label, active) values
  ('out_biryani', 'rst_biryani', 'zone_station', 'Station Road outlet', 'Sample unit, near station crossing', 'Station Road', 24.8728, 92.3591, 'SIMULATED', 'SIMULATED', true),
  ('out_thali', 'rst_thali', 'zone_bazaar', 'Bazaar outlet', 'Sample unit, Central Bazaar lane 3', 'Central Bazaar', 24.8689, 92.3514, 'SIMULATED', 'SIMULATED', true),
  ('out_chinese', 'rst_chinese', 'zone_college', 'College Road outlet', 'Sample unit, opposite college gate', 'College Road', 24.8664, 92.3492, 'SIMULATED', 'SIMULATED', true),
  ('out_momo', 'rst_momo', 'zone_silchar', 'Silchar Road outlet', 'Sample unit, Silchar Road milestone', 'Silchar Road', 24.8618, 92.3606, 'SIMULATED', 'SIMULATED', true),
  ('out_burger', 'rst_burger', 'zone_station', 'Link Lane outlet', 'Sample unit, Link Lane', 'Station Road', 24.8719, 92.3577, 'SIMULATED', 'SIMULATED', true),
  ('out_pizza', 'rst_pizza', 'zone_bazaar', 'Bazaar outlet', 'Sample unit, first floor, bazaar', 'Central Bazaar', 24.8692, 92.3508, 'SIMULATED', 'SIMULATED', true),
  ('out_rolls', 'rst_rolls', 'zone_college', 'College Road outlet', 'Sample unit, student lane', 'College Road', 24.8658, 92.3484, 'SIMULATED', 'SIMULATED', true),
  ('out_fish', 'rst_fish', 'zone_bazaar', 'Bazaar outlet', 'Sample unit, fish market side', 'Central Bazaar', 24.8684, 92.3518, 'SIMULATED', 'SIMULATED', true),
  ('out_mishti', 'rst_mishti', 'zone_bazaar', 'Bazaar outlet', 'Sample unit, sweet lane', 'Central Bazaar', 24.8690, 92.3510, 'SIMULATED', 'SIMULATED', true),
  ('out_shakes', 'rst_shakes', 'zone_college', 'College Road outlet', 'Sample unit, shake corner', 'College Road', 24.8668, 92.3496, 'SIMULATED', 'SIMULATED', true),
  ('out_tea', 'rst_tea', 'zone_station', 'Station Road outlet', 'Sample unit, tea stall row', 'Station Road', 24.8722, 92.3582, 'SIMULATED', 'SIMULATED', true),
  ('out_green', 'rst_green', 'zone_silchar', 'Silchar Road outlet', 'Sample unit, green bowl', 'Silchar Road', 24.8624, 92.3598, 'SIMULATED', 'SIMULATED', true)
on conflict (id) do nothing;

insert into restaurant_hours (outlet_id, weekday, open_minute, close_minute)
select o.id, w.d, 600, 1380
from restaurant_outlets o
cross join (values (0),(1),(2),(3),(4),(5),(6)) as w(d)
on conflict do nothing;

update restaurant_hours set open_minute = 480, close_minute = 1260
where outlet_id in ('out_tea', 'out_mishti', 'out_shakes');

insert into restaurant_categories (restaurant_id, category_id) values
  ('rst_biryani', 'cat_biryani'), ('rst_biryani', 'cat_chicken'),
  ('rst_thali', 'cat_indian'), ('rst_thali', 'cat_chicken'),
  ('rst_chinese', 'cat_chinese'),
  ('rst_momo', 'cat_momos'), ('rst_momo', 'cat_snacks'),
  ('rst_burger', 'cat_burgers'),
  ('rst_pizza', 'cat_pizza'),
  ('rst_rolls', 'cat_rolls'),
  ('rst_fish', 'cat_indian'),
  ('rst_mishti', 'cat_desserts'),
  ('rst_shakes', 'cat_drinks'),
  ('rst_tea', 'cat_drinks'), ('rst_tea', 'cat_snacks'),
  ('rst_green', 'cat_veg'), ('rst_green', 'cat_indian')
on conflict do nothing;

insert into menu_categories (id, restaurant_id, name_en, name_bn, sort_order) values
  ('mc_biryani_rec', 'rst_biryani', 'Recommended', 'সুপারিশ', 0),
  ('mc_biryani_main', 'rst_biryani', 'Biryani', 'বিরিয়ানি', 1),
  ('mc_biryani_sides', 'rst_biryani', 'Sides', 'সাইড', 2),
  ('mc_thali_rec', 'rst_thali', 'Recommended', 'সুপারিশ', 0),
  ('mc_thali_meals', 'rst_thali', 'Meals', 'মিল', 1),
  ('mc_chi_rec', 'rst_chinese', 'Recommended', 'সুপারিশ', 0),
  ('mc_chi_mains', 'rst_chinese', 'Mains', 'মেইন', 1),
  ('mc_momo_rec', 'rst_momo', 'Recommended', 'সুপারিশ', 0),
  ('mc_momo_all', 'rst_momo', 'Momos', 'মোমো', 1),
  ('mc_bur_rec', 'rst_burger', 'Recommended', 'সুপারিশ', 0),
  ('mc_bur_all', 'rst_burger', 'Burgers', 'বার্গার', 1),
  ('mc_piz_rec', 'rst_pizza', 'Recommended', 'সুপারিশ', 0),
  ('mc_piz_all', 'rst_pizza', 'Pizzas', 'পিজ্জা', 1),
  ('mc_rol_rec', 'rst_rolls', 'Recommended', 'সুপারিশ', 0),
  ('mc_rol_all', 'rst_rolls', 'Rolls', 'রোল', 1),
  ('mc_fish_rec', 'rst_fish', 'Recommended', 'সুপারিশ', 0),
  ('mc_fish_all', 'rst_fish', 'Fish', 'মাছ', 1),
  ('mc_mis_rec', 'rst_mishti', 'Recommended', 'সুপারিশ', 0),
  ('mc_mis_all', 'rst_mishti', 'Sweets', 'মিষ্টি', 1),
  ('mc_shk_rec', 'rst_shakes', 'Recommended', 'সুপারিশ', 0),
  ('mc_shk_all', 'rst_shakes', 'Drinks', 'পানীয়', 1),
  ('mc_tea_rec', 'rst_tea', 'Recommended', 'সুপারিশ', 0),
  ('mc_tea_all', 'rst_tea', 'Cafe', 'ক্যাফে', 1),
  ('mc_grn_rec', 'rst_green', 'Recommended', 'সুপারিশ', 0),
  ('mc_grn_all', 'rst_green', 'Bowls', 'বোল', 1)
on conflict (id) do nothing;

insert into menu_items (id, restaurant_id, category_id, name_en, name_bn, description_en, description_bn, image_url, veg, spicy_level, bestseller, available, base_price_paise, platform_category_id, sort_order, data_label) values
  ('it_bir_ck', 'rst_biryani', 'mc_biryani_rec', 'Chicken Dum Biryani', 'চিকেন দম বিরিয়ানি', 'Slow-cooked rice and chicken. Sample dish.', 'নমুনা খাবার।', '/food/biryani.jpg', false, 1, true, true, 22000, 'cat_biryani', 1, 'SIMULATED'),
  ('it_bir_mut', 'rst_biryani', 'mc_biryani_main', 'Mutton Dum Biryani', 'মাটন দম বিরিয়ানি', 'Sample mutton biryani.', 'নমুনা মাটন বিরিয়ানি।', '/food/biryani.jpg', false, 1, false, true, 28000, 'cat_biryani', 2, 'SIMULATED'),
  ('it_bir_veg', 'rst_biryani', 'mc_biryani_main', 'Veg Dum Biryani', 'ভেজ দম বিরিয়ানি', 'Sample vegetable biryani.', 'নমুনা ভেজ বিরিয়ানি।', '/food/biryani.jpg', true, 0, false, true, 16000, 'cat_biryani', 3, 'SIMULATED'),
  ('it_bir_kebab', 'rst_biryani', 'mc_biryani_sides', 'Chicken Seekh Kebab', 'চিকেন শিখ কাবাব', 'Sample kebab plate.', 'নমুনা কাবাব।', '/food/chicken.jpg', false, 2, false, true, 14000, 'cat_chicken', 4, 'SIMULATED'),
  ('it_bir_raita', 'rst_biryani', 'mc_biryani_sides', 'Raita', 'রায়তা', 'Sample raita.', 'নমুনা রায়তা।', '/food/veg.jpg', true, 0, false, true, 3000, 'cat_veg', 5, 'SIMULATED'),
  ('it_th_veg', 'rst_thali', 'mc_thali_rec', 'Veg Thali', 'ভেজ থালি', 'Dal, sabzi, rice, roti. Sample meal.', 'নমুনা থালি।', '/food/thali.jpg', true, 0, true, true, 12000, 'cat_indian', 1, 'SIMULATED'),
  ('it_th_non', 'rst_thali', 'mc_thali_meals', 'Chicken Thali', 'চিকেন থালি', 'Sample chicken thali.', 'নমুনা চিকেন থালি।', '/food/thali.jpg', false, 1, true, true, 16000, 'cat_indian', 2, 'SIMULATED'),
  ('it_th_fish', 'rst_thali', 'mc_thali_meals', 'Fish Curry Meal', 'মাছের ঝোল মিল', 'Sample fish meal.', 'নমুনা মাছের মিল।', '/food/fish.jpg', false, 1, false, true, 17000, 'cat_indian', 3, 'SIMULATED'),
  ('it_th_dal', 'rst_thali', 'mc_thali_meals', 'Dal Tadka + Rice', 'ডাল তড়কা রাইস', 'Sample dal rice.', 'নমুনা ডাল রাইস।', '/food/thali.jpg', true, 0, false, true, 9000, 'cat_veg', 4, 'SIMULATED'),
  ('it_ch_hakka', 'rst_chinese', 'mc_chi_rec', 'Chicken Hakka Noodles', 'চিকেন হাক্কা নুডলস', 'Sample hakka noodles.', 'নমুনা নুডলস।', '/food/chinese.jpg', false, 1, true, true, 13000, 'cat_chinese', 1, 'SIMULATED'),
  ('it_ch_chilli', 'rst_chinese', 'mc_chi_mains', 'Chilli Chicken', 'চিলি চিকেন', 'Sample chilli chicken.', 'নমুনা চিলি চিকেন।', '/food/chicken.jpg', false, 2, true, true, 16000, 'cat_chinese', 2, 'SIMULATED'),
  ('it_ch_vegn', 'rst_chinese', 'mc_chi_mains', 'Veg Hakka Noodles', 'ভেজ হাক্কা নুডলস', 'Sample veg noodles.', 'নমুনা ভেজ নুডলস।', '/food/chinese.jpg', true, 1, false, true, 11000, 'cat_chinese', 3, 'SIMULATED'),
  ('it_ch_manch', 'rst_chinese', 'mc_chi_mains', 'Veg Manchurian', 'ভেজ মঞ্চুরিয়ান', 'Sample manchurian.', 'নমুনা মঞ্চুরিয়ান।', '/food/chinese.jpg', true, 1, false, true, 12000, 'cat_chinese', 4, 'SIMULATED'),
  ('it_mo_st', 'rst_momo', 'mc_momo_rec', 'Steamed Chicken Momos', 'স্টিম চিকেন মোমো', 'Sample steamed momos.', 'নমুনা মোমো।', '/food/momo.jpg', false, 1, true, true, 9000, 'cat_momos', 1, 'SIMULATED'),
  ('it_mo_fr', 'rst_momo', 'mc_momo_all', 'Fried Chicken Momos', 'ফ্রাই চিকেন মোমো', 'Sample fried momos.', 'নমুনা ফ্রাই মোমো।', '/food/momo.jpg', false, 1, false, true, 10000, 'cat_momos', 2, 'SIMULATED'),
  ('it_mo_veg', 'rst_momo', 'mc_momo_all', 'Veg Steamed Momos', 'ভেজ স্টিম মোমো', 'Sample veg momos.', 'নমুনা ভেজ মোমো।', '/food/momo.jpg', true, 0, false, true, 8000, 'cat_momos', 3, 'SIMULATED'),
  ('it_mo_kur', 'rst_momo', 'mc_momo_all', 'Kurkure Momos', 'কুরকুরে মোমো', 'Sample kurkure momos.', 'নমুনা কুরকুরে মোমো।', '/food/momo.jpg', false, 2, true, true, 12000, 'cat_momos', 4, 'SIMULATED'),
  ('it_bu_cl', 'rst_burger', 'mc_bur_rec', 'Classic Chicken Burger', 'ক্লাসিক চিকেন বার্গার', 'Sample chicken burger.', 'নমুনা বার্গার।', '/food/burger.jpg', false, 0, true, true, 12900, 'cat_burgers', 1, 'SIMULATED'),
  ('it_bu_db', 'rst_burger', 'mc_bur_all', 'Double Patty Burger', 'ডাবল প্যাটি বার্গার', 'Sample double burger.', 'নমুনা ডাবল বার্গার।', '/food/burger.jpg', false, 0, false, true, 17900, 'cat_burgers', 2, 'SIMULATED'),
  ('it_bu_veg', 'rst_burger', 'mc_bur_all', 'Veggie Burger', 'ভেজি বার্গার', 'Sample veg burger.', 'নমুনা ভেজ বার্গার।', '/food/burger.jpg', true, 0, false, true, 9900, 'cat_burgers', 3, 'SIMULATED'),
  ('it_bu_fries', 'rst_burger', 'mc_bur_all', 'Fries', 'ফ্রাইজ', 'Sample fries.', 'নমুনা ফ্রাইজ।', '/food/snacks.jpg', true, 0, false, true, 6900, 'cat_snacks', 4, 'SIMULATED'),
  ('it_pz_mar', 'rst_pizza', 'mc_piz_rec', 'Margherita', 'মার্গেরিটা', 'Sample margherita.', 'নমুনা মার্গেরিটা।', '/food/pizza.jpg', true, 0, true, true, 19900, 'cat_pizza', 1, 'SIMULATED'),
  ('it_pz_ch', 'rst_pizza', 'mc_piz_all', 'Chicken Supreme', 'চিকেন সুপ্রিম', 'Sample chicken pizza.', 'নমুনা চিকেন পিজ্জা।', '/food/pizza.jpg', false, 1, true, true, 27900, 'cat_pizza', 2, 'SIMULATED'),
  ('it_pz_farm', 'rst_pizza', 'mc_piz_all', 'Farmhouse', 'ফার্মহাউস', 'Sample veg pizza.', 'নমুনা ভেজ পিজ্জা।', '/food/pizza.jpg', true, 0, false, true, 24900, 'cat_pizza', 3, 'SIMULATED'),
  ('it_pz_garlic', 'rst_pizza', 'mc_piz_all', 'Garlic Bread', 'গার্লিক ব্রেড', 'Sample garlic bread.', 'নমুনা গার্লিক ব্রেড।', '/food/pizza.jpg', true, 0, false, true, 9900, 'cat_snacks', 4, 'SIMULATED'),
  ('it_rl_ck', 'rst_rolls', 'mc_rol_rec', 'Chicken Kathi Roll', 'চিকেন কাথি রোল', 'Sample chicken roll.', 'নমুনা চিকেন রোল।', '/food/rolls.jpg', false, 1, true, true, 9000, 'cat_rolls', 1, 'SIMULATED'),
  ('it_rl_egg', 'rst_rolls', 'mc_rol_all', 'Egg Roll', 'ডিম রোল', 'Sample egg roll.', 'নমুনা ডিম রোল।', '/food/rolls.jpg', false, 1, false, true, 7000, 'cat_rolls', 2, 'SIMULATED'),
  ('it_rl_paneer', 'rst_rolls', 'mc_rol_all', 'Paneer Roll', 'পনির রোল', 'Sample paneer roll.', 'নমুনা পনির রোল।', '/food/rolls.jpg', true, 1, false, true, 8500, 'cat_rolls', 3, 'SIMULATED'),
  ('it_rl_mix', 'rst_rolls', 'mc_rol_all', 'Mixed Roll', 'মিক্সড রোল', 'Sample mixed roll.', 'নমুনা মিক্সড রোল।', '/food/rolls.jpg', false, 2, false, true, 11000, 'cat_rolls', 4, 'SIMULATED'),
  ('it_fi_ilish', 'rst_fish', 'mc_fish_rec', 'Ilish Bhapa Meal', 'ইলিশ ভাপা মিল', 'Sample mustard hilsa meal. Not a live catch claim.', 'নমুনা ইলিশ ভাপা।', '/food/fish.jpg', false, 1, true, true, 32000, 'cat_indian', 1, 'SIMULATED'),
  ('it_fi_rui', 'rst_fish', 'mc_fish_all', 'Rui Jhol', 'রুই ঝোল', 'Sample rui curry with rice.', 'নমুনা রুই ঝোল।', '/food/fish.jpg', false, 1, true, true, 18000, 'cat_indian', 2, 'SIMULATED'),
  ('it_fi_shutki', 'rst_fish', 'mc_fish_all', 'Shutki Bhorta Meal', 'শুঁটকি ভর্তা মিল', 'Sample shutki meal.', 'নমুনা শুঁটকি মিল।', '/food/fish.jpg', false, 3, false, true, 16000, 'cat_indian', 3, 'SIMULATED'),
  ('it_ms_ros', 'rst_mishti', 'mc_mis_rec', 'Rossogolla (4 pcs)', 'রসগোল্লা (৪টি)', 'Sample rossogolla.', 'নমুনা রসগোল্লা।', '/food/sweets.jpg', true, 0, true, true, 8000, 'cat_desserts', 1, 'SIMULATED'),
  ('it_ms_doi', 'rst_mishti', 'mc_mis_all', 'Mishti Doi', 'মিষ্টি দই', 'Sample mishti doi.', 'নমুনা মিষ্টি দই।', '/food/sweets.jpg', true, 0, true, true, 6000, 'cat_desserts', 2, 'SIMULATED'),
  ('it_ms_sandesh', 'rst_mishti', 'mc_mis_all', 'Sandesh Box', 'সন্দেশ বক্স', 'Sample sandesh.', 'নমুনা সন্দেশ।', '/food/sweets.jpg', true, 0, false, true, 12000, 'cat_desserts', 3, 'SIMULATED'),
  ('it_sk_man', 'rst_shakes', 'mc_shk_rec', 'Mango Shake', 'আমের শেক', 'Sample mango shake.', 'নমুনা আমের শেক।', '/food/drinks.jpg', true, 0, true, true, 9000, 'cat_drinks', 1, 'SIMULATED'),
  ('it_sk_cho', 'rst_shakes', 'mc_shk_all', 'Chocolate Shake', 'চকলেট শেক', 'Sample chocolate shake.', 'নমুনা চকলেট শেক।', '/food/drinks.jpg', true, 0, false, true, 9500, 'cat_drinks', 2, 'SIMULATED'),
  ('it_sk_lime', 'rst_shakes', 'mc_shk_all', 'Fresh Lime Soda', 'লেবু সোডা', 'Sample lime soda.', 'নমুনা লেবু সোডা।', '/food/drinks.jpg', true, 0, false, true, 5000, 'cat_drinks', 3, 'SIMULATED'),
  ('it_te_assam', 'rst_tea', 'mc_tea_rec', 'Assam Milk Tea', 'আসাম দুধ চা', 'Sample milk tea.', 'নমুনা দুধ চা।', '/food/tea.jpg', true, 0, true, true, 3000, 'cat_drinks', 1, 'SIMULATED'),
  ('it_te_black', 'rst_tea', 'mc_tea_all', 'Black Tea', 'কালো চা', 'Sample black tea.', 'নমুনা কালো চা।', '/food/tea.jpg', true, 0, false, true, 2000, 'cat_drinks', 2, 'SIMULATED'),
  ('it_te_puff', 'rst_tea', 'mc_tea_all', 'Veg Puff', 'ভেজ পাফ', 'Sample puff.', 'নমুনা পাফ।', '/food/snacks.jpg', true, 0, false, true, 4000, 'cat_snacks', 3, 'SIMULATED'),
  ('it_te_singara', 'rst_tea', 'mc_tea_all', 'Singara (2 pcs)', 'সিংড়া (২টি)', 'Sample singara.', 'নমুনা সিংড়া।', '/food/snacks.jpg', true, 1, true, true, 3500, 'cat_snacks', 4, 'SIMULATED'),
  ('it_gr_bowl', 'rst_green', 'mc_grn_rec', 'Millet Veg Bowl', 'মিলেট ভেজ বোল', 'Sample millet bowl.', 'নমুনা মিলেট বোল।', '/food/veg.jpg', true, 0, true, true, 15000, 'cat_veg', 1, 'SIMULATED'),
  ('it_gr_thali', 'rst_green', 'mc_grn_all', 'Satvik Thali', 'সাত্ত্বিক থালি', 'Sample satvik thali.', 'নমুনা সাত্ত্বিক থালি।', '/food/thali.jpg', true, 0, false, true, 14000, 'cat_veg', 2, 'SIMULATED'),
  ('it_gr_salad', 'rst_green', 'mc_grn_all', 'Sprout Salad', 'স্প্রাউট সালাদ', 'Sample salad.', 'নমুনা সালাদ।', '/food/veg.jpg', true, 0, false, true, 11000, 'cat_veg', 3, 'SIMULATED'),
  ('it_gr_lassi', 'rst_green', 'mc_grn_all', 'Chaas', 'ছাছ', 'Sample chaas.', 'নমুনা ছাছ।', '/food/drinks.jpg', true, 0, false, true, 4000, 'cat_drinks', 4, 'SIMULATED')
on conflict (id) do nothing;

insert into menu_variants (id, item_id, name_en, name_bn, price_paise, is_default, available, sort_order) values
  ('vr_bir_ck_h', 'it_bir_ck', 'Half', 'হাফ', 22000, true, true, 0),
  ('vr_bir_ck_f', 'it_bir_ck', 'Full', 'ফুল', 38000, false, true, 1),
  ('vr_bir_mut_h', 'it_bir_mut', 'Half', 'হাফ', 28000, true, true, 0),
  ('vr_bir_mut_f', 'it_bir_mut', 'Full', 'ফুল', 48000, false, true, 1),
  ('vr_pz_mar_r', 'it_pz_mar', 'Regular', 'রেগুলার', 19900, true, true, 0),
  ('vr_pz_mar_m', 'it_pz_mar', 'Medium', 'মিডিয়াম', 29900, false, true, 1),
  ('vr_pz_mar_l', 'it_pz_mar', 'Large', 'লার্জ', 39900, false, true, 2),
  ('vr_pz_ch_r', 'it_pz_ch', 'Regular', 'রেগুলার', 27900, true, true, 0),
  ('vr_pz_ch_m', 'it_pz_ch', 'Medium', 'মিডিয়াম', 37900, false, true, 1),
  ('vr_pz_ch_l', 'it_pz_ch', 'Large', 'লার্জ', 47900, false, true, 2),
  ('vr_bu_cl_s', 'it_bu_cl', 'Single', 'সিঙ্গেল', 12900, true, true, 0),
  ('vr_bu_cl_d', 'it_bu_cl', 'Double patty', 'ডাবল প্যাটি', 17900, false, true, 1),
  ('vr_mo_st_8', 'it_mo_st', '8 pcs', '৮টি', 9000, true, true, 0),
  ('vr_mo_st_12', 'it_mo_st', '12 pcs', '১২টি', 13000, false, true, 1)
on conflict (id) do nothing;

insert into addon_groups (id, item_id, name_en, name_bn, required, min_select, max_select) values
  ('ag_bir_ck', 'it_bir_ck', 'Add-ons', 'অ্যাড-অন', false, 0, 3),
  ('ag_bu_cl', 'it_bu_cl', 'Add-ons', 'অ্যাড-অন', false, 0, 3),
  ('ag_pz_ch', 'it_pz_ch', 'Extra toppings', 'অতিরিক্ত টপিং', false, 0, 4),
  ('ag_mo_st', 'it_mo_st', 'Dips', 'ডিপ', false, 0, 2),
  ('ag_rl_ck', 'it_rl_ck', 'Add-ons', 'অ্যাড-অন', false, 0, 2)
on conflict (id) do nothing;

insert into addons (id, group_id, name_en, name_bn, price_paise, available) values
  ('ad_raita', 'ag_bir_ck', 'Extra raita', 'অতিরিক্ত রায়তা', 2500, true),
  ('ad_salan', 'ag_bir_ck', 'Mirchi salan', 'মিরচি সালান', 3000, true),
  ('ad_egg', 'ag_bir_ck', 'Add boiled egg', 'ডিম যোগ', 2000, true),
  ('ad_cheese', 'ag_bu_cl', 'Cheese slice', 'চিজ', 2500, true),
  ('ad_patty', 'ag_bu_cl', 'Extra patty', 'অতিরিক্ত প্যাটি', 5000, true),
  ('ad_sauce', 'ag_bu_cl', 'Extra sauce', 'অতিরিক্ত সস', 1000, true),
  ('ad_olives', 'ag_pz_ch', 'Olives', 'অলিভ', 3000, true),
  ('ad_jal', 'ag_pz_ch', 'Jalapeno', 'জালাপিনো', 2500, true),
  ('ad_xch', 'ag_pz_ch', 'Extra chicken', 'অতিরিক্ত চিকেন', 5000, true),
  ('ad_mayo', 'ag_mo_st', 'Mayo dip', 'মেয়ো', 1500, true),
  ('ad_schez', 'ag_mo_st', 'Schezwan dip', 'শেজওয়ান', 1500, true),
  ('ad_rl_cheese', 'ag_rl_ck', 'Cheese', 'চিজ', 2000, true),
  ('ad_rl_egg', 'ag_rl_ck', 'Double egg', 'ডাবল ডিম', 2500, true)
on conflict (id) do nothing;

insert into promotions (id, code, name_en, name_bn, kind, percent_bps, amount_paise, min_order_paise, max_discount_paise, funded_by, restaurant_id, first_order_only, per_user_limit, active, data_label) values
  ('promo_first50', 'FIRST50', '₹50 off first order', 'প্রথম অর্ডারে ₹৫০ ছাড়', 'fixed', null, 5000, 19900, 5000, 'PLATFORM', null, true, 1, true, 'SIMULATED'),
  ('promo_sample10', 'SAMPLE10', '10% off sample kitchens', 'নমুনা কিচেনে ১০% ছাড়', 'percent', 1000, null, 15000, 4000, 'PLATFORM', null, false, 5, true, 'SIMULATED'),
  ('promo_momo', 'MOMO20', '₹20 off Barak Momo Hut', 'মোমো হাটে ₹২০ ছাড়', 'fixed', null, 2000, 9000, 2000, 'RESTAURANT', 'rst_momo', false, 3, true, 'SIMULATED')
on conflict (id) do nothing;

insert into app_config (key, value, updated_at) values
('brand', $cfg${
  "appName": "Haat",
  "shortName": "Haat",
  "companyName": "Haat Marketplace",
  "tagline": "Order from kitchens near you",
  "description": "A fair local food marketplace for Sribhumi. Sample catalogue until real kitchens are verified.",
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
  "seoTitle": "Haat — food delivery in Sribhumi",
  "seoDescription": "Order from local kitchens in Karimganj / Sribhumi. Clear prices, no mystery fees.",
  "ogImageUrl": "/og.jpg",
  "promotionalHeadline": "Kitchens around Sribhumi, one table."
}$cfg$, now()),
('domain', $cfg${
  "primaryDomain": "",
  "webUrl": "/",
  "supportUrl": "/support",
  "privacyUrl": "/legal/privacy",
  "termsUrl": "/legal/terms",
  "refundsUrl": "/legal/refunds",
  "restaurantPortalUrl": "/restaurant",
  "riderPortalUrl": "/rider",
  "adminUrl": "/admin"
}$cfg$, now()),
('store', $cfg${
  "appStoreName": "Haat",
  "playStoreName": "Haat",
  "shortDescription": "Order food in Sribhumi",
  "longDescription": "Haat is a local food marketplace for Karimganj / Sribhumi, Assam.",
  "publisherName": "Haat Marketplace",
  "supportUrl": "/support",
  "privacyUrl": "/legal/privacy"
}$cfg$, now()),
('communication', $cfg${
  "notificationSenderName": "Haat",
  "smsSenderId": "",
  "whatsappDisplayName": "Haat",
  "emailSenderName": "Haat",
  "emailFromAddress": "",
  "supportName": "Haat Support",
  "supportEmail": "support@localhost",
  "supportPhone": "",
  "grievanceOfficerName": "Grievance Officer",
  "grievanceEmail": "grievance@localhost"
}$cfg$, now()),
('invoice', $cfg${
  "companyName": "Haat Marketplace",
  "logoUrl": "",
  "address": "Sribhumi, Assam, India",
  "gstin": "PENDING",
  "fssai": "PENDING",
  "supportContact": "support@localhost",
  "footer": "Thank you for ordering.",
  "legalFooter": "This is not a tax invoice until GSTIN is registered."
}$cfg$, now()),
('restaurantFacing', $cfg${
  "portalName": "Haat for Kitchens",
  "dashboardLogoUrl": "",
  "notificationSender": "Haat Kitchens",
  "settlementStatementBrand": "Haat Marketplace"
}$cfg$, now()),
('business', $cfg${
  "legalEntityName": "Haat Marketplace",
  "country": "IN",
  "defaultCityId": "city_sribhumi",
  "defaultLanguage": "en",
  "supportedLanguages": ["en", "bn"],
  "timezone": "Asia/Kolkata",
  "currency": "INR",
  "currencyMinorName": "paise"
}$cfg$, now()),
('marketplace', $cfg${
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
  "orderPrefix": "H",
  "allowDevTools": true,
  "sampleCatalogueBanner": true,
  "launchMode": "development"
}$cfg$, now()),
('tax', $cfg${
  "menuPricesIncludeTax": true,
  "menuTaxBps": 500,
  "deliveryTaxBps": 0,
  "serviceTaxBps": 1800,
  "commissionTaxBps": 1800,
  "taxLabel": "GST"
}$cfg$, now()),
('notification', $cfg${
  "inAppEnabled": true,
  "pushProvider": "none",
  "smsProvider": "none",
  "whatsappProvider": "none",
  "emailProvider": "none"
}$cfg$, now())
on conflict (key) do nothing;

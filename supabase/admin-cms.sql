-- BARAN CANDLE SHOP — Full multilingual content CMS
-- Run once in Supabase SQL Editor.

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  content_key text unique not null,
  badini text not null default '',
  sorani text not null default '',
  arabic text not null default '',
  english text not null default '',
  content_type text not null default 'text' check (content_type in ('text','html','placeholder','label')),
  section text not null default 'general',
  sort_order integer not null default 0,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists site_content_section_idx on public.site_content(section, sort_order);

alter table public.site_content enable row level security;

drop policy if exists "public read active site content" on public.site_content;
create policy "public read active site content"
on public.site_content for select to anon, authenticated
using (active = true);

drop policy if exists "admins manage site content" on public.site_content;
create policy "admins manage site content"
on public.site_content for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create or replace function public.set_site_content_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at before update on public.site_content
for each row execute function public.set_site_content_updated_at();

-- Seed every storefront text key used by the current homepage.
insert into public.site_content(content_key,badini,sorani,arabic,english,content_type,section,sort_order) values
('announcement','گەهاندنا خێرا بۆ هەمی ناڤچەیێن کوردستان ✦','گەیاندنی خێرا بۆ هەموو ناوچەکانی کوردستان ✦','توصيل سريع إلى جميع أنحاء العراق ✦','Fast delivery across Iraq ✦','text','header',10),
('navHome','سەرەکی','سەرەکی','الرئيسية','Home','label','header',20),
('navShop','بەرهەم','بەرهەمەکان','المنتجات','Shop','label','header',30),
('navRitual','ڕێوڕەسم','ڕیتواڵ','الطقس','Ritual','label','header',40),
('navStory','چیرۆکا مە','چیرۆکەکەمان','قصتنا','Our Story','label','header',50),
('navContact','پەیوەندی','پەیوەندی','تواصل معنا','Contact','label','header',60),
('heroEyebrow','ب دەست و خۆشەویستی','بە دەست و خۆشەویستی','مصنوع بحب وعناية','Hand-poured with care','text','hero',10),
('heroTitle','رۆناهییەک بۆ<br><em>هەر ساتەکێ.</em>','ڕووناکییەک بۆ<br><em>هەموو ساتێک.</em>','نورٌ لكل<br><em>لحظة.</em>','A glow for<br><em>every moment.</em>','html','hero',20),
('heroText','مۆمێن دەستکردێن پریمیۆم، بۆنێن ئارام و دیارییێن جوان ژ بو هەستەکێ تایبەت.','مۆمی دەستکردی پریمیۆم، بۆنە هێمنەکان و دیارییە جوانەکان بۆ هەستێکی تایبەت.','شموع فاخرة مصنوعة يدوياً، بروائح هادئة وهدايا أنيقة تضيف لمسة استثنائية.','Premium handmade candles, serene scents and elegant gifts for special moments.','text','hero',30),
('shopNow','نیها بکڕە','ئێستا بکڕە','تسوق الآن','Shop now','label','hero',40),
('introLabel','جیهانەکێ بچووک بۆ هەستەکێ مەزن','جیهانێکی بچووک بۆ هەستێکی گەورە','عالم صغير لإحساس كبير','A small world for a beautiful feeling','text','intro',10),
('introTitle','مۆم نییە تەنێ.<br><em>رۆناهییەکا ژیانێیە.</em>','مۆم نییە تەنها.<br><em>ڕووناکییەکی ژیانە.</em>','ليست مجرد شمعة.<br><em>إنها نور للحياة.</em>','More than a candle.<br><em>A light for life.</em>','html','intro',20),
('introText','هەر دانەیەک ب دەست هاتیە دروستکرن، ب بۆنەکێ کو بیرەوەری دروست دکەت.','هەر دانەیەک بە دەست هەڵدەکۆڵرێت، بە بۆنێک کە بیرەوەری دروست دەکات.','كل قطعة تُصب يدوياً بعطر يصنع ذكرى.','Each piece is hand-poured with a scent made to create memories.','text','intro',30),
('categoriesTitle','جیهانا بۆن و جوانیێ','جیهانی بۆن و جوانی','عالم من العطر والجمال','A world of scent and beauty','text','categories',10),
('catScented','مۆمێن بۆنخۆش','مۆمی بۆنخۆش','شموع معطرة','Scented Candles','label','categories',20),
('catDecor','مۆمێن دیکۆر','مۆمی دیکۆر','شموع للديكور','Decorative Candles','label','categories',30),
('catGifts','دیارییێن تایبەت','دیارییە تایبەتەکان','مجموعات هدايا','Handmade Gift Sets','label','categories',40),
('ourCollection','کۆکراوەیا مە','کۆمەڵەکەمان','مجموعتنا','Our collection','label','shop',10),
('shopTitle','بەرهەمێن هەڵبژێردی','بەرهەمە هەڵبژێردراوەکان','منتجات مختارة لك','Curated for you','text','shop',20),
('viewAll','هەمی ببینە ↗','هەمووی ببینە ↗','عرض الكل ↗','View all ↗','label','shop',30),
('search','ل بەرهەمەکی بگەڕێ...','بۆ بەرهەمێک بگەڕێ...','ابحث عن منتج...','Search products...','placeholder','shop',40),
('all','هەمی','هەموو','الكل','All','label','shop',50),
('scented','بۆنخۆش','بۆنخۆش','معطرة','Scented','label','shop',60),
('decor','دیکۆر','دیکۆر','ديكور','Decor','label','shop',70),
('gifts','دیاری','دیاری','هدايا','Gifts','label','shop',80),
('featured','هەڵبژێردی','هەڵبژێردراو','مميزة','Featured','label','shop',90),
('low','نرخ: کەم بۆ زۆر','نرخ: کەم بۆ زۆر','السعر: الأقل أولاً','Price: low to high','label','shop',100),
('high','نرخ: زۆر بۆ کەم','نرخ: زۆر بۆ کەم','السعر: الأعلى أولاً','Price: high to low','label','shop',110),
('ritualTitle','دەمێ مۆم دسوژیت،<br><em>دەم کەمەک راوەستیت.</em>','کاتێک مۆم دەسووتێت،<br><em>کات کەمێک وەستێت.</em>','عندما تحترق الشمعة،<br><em>يتوقف الوقت قليلاً.</em>','When the candle burns,<br><em>time slows down.</em>','html','ritual',10),
('ritualText','مۆمێکێ دابنێ، چرایان کەم بکە و بهێلە بۆنەکە مالا تە پڕ بکەت.','مۆمێک دابنێ، چرایەکان کەم بکە و با بۆنەکە ماڵەکەت پڕ بکات.','أشعل شمعة، خفف الإضاءة ودع العطر يملأ منزلك.','Light a candle, dim the lights and let the scent fill your home.','text','ritual',20),
('step1','هەڵبژێرە','هەڵیبژێرە','اخترها','Choose','label','ritual',30),
('step2','دائگرسێنە','داگیرسێنە','أشعلها','Light','label','ritual',40),
('step3','هەست بکە','هەست بکە','استمتع','Feel','label','ritual',50),
('ourStory','چیرۆکا باران','چیرۆکی باران','قصة باران','The Baran story','label','story',10),
('storyTitle','ژ دڵێ هاتیە دروستکرن.<br><em>بۆ مالا تە.</em>','لە دڵەوە دروستکراوە.<br><em>بۆ ماڵەوەی تۆ.</em>','مصنوعة من القلب.<br><em>لمنزلك.</em>','Made from the heart.<br><em>For your home.</em>','html','story',20),
('storyText','هەر مۆمێکێ Baran ب دەست هاتیە دروستکرن، ب مومێکی باش و بۆنێکی هاوسەنگ.','هەر مۆمێکی Baran بە دەست دروست دەکرێت، بە مومێکی باش و بۆنی هاوسەنگ.','كل شمعة من Baran تُصنع يدوياً من شمع مختار وعطر متوازن.','Every Baran candle is hand-poured with carefully selected wax and balanced fragrance.','text','story',30),
('readStory','چیرۆکا مە بخوینە ↗','چیرۆکەکەمان بخوێنەوە ↗','اقرأ قصتنا ↗','Read our story ↗','label','story',40),
('value1','مومێکی پاک','مومی پاک','شمع نقي','Pure wax','label','values',10),
('value1p','Soy Wax و Beeswax ب هەڵبژاردنەکا ورد.','Soy Wax و Beeswax بە هەڵبژاردنی ورد.','شمع الصويا وشمع العسل باختيار دقيق.','Soy Wax and Beeswax, carefully selected.','text','values',20),
('value2','بۆنەکا تایبەت','بۆنی تایبەت','عطر مميز','Signature scent','label','values',30),
('value2p','بۆنێن هاوسەنگ بۆ هەستەکا قووڵتر.','بۆنە هاوسەنگەکان بۆ هەستی قووڵتر.','روائح متوازنة لإحساس أعمق.','Balanced notes for a deeper feeling.','text','values',40),
('value3','پەکەجینگا جوان','پەکەجینگی جوان','تغليف أنيق','Beautiful packaging','label','values',50),
('value3p','ئامادەیە بۆ تە یان کەسەکێ تە خۆش.','ئامادەیە بۆ خۆت یان کەسێکی خۆشەویست.','جاهز لك أو لمن تحب.','Ready for you or someone you love.','text','values',60),
('value4','دروستکریا ناڤخۆ','دروستکراوی ناوخۆ','صنع محلي','Made locally','label','values',70),
('value4p','ب دەست دروستکری ل کوردستان.','بە دەست دروستکراو لە کوردستان.','مصنوع يدوياً في كردستان.','Handmade in Kurdistan.','text','values',80),
('newsletterTitle','بەهارا بۆنێن خۆ ل دەست مەدە.','بەهاری بۆنەکانت لەدەست مەدە.','لا تفوّت جديد الروائح.','Never miss a new scent.','text','newsletter',10),
('newsletterText','ئیمەیڵا خۆ بنڤیسە بۆ کۆمەڵا نوی و ئۆفەرێن تایبەت.','ئیمەیڵەکەت بنووسە بۆ کۆمەڵە نوێکان و ئۆفەرە تایبەتەکان.','سجل بريدك للعروض والمجموعات الجديدة.','Join for new collections and special offers.','text','newsletter',20),
('email','ئیمەیڵا تە','ئیمەیڵەکەت','بريدك الإلكتروني','Your email','placeholder','newsletter',30),
('join','بەشدار بە','بەشداری بکە','اشترك','Join','label','newsletter',40),
('yourCart','سەبەتا تە','سەبەتەکەت','سلة مشترياتك','Your cart','label','cart',10),
('subtotal','کۆی گشتی','کۆی گشتی','المجموع','Subtotal','label','cart',20),
('checkout','بۆ پارەدان','بڕۆ بۆ پارەدان','إتمام الطلب','Checkout','label','cart',30),
('footer','بۆن، رۆناهی، ئارامی','بۆن، ڕووناکی، ئارامی','عطر، نور، هدوء','Scent, light, serenity','text','footer',10),
('collectionBadge','هەڵبژێردی · ٢٠٢٦','هەڵبژێردراو · ٢٠٢٦','مختارات · ٢٠٢٦','Curated · 2026','label','shop',120),
('lightMoment','رۆناهی بۆ ساتێ','ڕووناکی بۆ ساتێک','نور للحظة','Light the moment','label','hero',50)
on conflict (content_key) do update set
  badini=excluded.badini,
  sorani=excluded.sorani,
  arabic=excluded.arabic,
  english=excluded.english,
  content_type=excluded.content_type,
  section=excluded.section,
  sort_order=excluded.sort_order,
  updated_at=now();

-- Make the existing Baran admin profile active without changing its role value.
insert into public.admin_profiles(id, full_name, role, active)
select id, 'Baran', role, true
from auth.users
where lower(email)=lower('Baran@gmail.com')
on conflict (id) do update set full_name='Baran', active=true, updated_at=now();

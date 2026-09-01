/* =========================================================
   BARAN CANDLE SHOP — COMPLETE STOREFRONT RUNTIME
   Supabase + Products + Images + Realtime + Languages
========================================================= */

(() => {
'use strict';

/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
'https://oyaczputirsxfmphnlsh.supabase.co';

const SUPABASE_ANON_KEY =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95YWN6cHV0aXJzeGZtcGhubHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNTQ0NzUsImV4cCI6MjEwMzgzMDQ3NX0.fiOo-DfZAHC2vhge9W4_IAbIEVDsP3xtSFkHFgHXE0M';

let supabase = null;


/* =========================================================
   HELPERS
========================================================= */

const $ = selector => document.querySelector(selector);

const $$ = selector =>
    [...document.querySelectorAll(selector)];

const safe = value =>
    String(value ?? '').replace(/[&<>"]/g, char => ({
        '&':'&amp;',
        '<':'&lt;',
        '>':'&gt;',
        '"':'&quot;'
    }[char]));


/* =========================================================
   FONT
========================================================= */

function installBaranFont() {

    if (!document.querySelector('#baran-font')) {

        const link = document.createElement('link');

        link.id = 'baran-font';
        link.rel = 'stylesheet';

        link.href =
        'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap';

        document.head.appendChild(link);
    }


    if (!document.querySelector('#baran-font-style')) {

        const style = document.createElement('style');

        style.id = 'baran-font-style';

        style.textContent = `

        html,
        body,
        button,
        input,
        select,
        textarea,
        a,
        h1,h2,h3,h4,h5,h6,
        p,
        span {
            font-family:
                "Noto Sans Arabic",
                "DM Sans",
                sans-serif !important;
        }

        body {
            font-feature-settings:
                "kern" 1,
                "liga" 1;
            text-rendering: optimizeLegibility;
        }

        .product-card {
            overflow:hidden;
        }

        .product-img {
            position:relative;
            overflow:hidden;
            min-height:320px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#f1ebe3;
        }

        .product-img img.product-real-image {
            width:100%;
            height:320px;
            object-fit:cover;
            display:block;
            opacity:1;
            transition:
                transform .45s ease,
                opacity .25s ease;
        }

        .product-card:hover
        .product-real-image {
            transform:scale(1.04);
        }

        .product-image-fallback {
            width:100%;
            height:320px;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:42px;
            opacity:.45;
        }

        .product-info {
            position:relative;
            z-index:2;
        }

        .product-card .add {
            position:relative;
            z-index:5;
            cursor:pointer;
        }

        .product-meta {
            line-height:1.8;
        }

        `;

        document.head.appendChild(style);
    }
}


/* =========================================================
   STATE
========================================================= */

let lang =
    localStorage.getItem('baran-language') || 'badini';

let filter = 'all';

let products = [];

let categories = [];

let cart =
    JSON.parse(
        localStorage.getItem('baran-cart') || '[]'
    );

let realtimeChannel = null;


/* =========================================================
   TRANSLATIONS
========================================================= */

const T = {

badini: {
announcement:'گەهاندنا خێرا بۆ هەمی ناڤچەیێن کوردستان ✦',
navHome:'سەرەکی',
navShop:'بەرهەم',
navRitual:'ڕێوڕەسم',
navStory:'چیرۆکا مە',
navContact:'پەیوەندی',
heroEyebrow:'ب دەست و خۆشەویستی',
heroTitle:'رۆناهییەک بۆ<br><em>هەر ساتەکێ.</em>',
heroText:'مۆمێن دەستکردێن پریمیۆم، بۆنێن ئارام و دیارییێن جوان ژ بو هەستەکێ تایبەت.',
shopNow:'نیها بکڕە',
categoriesTitle:'جیهانا بۆن و جوانیێ',
catScented:'مۆمێن بۆنخۆش',
catScentedSub:'مۆمێن بۆنخۆش',
catDecor:'مۆمێن دیکۆر',
catDecorSub:'مۆمێن دیکۆر و ستوونی',
catGifts:'دیارییێن تایبەت',
catGiftsSub:'کۆمەڵێن دیارییێن دەستکرد',
ourCollection:'کۆکراوەیا مە',
shopTitle:'بەرهەمێن هەڵبژێردی',
viewAll:'هەمی ببینە ↗',
search:'ل بەرهەمەکی بگەڕێ...',
all:'هەمی',
scented:'بۆنخۆش',
decor:'دیکۆر',
gifts:'دیاری',
featured:'هەڵبژێردی',
low:'نرخ: کەم بۆ زۆر',
high:'نرخ: زۆر بۆ کەم',
ourStory:'چیرۆکا باران',
storyTitle:'ژ دڵێ هاتیە دروستکرن.<br><em>بۆ مالا تە.</em>',
storyText:'هەر مۆمێکێ Baran ب دەست هاتیە دروستکرن، ب مومێکی باش و بۆنێکی هاوسەنگ. باوەری مە وایە تشتێن بچووک دکارن هەستێن مەزن دروست بکەن.',
ritualTitle:'دەمێ مۆم دسوژیت،<br><em>دەم کەمەک راوەستیت.</em>',
ritualText:'مۆمێکێ دابنێ، چرایان کەم بکە و بهێلە بۆنەکە مالا تە پڕ بکەت.',
step1:'هەڵبژێرە',
step2:'دائگرسێنە',
step3:'هەست بکە',
value1:'مومێکی پاک',
value1p:'Soy Wax و Beeswax ب هەڵبژاردنەکا ورد.',
value2:'بۆنەکا تایبەت',
value2p:'بۆنێن هاوسەنگ بۆ هەستەکا قووڵتر.',
value3:'پەکەجینگا جوان',
value3p:'ئامادەیە بۆ تە یان کەسەکێ تە خۆش.',
value4:'دروستکریا ناڤخۆ',
value4p:'ب دەست دروستکری ل کوردستان.',
newsletterTitle:'بەهارا بۆنێن خۆ ل دەست مەدە.',
newsletterText:'ئیمەیڵا خۆ بنڤیسە بۆ کۆمەڵا نوی و ئۆفەرێن تایبەت.',
email:'ئیمەیڵا تە',
join:'بەشدار بە',
yourCart:'سەبەتا تە',
subtotal:'کۆی گشتی',
checkout:'بۆ پارەدان',
footer:'بۆن، رۆناهی، ئارامی',
readStory:'چیرۆکا مە بخوینە ↗',
collectionBadge:'هەڵبژێردی · ٢٠٢٦',
lightMoment:'رۆناهی بۆ ساتێ'
},

sorani: {
announcement:'گەیاندنی خێرا بۆ هەموو ناوچەکانی کوردستان ✦',
navHome:'سەرەکی',
navShop:'بەرهەمەکان',
navRitual:'ڕیتواڵ',
navStory:'چیرۆکەکەمان',
navContact:'پەیوەندی',
heroEyebrow:'بە دەست و خۆشەویستی',
heroTitle:'ڕووناکییەک بۆ<br><em>هەموو ساتێک.</em>',
heroText:'مۆمی دەستکردی پریمیۆم، بۆنە هێمنەکان و دیارییە جوانەکان بۆ هەستێکی تایبەت.',
shopNow:'ئێستا بکڕە',
categoriesTitle:'جیهانی بۆن و جوانی',
catScented:'مۆمی بۆنخۆش',
catScentedSub:'مۆمی بۆنخۆش',
catDecor:'مۆمی دیکۆر',
catDecorSub:'مۆمی دیکۆر و ستوونی',
catGifts:'دیارییە تایبەتەکان',
catGiftsSub:'کۆمەڵەی دیارییە دەستکردەکان',
ourCollection:'کۆمەڵەکەمان',
shopTitle:'بەرهەمە هەڵبژێردراوەکان',
viewAll:'هەمووی ببینە ↗',
search:'بۆ بەرهەمێک بگەڕێ...',
all:'هەموو',
scented:'بۆنخۆش',
decor:'دیکۆر',
gifts:'دیاری',
featured:'هەڵبژێردراو',
low:'نرخ: کەم بۆ زۆر',
high:'نرخ: زۆر بۆ کەم',
ourStory:'چیرۆکی باران',
storyTitle:'لە دڵەوە دروستکراوە.<br><em>بۆ ماڵەوەی تۆ.</em>',
storyText:'هەر مۆمێکی Baran بە دەست دروست دەکرێت، بە مومێکی باش و بۆنی هاوسەنگ. باوەڕمان وایە شتە بچووکەکان دەتوانن هەستی گەورە دروست بکەن.',
ritualTitle:'کاتێک مۆم دەسووتێت،<br><em>کات کەمێک وەستێت.</em>',
ritualText:'مۆمێک دابنێ، چرایەکان کەم بکە و با بۆنەکە ماڵەکەت پڕ بکات.',
step1:'هەڵیبژێرە',
step2:'داگیرسێنە',
step3:'هەست بکە',
value1:'مومی پاک',
value1p:'Soy Wax و Beeswax بە هەڵبژاردنی ورد.',
value2:'بۆنی تایبەت',
value2p:'بۆنە هاوسەنگەکان بۆ هەستی قووڵتر.',
value3:'پەکەجینگی جوان',
value3p:'ئامادەیە بۆ خۆت یان کەسێکی خۆشەویست.',
value4:'دروستکراوی ناوخۆ',
value4p:'بە دەست دروستکراو لە کوردستان.',
newsletterTitle:'بەهاری بۆنەکانت لەدەست مەدە.',
newsletterText:'ئیمەیڵەکەت بنووسە بۆ کۆمەڵە نوێکان و ئۆفەرە تایبەتەکان.',
email:'ئیمەیڵەکەت',
join:'بەشداری بکە',
yourCart:'سەبەتەکەت',
subtotal:'کۆی گشتی',
checkout:'بڕۆ بۆ پارەدان',
footer:'بۆن، ڕووناکی، ئارامی',
readStory:'چیرۆکەکەمان بخوێنەوە ↗',
collectionBadge:'هەڵبژێردراو · ٢٠٢٦',
lightMoment:'ڕووناکی بۆ ساتێک'
},

arabic: {
announcement:'توصيل سريع إلى جميع أنحاء العراق ✦',
navHome:'الرئيسية',
navShop:'المنتجات',
navRitual:'الطقس',
navStory:'قصتنا',
navContact:'تواصل معنا',
heroEyebrow:'مصنوع بحب وعناية',
heroTitle:'نورٌ لكل<br><em>لحظة.</em>',
heroText:'شموع فاخرة مصنوعة يدوياً، بروائح هادئة وهدايا أنيقة تضيف لمسة استثنائية.',
shopNow:'تسوق الآن',
categoriesTitle:'عالم من العطر والجمال',
catScented:'شموع معطرة',
catScentedSub:'شموع معطرة',
catDecor:'شموع للديكور',
catDecorSub:'شموع ديكور وأعمدة',
catGifts:'مجموعات هدايا',
catGiftsSub:'مجموعات هدايا مصنوعة يدوياً',
ourCollection:'مجموعتنا',
shopTitle:'منتجات مختارة لك',
viewAll:'عرض الكل ↗',
search:'ابحث عن منتج...',
all:'الكل',
scented:'معطرة',
decor:'ديكور',
gifts:'هدايا',
featured:'مميزة',
low:'السعر: الأقل أولاً',
high:'السعر: الأعلى أولاً',
ourStory:'قصة باران',
storyTitle:'مصنوعة من القلب.<br><em>لمنزلك.</em>',
storyText:'كل شمعة من Baran مصنوعة يدوياً من شمع مختار بعناية وعطور متوازنة. نؤمن أن التفاصيل الصغيرة تصنع مشاعر كبيرة.',
ritualTitle:'عندما تحترق الشمعة،<br><em>يتوقف الوقت قليلاً.</em>',
ritualText:'أشعل شمعة، خفّف الأضواء ودع العطر يملأ منزلك.',
step1:'اخترها',
step2:'أشعلها',
step3:'استشعرها',
value1:'شمع نقي',
value1p:'شمع الصويا وشمع العسل باختيار دقيق.',
value2:'عطر مميز',
value2p:'نفحات متوازنة لشعور أعمق.',
value3:'تغليف أنيق',
value3p:'جاهز لك أو لمن تحب.',
value4:'صناعة محلية',
value4p:'مصنوع يدوياً في كردستان.',
newsletterTitle:'لا تفوّت مواسم العطر.',
newsletterText:'أدخل بريدك لمعرفة التشكيلات الجديدة والعروض الخاصة.',
email:'بريدك الإلكتروني',
join:'اشترك',
yourCart:'سلة التسوق',
subtotal:'المجموع',
checkout:'إتمام الدفع',
footer:'عطر، نور، وهدوء.',
readStory:'اقرأ قصتنا ↗',
collectionBadge:'مختارات · ٢٠٢٦',
lightMoment:'نور لكل لحظة'
},

english: {
announcement:'Fast delivery across Iraq & Kurdistan ✦',
navHome:'Home',
navShop:'Shop',
navRitual:'Ritual',
navStory:'Our Story',
navContact:'Contact',
heroEyebrow:'Made by hand, made with love',
heroTitle:'A little light for<br><em>every moment.</em>',
heroText:'Premium handmade candles, quiet fragrances and beautiful gifts designed to make everyday moments feel special.',
shopNow:'Shop now',
categoriesTitle:'A world of scent & beauty',
catScented:'Scented Candles',
catScentedSub:'Scented Candles',
catDecor:'Decorative Candles',
catDecorSub:'Decorative & Pillar Candles',
catGifts:'Special Gift Sets',
catGiftsSub:'Handmade Gift Sets',
ourCollection:'Our collection',
shopTitle:'The selected pieces',
viewAll:'View all ↗',
search:'Search products...',
all:'All',
scented:'Scented',
decor:'Decor',
gifts:'Gifts',
featured:'Featured',
low:'Price: low to high',
high:'Price: high to low',
ourStory:'The Baran story',
storyTitle:'Made from the heart.<br><em>For your home.</em>',
storyText:'Every Baran candle is hand-poured with carefully selected wax and balanced fragrance. We believe small details can create big feelings.',
ritualTitle:'When a candle burns,<br><em>time slows down.</em>',
ritualText:'Light a candle, dim the lights and let the fragrance fill your home.',
step1:'Choose',
step2:'Light',
step3:'Feel',
value1:'Pure wax',
value1p:'Soy Wax and Beeswax, carefully selected.',
value2:'Signature scent',
value2p:'Balanced notes for a deeper feeling.',
value3:'Beautiful packaging',
value3p:'Ready for you or someone you love.',
value4:'Locally made',
value4p:'Hand-poured in Kurdistan.',
newsletterTitle:'Never miss a season of scent.',
newsletterText:'Join our notes for new collections and private offers.',
email:'Your email',
join:'Join us',
yourCart:'Your cart',
subtotal:'Subtotal',
checkout:'Checkout',
footer:'Scent, light, serenity.',
readStory:'Read our story ↗',
collectionBadge:'CURATED · 2026',
lightMoment:'Light the moment'
}

};

if (!T[lang]) lang = 'badini';

const tr = key =>
    T[lang]?.[key] ??
    T.english[key] ??
    key;


/* =========================================================
   SUPABASE LOADER
========================================================= */

async function loadSupabase() {

    if (window.supabase) {

        supabase =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_ANON_KEY
            );

        return;
    }


    await new Promise((resolve, reject) => {

        const script =
            document.createElement('script');

        script.src =
            'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

        script.onload = resolve;

        script.onerror = reject;

        document.head.appendChild(script);
    });


    supabase =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );
}


/* =========================================================
   TRANSLATION
========================================================= */

function renderText() {

    $$('[data-i18n]').forEach(element => {

        const key =
            element.dataset.i18n;

        if (T[lang]?.[key] !== undefined) {
            element.innerHTML =
                T[lang][key];
        }
    });


    $$('[data-i18n-placeholder]').forEach(element => {

        const key =
            element.dataset.i18nPlaceholder;

        if (T[lang]?.[key] !== undefined) {
            element.placeholder =
                T[lang][key];
        }
    });


    const hard = {

        '.hero-proof span:nth-child(1)': {
            badini:'١٠٠٪ دەستکرد',
            sorani:'١٠٠٪ دەستکرد',
            arabic:'١٠٠٪ مصنوع يدوياً',
            english:'100% Handmade'
        },

        '.hero-proof span:nth-child(2)': {
            badini:'مومی سویا و مومی زەڕەنگ',
            sorani:'مومی سویا و مومی زەڕەنگ',
            arabic:'شمع الصويا وشمع العسل',
            english:'Soy & Beeswax'
        },

        '.hero-proof span:nth-child(3)': {
            badini:'بۆنی پریمیۆم',
            sorani:'بۆنی پریمیۆم',
            arabic:'عطر فاخر',
            english:'Premium Fragrance'
        },

        '.visual-note': {
            badini:'رۆناهی بۆ ساتێ',
            sorani:'ڕووناکی بۆ ساتێک',
            arabic:'نور لكل لحظة',
            english:'LIGHT THE MOMENT'
        },

        '.story-candle small': {
            badini:'دروستکراو<br>ب دەست',
            sorani:'دەست<br>دروستکراو',
            arabic:'مصنوع<br>يدوياً',
            english:'HAND<br>POURED'
        },

        '.footer-links a:nth-child(1)': {
            badini:'بەرهەم',
            sorani:'بەرهەمەکان',
            arabic:'المنتجات',
            english:'Shop'
        },

        '.footer-links a:nth-child(3)': {
            badini:'پەیوەندی',
            sorani:'پەیوەندی',
            arabic:'تواصل',
            english:'Contact'
        }
    };


    Object.entries(hard).forEach(
        ([selector, map]) => {

            const element =
                $(selector);

            if (
                element &&
                map[lang] !== undefined
            ) {
                element.innerHTML =
                    map[lang];
            }
        }
    );


    const badge =
        $('.collection-badge');

    if (badge) {
        badge.textContent =
            tr('collectionBadge');
    }


    if ($('#language')) {
        $('#language').value = lang;
    }


    document.documentElement.lang =
        lang === 'english'
            ? 'en'
            : lang === 'arabic'
                ? 'ar'
                : 'ku';


    document.documentElement.dir =
        lang === 'english'
            ? 'ltr'
            : 'rtl';
}


/* =========================================================
   CATEGORY
========================================================= */

function categorySlug(categoryId) {

    const category =
        categories.find(
            category =>
                String(category.id) ===
                String(categoryId)
        );

    return (
        category?.slug ||
        category?.name ||
        'scented'
    );
}


/* =========================================================
   PRODUCT NAME
========================================================= */

function productName(product) {

    return (
        product[`name_${lang}`] ||
        product.name_badini ||
        product.name_sorani ||
        product.name_arabic ||
        product.name_english ||
        product.name ||
        'Baran Candle'
    );
}


/* =========================================================
   PRODUCT IMAGE
========================================================= */

function productImage(product) {

    /* MAIN IMAGE */

    if (
        typeof product.image_url === 'string' &&
        product.image_url.trim()
    ) {

        return product.image_url.trim();
    }


    /* OTHER POSSIBLE IMAGE FIELDS */

    const possibleFields = [
        'image',
        'imageUrl',
        'image_url',
        'thumbnail',
        'thumbnail_url',
        'photo_url',
        'cover_image'
    ];


    for (const field of possibleFields) {

        if (
            typeof product[field] === 'string' &&
            product[field].trim()
        ) {

            return product[field].trim();
        }
    }


    /* IMAGES ARRAY */

    if (Array.isArray(product.images)) {

        const image =
            product.images.find(
                item =>
                    typeof item === 'string' &&
                    item.trim()
            );

        if (image) {
            return image.trim();
        }
    }


    /* IMAGES JSON ARRAY */

    if (
        typeof product.images === 'string'
    ) {

        try {

            const parsed =
                JSON.parse(product.images);

            if (Array.isArray(parsed)) {

                const image =
                    parsed.find(
                        item =>
                            typeof item === 'string' &&
                            item.trim()
                    );

                if (image) {
                    return image.trim();
                }
            }

        } catch {}
    }


    return '';
}


/* =========================================================
   PRODUCT META
========================================================= */

function productMeta(product) {

    const parts = [];


    if (product.wax_type) {
        parts.push(
            String(product.wax_type)
        );
    }


    if (product.burn_time_minutes) {

        parts.push(
            `${product.burn_time_minutes} min`
        );
    }


    if (product.notes) {
        parts.push(
            String(product.notes)
        );
    }


    return parts.join(' · ');
}


/* =========================================================
   LOAD PRODUCTS
========================================================= */

async function loadProducts() {

    const grid =
        $('#productGrid');


    if (grid) {

        grid.innerHTML = `

            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:50px 20px;
                opacity:.7;
            ">

                ${
                    lang === 'english'
                        ? 'Loading products...'
                        : lang === 'arabic'
                            ? 'جاري تحميل المنتجات...'
                            : 'بەرهەمەکان دادەبەزێن...'
                }

            </div>

        `;
    }


    try {

        const [
            categoriesResult,
            productsResult
        ] =
        await Promise.all([

            supabase
                .from('categories')
                .select('*')
                .eq('active', true)
                .order(
                    'sort_order',
                    { ascending:true }
                ),

            supabase
                .from('products')
                .select('*')
                .eq('active', true)
                .order(
                    'created_at',
                    { ascending:false }
                )
        ]);


        if (categoriesResult.error) {

            console.error(
                'Categories error:',
                categoriesResult.error
            );
        }


        if (productsResult.error) {

            console.error(
                'Products error:',
                productsResult.error
            );

            products = [];

        } else {

            products =
                productsResult.data || [];
        }


        categories =
            categoriesResult.data || [];


        renderProducts();

        renderCart();


    } catch (error) {

        console.error(
            'Supabase loading error:',
            error
        );


        if (grid) {

            grid.innerHTML = `

                <div style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:50px 20px;
                ">

                    ${
                        lang === 'english'
                            ? 'Unable to load products.'
                            : lang === 'arabic'
                                ? 'تعذر تحميل المنتجات.'
                                : 'نەیتوانرا بەرهەمەکان بار بکرێن.'
                    }

                </div>

            `;
        }
    }
}


/* =========================================================
   REALTIME PRODUCTS
========================================================= */

function startProductsRealtime() {

    if (!supabase) return;


    if (realtimeChannel) {

        try {
            supabase.removeChannel(
                realtimeChannel
            );
        } catch {}
    }


    realtimeChannel =
        supabase
            .channel(
                'baran-products-realtime'
            )

            .on(
                'postgres_changes',
                {
                    event:'*',
                    schema:'public',
                    table:'products'
                },
                async payload => {

                    console.log(
                        'BARAN PRODUCTS REALTIME:',
                        payload.eventType
                    );

                    await loadProducts();
                }
            )

            .subscribe(status => {

                console.log(
                    'BARAN REALTIME STATUS:',
                    status
                );

            });
}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts() {

    const grid =
        $('#productGrid');

    if (!grid) return;


    const searchValue =
        ($('#search')?.value || '')
            .trim()
            .toLocaleLowerCase();


    let list =
        products.filter(product => {

            const slug =
                categorySlug(
                    product.category_id
                );


            const matchesFilter =
                filter === 'all' ||
                slug === filter;


            const searchable = [

                product.name_badini,
                product.name_sorani,
                product.name_arabic,
                product.name_english,

                product.description_badini,
                product.description_sorani,
                product.description_arabic,
                product.description_english,

                product.name,
                product.description

            ]
            .filter(Boolean)
            .join(' ')
            .toLocaleLowerCase();


            const matchesSearch =
                !searchValue ||
                searchable.includes(
                    searchValue
                );


            return (
                matchesFilter &&
                matchesSearch
            );
        });


    const sort =
        $('#sort')?.value ||
        'featured';


    if (sort === 'low') {

        list.sort(
            (a,b) =>
                Number(a.price || 0) -
                Number(b.price || 0)
        );
    }


    if (sort === 'high') {

        list.sort(
            (a,b) =>
                Number(b.price || 0) -
                Number(a.price || 0)
        );
    }


    if (sort === 'featured') {

        list.sort(
            (a,b) =>
                Number(Boolean(b.featured)) -
                Number(Boolean(a.featured))
        );
    }


    if (!list.length) {

        grid.innerHTML = `

            <p style="
                grid-column:1/-1;
                text-align:center;
                padding:50px;
            ">

                ${
                    lang === 'english'
                        ? 'No products found.'
                        : lang === 'arabic'
                            ? 'لا توجد منتجات.'
                            : 'هیچ بەرهەمێک نەدۆزرایەوە.'
                }

            </p>

        `;

        return;
    }


    grid.innerHTML =
        list.map(product => {

            const image =
                productImage(product);

            const name =
                productName(product);

            const price =
                Number(product.price || 0);

            const meta =
                productMeta(product);

            const stock =
                Number(product.stock ?? 0);


            return `

                <article
                    class="product-card"
                    data-product-id="${safe(product.id)}"
                >

                    <div class="product-img">

                        ${
                            image
                                ? `

                                    <img
                                        class="product-real-image"
                                        src="${safe(image)}"
                                        alt="${safe(name)}"
                                        loading="lazy"
                                        onerror="
                                            this.style.display='none';
                                            const fallback=this.parentElement.querySelector('.product-image-fallback');
                                            if(fallback) fallback.style.display='flex';
                                        "
                                    >

                                    <div
                                        class="product-image-fallback"
                                        style="display:none;"
                                    >
                                        🕯️
                                    </div>

                                `
                                : `

                                    <div
                                        class="product-image-fallback"
                                    >
                                        🕯️
                                    </div>

                                `
                        }

                    </div>


                    <div class="product-info">

                        <h3>
                            ${safe(name)}
                        </h3>


                        ${
                            meta
                                ? `

                                    <div class="product-meta">
                                        ${safe(meta)}
                                    </div>

                                `
                                : ''
                        }


                        ${
                            product.weight_grams
                                ? `

                                    <div class="product-meta">
                                        ${safe(product.weight_grams)} g
                                    </div>

                                `
                                : ''
                        }


                        <div class="product-bottom">

                            <strong>
                                $${price.toFixed(2)}
                            </strong>


                            ${
                                stock > 0
                                    ? `

                                        <button
                                            class="add"
                                            type="button"
                                            data-add="${safe(product.id)}"
                                            aria-label="Add ${safe(name)}"
                                        >
                                            +
                                        </button>

                                    `
                                    : `

                                        <button
                                            class="add"
                                            type="button"
                                            disabled
                                            style="
                                                opacity:.4;
                                                cursor:not-allowed;
                                            "
                                        >
                                            —
                                        </button>

                                    `
                            }

                        </div>

                    </div>

                </article>

            `;

        }).join('');
}


/* =========================================================
   CART
========================================================= */

function renderCart() {

    const count =
        cart.reduce(
            (total,item) =>
                total +
                Number(item.qty || 0),
            0
        );


    if ($('#cartCount')) {
        $('#cartCount').textContent =
            count;
    }


    const box =
        $('#cartItems');

    if (!box) return;


    if (!cart.length) {

        box.innerHTML = `

            <div class="empty-cart">

                ${
                    lang === 'english'
                        ? 'Your cart is empty.'
                        : lang === 'arabic'
                            ? 'السلة فارغة.'
                            : lang === 'badini'
                                ? 'سەبەتا تە ڤالا یە.'
                                : 'سەبەتەکەت بەتاڵە.'
                }

            </div>

        `;

    } else {

        box.innerHTML =
            cart.map(item => {

                const product =
                    products.find(
                        p =>
                            String(p.id) ===
                            String(item.id)
                    );


                if (!product) return '';


                const name =
                    productName(product);

                const price =
                    Number(product.price || 0);

                const image =
                    productImage(product);


                return `

                    <div class="cart-row">

                        ${
                            image
                                ? `

                                    <img
                                        src="${safe(image)}"
                                        alt="${safe(name)}"
                                        style="
                                            width:58px;
                                            height:58px;
                                            object-fit:cover;
                                            border-radius:8px;
                                        "
                                    >

                                `
                                : ''
                        }


                        <div>

                            <b>
                                ${safe(name)}
                            </b>

                            <small>
                                $${price.toFixed(2)}
                                ×
                                ${Number(item.qty || 0)}
                            </small>

                        </div>


                        <div>

                            <button
                                class="small-cart"
                                data-dec="${safe(product.id)}"
                            >
                                −
                            </button>

                            <button
                                class="small-cart"
                                data-inc="${safe(product.id)}"
                            >
                                +
                            </button>

                        </div>

                    </div>

                `;

            }).join('');
    }


    const total =
        cart.reduce(
            (sum,item) => {

                const product =
                    products.find(
                        p =>
                            String(p.id) ===
                            String(item.id)
                    );

                return sum +
                    (
                        product
                            ? Number(product.price || 0) *
                              Number(item.qty || 0)
                            : 0
                    );
            },
            0
        );


    if ($('#cartTotal')) {

        $('#cartTotal').textContent =
            `$${total.toFixed(2)}`;
    }
}


/* =========================================================
   CART CHANGE
========================================================= */

function cartChange(id,difference) {

    const item =
        cart.find(
            x =>
                String(x.id) ===
                String(id)
        );


    if (!item) return;


    item.qty =
        Number(item.qty || 0) +
        difference;


    if (item.qty < 1) {

        cart =
            cart.filter(
                x =>
                    String(x.id) !==
                    String(id)
            );
    }


    localStorage.setItem(
        'baran-cart',
        JSON.stringify(cart)
    );


    renderCart();
}


/* =========================================================
   CART OPEN / CLOSE
========================================================= */

function openCart() {

    $('#cartDrawer')
        ?.classList.add('open');

    $('#overlay')
        ?.classList.add('show');
}


function closeCart() {

    $('#cartDrawer')
        ?.classList.remove('open');

    $('#overlay')
        ?.classList.remove('show');
}


/* =========================================================
   LANGUAGE
========================================================= */

function setLanguage(value) {

    if (!T[value]) return;

    lang = value;

    localStorage.setItem(
        'baran-language',
        lang
    );


    renderText();

    renderProducts();

    renderCart();
}


/* =========================================================
   EVENTS
========================================================= */

document.addEventListener(
'click',
event => {

    /* ADD PRODUCT */

    const add =
        event.target.closest(
            '[data-add]'
        );


    if (add) {

        const id =
            add.dataset.add;


        const product =
            products.find(
                p =>
                    String(p.id) ===
                    String(id)
            );


        if (!product) return;


        const existing =
            cart.find(
                x =>
                    String(x.id) ===
                    String(id)
            );


        if (existing) {

            existing.qty =
                Number(existing.qty || 0) + 1;

        } else {

            cart.push({
                id:product.id,
                qty:1
            });
        }


        localStorage.setItem(
            'baran-cart',
            JSON.stringify(cart)
        );


        renderCart();

        openCart();

        return;
    }


    /* PLUS */

    const increment =
        event.target.closest(
            '[data-inc]'
        );


    if (increment) {

        cartChange(
            increment.dataset.inc,
            1
        );

        return;
    }


    /* MINUS */

    const decrement =
        event.target.closest(
            '[data-dec]'
        );


    if (decrement) {

        cartChange(
            decrement.dataset.dec,
            -1
        );

        return;
    }


    /* FILTER */

    const filterButton =
        event.target.closest(
            '.filter'
        );


    if (filterButton) {

        filter =
            filterButton.dataset.filter ||
            'all';


        $$('.filter').forEach(button => {

            button.classList.toggle(
                'active',
                button === filterButton
            );
        });


        renderProducts();

        return;
    }


    /* CATEGORY */

    const category =
        event.target.closest(
            '.category[data-filter]'
        );


    if (category) {

        filter =
            category.dataset.filter ||
            'all';


        $$('.filter').forEach(button => {

            button.classList.toggle(
                'active',
                button.dataset.filter === filter
            );
        });


        renderProducts();
    }

});


/* =========================================================
   INIT
========================================================= */

async function init() {

    installBaranFont();


    if ('scrollRestoration' in history) {

        history.scrollRestoration =
            'manual';
    }


    /* LANGUAGE */

    $('#language')
        ?.addEventListener(
            'change',
            event =>
                setLanguage(
                    event.target.value
                )
        );


    /* SEARCH */

    $('#search')
        ?.addEventListener(
            'input',
            renderProducts
        );


    /* SORT */

    $('#sort')
        ?.addEventListener(
            'change',
            renderProducts
        );


    /* CART */

    $('#cartButton')
        ?.addEventListener(
            'click',
            openCart
        );


    $('#closeCart')
        ?.addEventListener(
            'click',
            closeCart
        );


    $('#overlay')
        ?.addEventListener(
            'click',
            closeCart
        );


    /* MOBILE MENU */

    $('#menuBtn')
        ?.addEventListener(
            'click',
            () =>
                $('#mobileNav')
                    ?.classList.toggle('open')
        );


    $('#mobileNav')
        ?.addEventListener(
            'click',
            () =>
                $('#mobileNav')
                    ?.classList.remove('open')
        );


    /* SEARCH BUTTON */

    $('#searchTrigger')
        ?.addEventListener(
            'click',
            () => {

                $('#shop')
                    ?.scrollIntoView({
                        behavior:'smooth'
                    });


                setTimeout(
                    () =>
                        $('#search')?.focus(),
                    400
                );
            }
        );


    /* CHECKOUT */

    $('#checkout')
        ?.addEventListener(
            'click',
            () => {

                if (cart.length) {

                    location.href =
                        'checkout.html';
                }
            }
        );


    /* INITIAL TEXT */

    renderText();

    renderCart();


    /* SUPABASE */

    try {

        await loadSupabase();


        /* LOAD PRODUCTS */

        await loadProducts();


        /* START REALTIME */

        startProductsRealtime();


        console.log(
            '🔥 BARAN SHOP READY — SUPABASE + REALTIME'
        );

    } catch (error) {

        console.error(
            'BARAN INIT ERROR:',
            error
        );
    }
}


/* =========================================================
   START
========================================================= */

if (
    document.readyState ===
    'loading'
) {

    document.addEventListener(
        'DOMContentLoaded',
        init,
        { once:true }
    );

} else {

    init();
}

})();

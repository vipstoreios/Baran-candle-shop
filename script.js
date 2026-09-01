/* =========================================================
   BARAN CANDLE SHOP — SUPABASE STOREFRONT RUNTIME
   Demo products removed.
   Products are loaded only from Supabase.
   ========================================================= */

(() => {
  'use strict';

  /* ---------------------------------------------------------
     SUPABASE
     --------------------------------------------------------- */

  const SUPABASE_URL = 'https://oyaczputirsxfmphnlsh.supabase.co';

  const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95YWN6cHV0aXJzeGZtcGhubHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNTQ0NzUsImV4cCI6MjEwMzgzMDQ3NX0.fiOo-DfZAHC2vhge9W4_IAbIEVDsP3xtSFkHFgHXE0M';

  const SUPABASE_REST = `${SUPABASE_URL}/rest/v1`;

  const supabaseHeaders = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  };

  /* ---------------------------------------------------------
     HELPERS
     --------------------------------------------------------- */

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const safe = (value) =>
    String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[char]));

  const normalize = (value) =>
    String(value ?? '')
      .toLocaleLowerCase()
      .normalize('NFKC');

  const money = (value) => {
    const number = Number(value || 0);

    if (!Number.isFinite(number)) {
      return '0';
    }

    return number.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  /* ---------------------------------------------------------
     LANGUAGE
     --------------------------------------------------------- */

  const T = {
    badini: {
      announcement: 'گەهاندنا خێرا بۆ هەمی ناڤچەیێن کوردستان ✦',
      navHome: 'سەرەکی',
      navShop: 'بەرهەم',
      navRitual: 'ڕێوڕەسم',
      navStory: 'چیرۆکا مە',
      navContact: 'پەیوەندی',

      heroEyebrow: 'ب دەست و خۆشەویستی',
      heroTitle: 'رۆناهییەک بۆ<br><em>هەر ساتەکێ.</em>',
      heroText:
        'مۆمێن دەستکردێن پریمیۆم، بۆنێن ئارام و دیارییێن جوان ژ بو هەستەکێ تایبەت.',
      shopNow: 'نیها بکڕە',

      introLabel: 'جیهانەکێ بچووک بۆ هەستەکێ مەزن',
      introTitle: 'مۆم نە تەنێ.<br><em>رۆناهییا ژیانێ.</em>',
      introText:
        'هەر دانەیەک ب دەست هاتیە دروستکرن، ب بۆنەکێ کو بیرەوەری دروست دکەت و شێوەیەک کو ل مالا تە دژیت.',

      categoriesTitle: 'جیهانا بۆن و جوانیێ',
      catScented: 'مۆمێن بۆنخۆش',
      catScentedSub: 'مۆمێن بۆنخۆش',
      catDecor: 'مۆمێن دیکۆر',
      catDecorSub: 'مۆمێن دیکۆر و ستوونی',
      catGifts: 'دیارییێن تایبەت',
      catGiftsSub: 'کۆمەڵێن دیارییێن دەستکرد',

      ourCollection: 'کۆکراوەیا مە',
      shopTitle: 'بەرهەمێن هەڵبژێردی',
      viewAll: 'هەمی ببینە ↗',

      search: 'ل بەرهەمەکی بگەڕێ...',
      all: 'هەمی',
      scented: 'بۆنخۆش',
      decor: 'دیکۆر',
      gifts: 'دیاری',
      featured: 'هەڵبژێردی',
      low: 'نرخ: کەم بۆ زۆر',
      high: 'نرخ: زۆر بۆ کەم',

      ourStory: 'چیرۆکا باران',
      storyTitle: 'ژ دڵێ هاتیە دروستکرن.<br><em>بۆ مالا تە.</em>',
      storyText:
        'هەر مۆمێکێ Baran ب دەست هاتیە دروستکرن، ب مومێکی باش و بۆنێکی هاوسەنگ. باوەری مە وایە تشتێن بچووک دکارن هەستێن مەزن دروست بکەن.',

      ritualTitle: 'دەمێ مۆم دسوژیت،<br><em>دەم کەمەک راوەستیت.</em>',
      ritualText:
        'مۆمێکێ دابنێ، چرایان کەم بکە و بهێلە بۆنەکە مالا تە پڕ بکەت.',

      step1: 'هەڵبژێرە',
      step2: 'دائگرسێنە',
      step3: 'هەست بکە',

      value1: 'مومێکی پاک',
      value1p: 'Soy Wax و Beeswax ب هەڵبژاردنەکا ورد.',
      value2: 'بۆنەکا تایبەت',
      value2p: 'بۆنێن هاوسەنگ بۆ هەستەکا قووڵتر.',
      value3: 'پەکەجینگا جوان',
      value3p: 'ئامادەیە بۆ تە یان کەسەکێ تە خۆش.',
      value4: 'دروستکریا ناڤخۆ',
      value4p: 'ب دەست دروستکری ل کوردستان.',

      newsletterTitle: 'بەهارا بۆنێن خۆ ل دەست مەدە.',
      newsletterText:
        'ئیمەیڵا خۆ بنڤیسە بۆ کۆمەڵا نوی و ئۆفەرێن تایبەت.',
      email: 'ئیمەیڵا تە',
      join: 'بەشدار بە',

      yourCart: 'سەبەتا تە',
      subtotal: 'کۆی گشتی',
      checkout: 'بۆ پارەدان',

      footer: 'بۆن، رۆناهی، ئارامی',
      readStory: 'چیرۆکا مە بخوینە ↗',
      collectionBadge: 'هەڵبژێردی · ٢٠٢٦',
      lightMoment: 'رۆناهی بۆ ساتێ',

      emptyProducts: 'هیچ بەرهەمەک نەدۆزرایەوە.',
      loadingProducts: 'بەرهەمەکان دێن...',
      cartEmpty: 'سەبەتا تە ڤالا یە.',
      outOfStock: 'بەردەست نییە',
      addToCart: 'زێدەکرنا سەبەتێ',
      stock: 'ژمارە'
    },

    sorani: {
      announcement: 'گەیاندنی خێرا بۆ هەموو ناوچەکانی کوردستان ✦',
      navHome: 'سەرەکی',
      navShop: 'بەرهەمەکان',
      navRitual: 'ڕیتواڵ',
      navStory: 'چیرۆکەکەمان',
      navContact: 'پەیوەندی',

      heroEyebrow: 'بە دەست و خۆشەویستی',
      heroTitle: 'ڕووناکییەک بۆ<br><em>هەموو ساتێک.</em>',
      heroText:
        'مۆمی دەستکردی پریمیۆم، بۆنە هێمنەکان و دیارییە جوانەکان بۆ هەستێکی تایبەت.',
      shopNow: 'ئێستا بکڕە',

      introLabel: 'جیهانێکی بچووک بۆ هەستێکی گەورە',
      introTitle: 'مۆم نییە تەنها.<br><em>ڕووناکییەکی ژیانە.</em>',
      introText:
        'هەر دانەیەک بە دەست دروست دەکرێت، بە بۆنێک کە بیرەوەری دروست دەکات و شێوەیەک کە لە ماڵەکەتدا دەژیت.',

      categoriesTitle: 'جیهانی بۆن و جوانی',
      catScented: 'مۆمی بۆنخۆش',
      catScentedSub: 'مۆمی بۆنخۆش',
      catDecor: 'مۆمی دیکۆر',
      catDecorSub: 'مۆمی دیکۆر و ستوونی',
      catGifts: 'دیارییە تایبەتەکان',
      catGiftsSub: 'کۆمەڵەی دیارییە دەستکردەکان',

      ourCollection: 'کۆمەڵەکەمان',
      shopTitle: 'بەرهەمە هەڵبژێردراوەکان',
      viewAll: 'هەمووی ببینە ↗',

      search: 'بۆ بەرهەمێک بگەڕێ...',
      all: 'هەموو',
      scented: 'بۆنخۆش',
      decor: 'دیکۆر',
      gifts: 'دیاری',
      featured: 'هەڵبژێردراو',
      low: 'نرخ: کەم بۆ زۆر',
      high: 'نرخ: زۆر بۆ کەم',

      ourStory: 'چیرۆکی باران',
      storyTitle: 'لە دڵەوە دروستکراوە.<br><em>بۆ ماڵەوەی تۆ.</em>',
      storyText:
        'هەر مۆمێکی Baran بە دەست دروست دەکرێت، بە مومێکی باش و بۆنی هاوسەنگ. باوەڕمان وایە شتە بچووکەکان دەتوانن هەستی گەورە دروست بکەن.',

      ritualTitle: 'کاتێک مۆم دەسووتێت،<br><em>کات کەمێک وەستێت.</em>',
      ritualText:
        'مۆمێک دابنێ، چرایەکان کەم بکە و با بۆنەکە ماڵەکەت پڕ بکات.',

      step1: 'هەڵیبژێرە',
      step2: 'داگیرسێنە',
      step3: 'هەست بکە',

      value1: 'مومی پاک',
      value1p: 'Soy Wax و Beeswax بە هەڵبژاردنی ورد.',
      value2: 'بۆنی تایبەت',
      value2p: 'بۆنە هاوسەنگەکان بۆ هەستی قووڵتر.',
      value3: 'پەکەجینگی جوان',
      value3p: 'ئامادەیە بۆ خۆت یان کەسێکی خۆشەویست.',
      value4: 'دروستکراوی ناوخۆ',
      value4p: 'بە دەست دروستکراو لە کوردستان.',

      newsletterTitle: 'بەهاری بۆنەکانت لەدەست مەدە.',
      newsletterText:
        'ئیمەیڵەکەت بنووسە بۆ کۆمەڵە نوێکان و ئۆفەرە تایبەتەکان.',
      email: 'ئیمەیڵەکەت',
      join: 'بەشداری بکە',

      yourCart: 'سەبەتەکەت',
      subtotal: 'کۆی گشتی',
      checkout: 'بڕۆ بۆ پارەدان',

      footer: 'بۆن، ڕووناکی، ئارامی',
      readStory: 'چیرۆکەکەمان بخوێنەوە ↗',
      collectionBadge: 'هەڵبژێردراو · ٢٠٢٦',
      lightMoment: 'ڕووناکی بۆ ساتێک',

      emptyProducts: 'هیچ بەرهەمێک نەدۆزرایەوە.',
      loadingProducts: 'بەرهەمەکان دێن...',
      cartEmpty: 'سەبەتەکەت بەتاڵە.',
      outOfStock: 'بەردەست نییە',
      addToCart: 'زیادکردن بۆ سەبەتە',
      stock: 'ژمارە'
    },

    arabic: {
      announcement: 'توصيل سريع إلى جميع أنحاء العراق ✦',
      navHome: 'الرئيسية',
      navShop: 'المنتجات',
      navRitual: 'الطقس',
      navStory: 'قصتنا',
      navContact: 'تواصل معنا',

      heroEyebrow: 'مصنوع بحب وعناية',
      heroTitle: 'نورٌ لكل<br><em>لحظة.</em>',
      heroText:
        'شموع فاخرة مصنوعة يدوياً، بروائح هادئة وهدايا أنيقة تضيف لمسة استثنائية.',
      shopNow: 'تسوق الآن',

      introLabel: 'عالم صغير لشعور كبير',
      introTitle: 'ليست شمعة فقط.<br><em>إنها ضوء للحياة.</em>',
      introText:
        'كل قطعة مصنوعة يدوياً، بعطر يصنع الذكريات وتصميم يعيش مع منزلك.',

      categoriesTitle: 'عالم من العطر والجمال',
      catScented: 'شموع معطرة',
      catScentedSub: 'شموع معطرة',
      catDecor: 'شموع للديكور',
      catDecorSub: 'شموع ديكور وأعمدة',
      catGifts: 'مجموعات هدايا',
      catGiftsSub: 'مجموعات هدايا مصنوعة يدوياً',

      ourCollection: 'مجموعتنا',
      shopTitle: 'منتجات مختارة لك',
      viewAll: 'عرض الكل ↗',

      search: 'ابحث عن منتج...',
      all: 'الكل',
      scented: 'معطرة',
      decor: 'ديكور',
      gifts: 'هدايا',
      featured: 'مميزة',
      low: 'السعر: الأقل أولاً',
      high: 'السعر: الأعلى أولاً',

      ourStory: 'قصة باران',
      storyTitle: 'مصنوعة من القلب.<br><em>لمنزلك.</em>',
      storyText:
        'كل شمعة من Baran مصنوعة يدوياً من شمع مختار بعناية وعطور متوازنة. نؤمن أن التفاصيل الصغيرة تصنع مشاعر كبيرة.',

      ritualTitle: 'عندما تحترق الشمعة،<br><em>يتوقف الوقت قليلاً.</em>',
      ritualText:
        'أشعل شمعة، خفّف الأضواء ودع العطر يملأ منزلك.',

      step1: 'اخترها',
      step2: 'أشعلها',
      step3: 'استشعرها',

      value1: 'شمع نقي',
      value1p: 'شمع الصويا وشمع العسل باختيار دقيق.',
      value2: 'عطر مميز',
      value2p: 'نفحات متوازنة لشعور أعمق.',
      value3: 'تغليف أنيق',
      value3p: 'جاهز لك أو لمن تحب.',
      value4: 'صناعة محلية',
      value4p: 'مصنوع يدوياً في كردستان.',

      newsletterTitle: 'لا تفوّت مواسم العطر.',
      newsletterText:
        'أدخل بريدك لمعرفة التشكيلات الجديدة والعروض الخاصة.',
      email: 'بريدك الإلكتروني',
      join: 'اشترك',

      yourCart: 'سلة التسوق',
      subtotal: 'المجموع',
      checkout: 'إتمام الدفع',

      footer: 'عطر، نور، وهدوء.',
      readStory: 'اقرأ قصتنا ↗',
      collectionBadge: 'مختارات · ٢٠٢٦',
      lightMoment: 'نور لكل لحظة',

      emptyProducts: 'لا توجد منتجات.',
      loadingProducts: 'جاري تحميل المنتجات...',
      cartEmpty: 'السلة فارغة.',
      outOfStock: 'غير متوفر',
      addToCart: 'أضف إلى السلة',
      stock: 'الكمية'
    },

    english: {
      announcement: 'Fast delivery across Iraq & Kurdistan ✦',
      navHome: 'Home',
      navShop: 'Shop',
      navRitual: 'Ritual',
      navStory: 'Our Story',
      navContact: 'Contact',

      heroEyebrow: 'Made by hand, made with love',
      heroTitle: 'A little light for<br><em>every moment.</em>',
      heroText:
        'Premium handmade candles, quiet fragrances and beautiful gifts designed to make everyday moments feel special.',
      shopNow: 'Shop now',

      introLabel: 'A small world for a big feeling',
      introTitle: 'Not just a candle.<br><em>A light for life.</em>',
      introText:
        'Every piece is handcrafted with a fragrance that creates memories and a design that belongs in your home.',

      categoriesTitle: 'A world of scent & beauty',
      catScented: 'Scented Candles',
      catScentedSub: 'Scented Candles',
      catDecor: 'Decorative Candles',
      catDecorSub: 'Decorative & Pillar Candles',
      catGifts: 'Special Gift Sets',
      catGiftsSub: 'Handmade Gift Sets',

      ourCollection: 'Our collection',
      shopTitle: 'The selected pieces',
      viewAll: 'View all ↗',

      search: 'Search products...',
      all: 'All',
      scented: 'Scented',
      decor: 'Decor',
      gifts: 'Gifts',
      featured: 'Featured',
      low: 'Price: low to high',
      high: 'Price: high to low',

      ourStory: 'The Baran story',
      storyTitle: 'Made from the heart.<br><em>For your home.</em>',
      storyText:
        'Every Baran candle is hand-poured with carefully selected wax and balanced fragrance. We believe small details can create big feelings.',

      ritualTitle: 'When a candle burns,<br><em>time slows down.</em>',
      ritualText:
        'Light a candle, dim the lights and let the fragrance fill your home.',

      step1: 'Choose',
      step2: 'Light',
      step3: 'Feel',

      value1: 'Pure wax',
      value1p: 'Soy Wax and Beeswax, carefully selected.',
      value2: 'Signature scent',
      value2p: 'Balanced notes for a deeper feeling.',
      value3: 'Beautiful packaging',
      value3p: 'Ready for you or someone you love.',
      value4: 'Locally made',
      value4p: 'Hand-poured in Kurdistan.',

      newsletterTitle: 'Never miss a season of scent.',
      newsletterText:
        'Join our notes for new collections and private offers.',
      email: 'Your email',
      join: 'Join us',

      yourCart: 'Your cart',
      subtotal: 'Subtotal',
      checkout: 'Checkout',

      footer: 'Scent, light, serenity.',
      readStory: 'Read our story ↗',
      collectionBadge: 'CURATED · 2026',
      lightMoment: 'Light the moment',

      emptyProducts: 'No products found.',
      loadingProducts: 'Loading products...',
      cartEmpty: 'Your cart is empty.',
      outOfStock: 'Out of stock',
      addToCart: 'Add to cart',
      stock: 'Stock'
    }
  };

  let lang = localStorage.getItem('baran-language') || 'badini';

  if (!T[lang]) {
    lang = 'badini';
  }

  let filter = 'all';
  let cart = [];

  try {
    cart = JSON.parse(localStorage.getItem('baran-cart') || '[]');

    if (!Array.isArray(cart)) {
      cart = [];
    }
  } catch {
    cart = [];
  }

  let products = [];
  let categories = [];
  let loading = false;

  const tr = (key) =>
    T[lang]?.[key] ??
    T.english?.[key] ??
    key;

  /* ---------------------------------------------------------
     SUPABASE REQUEST
     --------------------------------------------------------- */

  async function supabaseGet(table, params = '') {
    const response = await fetch(
      `${SUPABASE_REST}/${table}${params}`,
      {
        method: 'GET',
        headers: supabaseHeaders,
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      const text = await response.text();

      throw new Error(
        `${table}: ${response.status} ${text}`
      );
    }

    return response.json();
  }

  /* ---------------------------------------------------------
     LOAD CATEGORIES
     --------------------------------------------------------- */

  async function loadCategories() {
    try {
      categories = await supabaseGet(
        'categories',
        '?select=id,slug,name_badini,name_sorani,name_arabic,name_english,active&active=eq.true&order=sort_order.asc'
      );

      if (!Array.isArray(categories)) {
        categories = [];
      }
    } catch (error) {
      console.warn(
        '[BARAN] categories could not be loaded:',
        error
      );

      categories = [];
    }
  }

  /* ---------------------------------------------------------
     LOAD PRODUCTS FROM SUPABASE
     --------------------------------------------------------- */

  async function loadProducts() {
    if (loading) {
      return;
    }

    loading = true;

    const grid = $('#productGrid');

    if (grid) {
      grid.innerHTML =
        `<p class="products-loading">${safe(tr('loadingProducts'))}</p>`;
    }

    try {
      /*
       * IMPORTANT:
       * No hard-coded products exist here.
       *
       * Everything comes from:
       * public.products
       */

      const rows = await supabaseGet(
        'products',
        '?select=id,category_id,scent_id,slug,name_badini,name_sorani,name_arabic,name_english,description_badini,description_sorani,description_arabic,description_english,wax_type,burn_time_minutes,weight_grams,price,compare_at_price,stock,featured,bestseller,new_arrival,active,image_url,images,created_at,updated_at&active=eq.true&order=featured.desc,bestseller.desc,new_arrival.desc,created_at.desc'
      );

      products = Array.isArray(rows)
        ? rows.map(normalizeProduct)
        : [];

      /*
       * Clean old cart items that no longer exist
       * in the database or are inactive.
       */

      cart = cart.filter((item) =>
        products.some((product) => product.id === item.id)
      );

      saveCart();

      renderProducts();
      renderCart();

      console.info(
        `[BARAN] ${products.length} active product(s) loaded from Supabase.`
      );

    } catch (error) {

      console.error(
        '[BARAN] Supabase products error:',
        error
      );

      /*
       * VERY IMPORTANT:
       * Never restore demo products here.
       *
       * If Supabase fails, show an empty state.
       */

      products = [];

      if (grid) {
        grid.innerHTML = `
          <div class="products-error">
            <p>${safe(tr('emptyProducts'))}</p>
          </div>
        `;
      }

    } finally {
      loading = false;
    }
  }

  /* ---------------------------------------------------------
     NORMALIZE SUPABASE PRODUCT
     --------------------------------------------------------- */

  function normalizeProduct(row) {
    const images = Array.isArray(row.images)
      ? row.images.filter(Boolean)
      : [];

    if (
      row.image_url &&
      !images.includes(row.image_url)
    ) {
      images.unshift(row.image_url);
    }

    return {
      id: row.id,

      categoryId: row.category_id || null,

      slug: row.slug || '',

      name: {
        badini: row.name_badini || '',
        sorani: row.name_sorani || '',
        arabic: row.name_arabic || '',
        english: row.name_english || ''
      },

      description: {
        badini: row.description_badini || '',
        sorani: row.description_sorani || '',
        arabic: row.description_arabic || '',
        english: row.description_english || ''
      },

      wax: row.wax_type || '',

      burnMinutes:
        Number.isFinite(Number(row.burn_time_minutes))
          ? Number(row.burn_time_minutes)
          : null,

      weight:
        Number.isFinite(Number(row.weight_grams))
          ? Number(row.weight_grams)
          : null,

      price:
        Number.isFinite(Number(row.price))
          ? Number(row.price)
          : 0,

      compareAtPrice:
        Number.isFinite(Number(row.compare_at_price))
          ? Number(row.compare_at_price)
          : null,

      stock:
        Number.isFinite(Number(row.stock))
          ? Number(row.stock)
          : 0,

      featured: Boolean(row.featured),
      bestseller: Boolean(row.bestseller),
      newArrival: Boolean(row.new_arrival),

      active: Boolean(row.active),

      imageUrl: row.image_url || '',
      images,

      createdAt: row.created_at || null,
      updatedAt: row.updated_at || null
    };
  }

  /* ---------------------------------------------------------
     CATEGORY
     --------------------------------------------------------- */

  function categoryForProduct(product) {
    if (!product.categoryId) {
      return null;
    }

    return categories.find(
      (category) =>
        category.id === product.categoryId
    ) || null;
  }

  function categorySlug(product) {
    const category = categoryForProduct(product);

    if (!category) {
      return 'all';
    }

    const slug = normalize(category.slug);

    if (
      slug.includes('scent') ||
      slug.includes('bôn') ||
      slug.includes('bon') ||
      slug.includes('معطر')
    ) {
      return 'scented';
    }

    if (
      slug.includes('decor') ||
      slug.includes('pillar') ||
      slug.includes('دیکور') ||
      slug.includes('ديكور')
    ) {
      return 'decor';
    }

    if (
      slug.includes('gift') ||
      slug.includes('دیاری') ||
      slug.includes('هدا')
    ) {
      return 'gifts';
    }

    return slug || 'all';
  }

  /* ---------------------------------------------------------
     NAME
     --------------------------------------------------------- */

  function productName(product) {
    return (
      product.name?.[lang] ||
      product.name?.english ||
      product.name?.badini ||
      product.name?.sorani ||
      product.name?.arabic ||
      product.slug ||
      ''
    );
  }

  /* ---------------------------------------------------------
     DESCRIPTION
     --------------------------------------------------------- */

  function productDescription(product) {
    return (
      product.description?.[lang] ||
      product.description?.english ||
      product.description?.badini ||
      product.description?.sorani ||
      product.description?.arabic ||
      ''
    );
  }

  /* ---------------------------------------------------------
     WAX TRANSLATION
     --------------------------------------------------------- */

  function waxText(value) {
    const key = normalize(value);

    if (
      key.includes('soy') ||
      key.includes('سویا')
    ) {
      return {
        badini: 'مومی سویا',
        sorani: 'مومی سویا',
        arabic: 'شمع الصويا',
        english: 'Soy Wax'
      }[lang];
    }

    if (
      key.includes('bee') ||
      key.includes('beeswax') ||
      key.includes('زەڕەنگ') ||
      key.includes('العسل')
    ) {
      return {
        badini: 'مومی زەڕەنگ',
        sorani: 'مومی زەڕەنگ',
        arabic: 'شمع العسل',
        english: 'Beeswax'
      }[lang];
    }

    return value || '';
  }

  /* ---------------------------------------------------------
     BURN TIME
     --------------------------------------------------------- */

  function burnText(product) {
    if (!product.burnMinutes) {
      return '';
    }

    const hours = Math.round(
      product.burnMinutes / 60
    );

    if (lang === 'english') {
      return `${hours}h`;
    }

    if (lang === 'arabic') {
      return `${hours} ساعة`;
    }

    return `${hours}h`;
  }

  /* ---------------------------------------------------------
     META
     --------------------------------------------------------- */

  function meta(product) {
    const parts = [];

    const wax = waxText(product.wax);

    if (wax) {
      parts.push(wax);
    }

    const burn = burnText(product);

    if (burn) {
      parts.push(burn);
    }

    const description = productDescription(product);

    if (description) {
      parts.push(description);
    }

    return parts.join(' · ');
  }

  /* ---------------------------------------------------------
     PRODUCT IMAGE
     --------------------------------------------------------- */

  function productImage(product) {
    if (product.imageUrl) {
      return product.imageUrl;
    }

    if (product.images?.length) {
      return product.images[0];
    }

    return '';
  }

  /* ---------------------------------------------------------
     FILTER PRODUCTS
     --------------------------------------------------------- */

  function getVisibleProducts() {
    const searchValue =
      ($('#search')?.value || '').trim();

    const query = normalize(searchValue);

    let list = [...products];

    if (filter !== 'all') {
      list = list.filter(
        (product) =>
          categorySlug(product) === filter
      );
    }

    if (query) {
      list = list.filter((product) => {

        const values = [
          product.name?.badini,
          product.name?.sorani,
          product.name?.arabic,
          product.name?.english,

          product.description?.badini,
          product.description?.sorani,
          product.description?.arabic,
          product.description?.english,

          product.slug,
          product.wax
        ];

        return values.some(
          (value) =>
            normalize(value).includes(query)
        );
      });
    }

    const sort = $('#sort')?.value;

    if (sort === 'low') {
      list.sort(
        (a, b) =>
          Number(a.price) - Number(b.price)
      );
    }

    if (sort === 'high') {
      list.sort(
        (a, b) =>
          Number(b.price) - Number(a.price)
      );
    }

    if (sort === 'featured') {
      list.sort((a, b) => {

        const scoreA =
          (a.featured ? 4 : 0) +
          (a.bestseller ? 2 : 0) +
          (a.newArrival ? 1 : 0);

        const scoreB =
          (b.featured ? 4 : 0) +
          (b.bestseller ? 2 : 0) +
          (b.newArrival ? 1 : 0);

        return scoreB - scoreA;
      });
    }

    return list;
  }

  /* ---------------------------------------------------------
     RENDER PRODUCTS
     --------------------------------------------------------- */

  function renderProducts() {

    const grid = $('#productGrid');

    if (!grid) {
      return;
    }

    const list = getVisibleProducts();

    if (!list.length) {
      grid.innerHTML = `
        <div class="products-empty">
          <p>${safe(tr('emptyProducts'))}</p>
        </div>
      `;

      return;
    }

    grid.innerHTML = list.map((product) => {

      const image = productImage(product);

      const stock =
        Number(product.stock || 0);

      const unavailable =
        stock <= 0;

      const imageHTML = image
        ? `
          <img
            src="${safe(image)}"
            alt="${safe(productName(product))}"
            loading="lazy"
            onerror="this.style.display='none';this.parentElement.classList.add('image-error')"
          >
        `
        : `
          <div class="mini-candle"></div>
        `;

      return `
        <article
          class="product-card"
          data-product-id="${safe(product.id)}"
        >

          <div class="product-img">
            ${imageHTML}

            ${
              product.bestseller
                ? `<span class="product-badge">BESTSELLER</span>`
                : ''
            }

            ${
              product.newArrival
                ? `<span class="product-badge">NEW</span>`
                : ''
            }
          </div>

          <div class="product-info">

            <h3>
              ${safe(productName(product))}
            </h3>

            ${
              meta(product)
                ? `
                  <div class="product-meta">
                    ${safe(meta(product))}
                  </div>
                `
                : ''
            }

            ${
              productDescription(product)
                ? `
                  <p class="product-description">
                    ${safe(productDescription(product))}
                  </p>
                `
                : ''
            }

            <div class="product-bottom">

              <strong>
                ${money(product.price)}
              </strong>

              <button
                class="add"
                data-add="${safe(product.id)}"
                ${unavailable ? 'disabled' : ''}
                aria-label="${safe(tr('addToCart'))}"
                title="${safe(
                  unavailable
                    ? tr('outOfStock')
                    : tr('addToCart')
                )}"
              >
                ${unavailable ? '×' : '+'}
              </button>

            </div>

          </div>

        </article>
      `;

    }).join('');
  }

  /* ---------------------------------------------------------
     CART
     --------------------------------------------------------- */

  function saveCart() {
    localStorage.setItem(
      'baran-cart',
      JSON.stringify(cart)
    );
  }

  function cartCount() {
    return cart.reduce(
      (total, item) =>
        total + Number(item.qty || 0),
      0
    );
  }

  function cartTotal() {
    return cart.reduce(
      (total, item) => {

        const product =
          products.find(
            (product) =>
              product.id === item.id
          );

        if (!product) {
          return total;
        }

        return (
          total +
          Number(product.price || 0) *
          Number(item.qty || 0)
        );

      },
      0
    );
  }

  function renderCart() {

    const count = $('#cartCount');

    if (count) {
      count.textContent = cartCount();
    }

    const box = $('#cartItems');

    if (!box) {
      return;
    }

    if (!cart.length) {

      box.innerHTML = `
        <div class="empty-cart">
          ${safe(tr('cartEmpty'))}
        </div>
      `;

    } else {

      box.innerHTML = cart
        .map((item) => {

          const product =
            products.find(
              (p) => p.id === item.id
            );

          if (!product) {
            return '';
          }

          const maxStock =
            Number(product.stock || 0);

          return `
            <div class="cart-row">

              <div>

                <b>
                  ${safe(productName(product))}
                </b>

                <small>
                  ${money(product.price)}
                  ×
                  ${Number(item.qty || 0)}
                </small>

              </div>

              <div>

                <button
                  class="small-cart"
                  data-dec="${safe(product.id)}"
                  type="button"
                >
                  −
                </button>

                <button
                  class="small-cart"
                  data-inc="${safe(product.id)}"
                  type="button"
                  ${
                    Number(item.qty) >= maxStock
                      ? 'disabled'
                      : ''
                  }
                >
                  +
                </button>

              </div>

            </div>
          `;

        })
        .join('');
    }

    const total = $('#cartTotal');

    if (total) {
      total.textContent =
        money(cartTotal());
    }
  }

  /* ---------------------------------------------------------
     CART CHANGE
     --------------------------------------------------------- */

  function addToCart(id) {

    const product =
      products.find(
        (item) => item.id === id
      );

    if (!product) {
      return;
    }

    const stock =
      Number(product.stock || 0);

    if (stock <= 0) {
      return;
    }

    const existing =
      cart.find(
        (item) => item.id === id
      );

    if (existing) {

      if (existing.qty >= stock) {
        return;
      }

      existing.qty += 1;

    } else {

      cart.push({
        id,
        qty: 1
      });

    }

    saveCart();
    renderCart();
    openCart();
  }

  function cartChange(id, difference) {

    const item =
      cart.find(
        (entry) => entry.id === id
      );

    if (!item) {
      return;
    }

    const product =
      products.find(
        (entry) => entry.id === id
      );

    if (!product) {
      return;
    }

    item.qty += difference;

    if (item.qty <= 0) {

      cart =
        cart.filter(
          (entry) => entry.id !== id
        );

    } else {

      const stock =
        Number(product.stock || 0);

      if (item.qty > stock) {
        item.qty = stock;
      }

    }

    saveCart();
    renderCart();
  }

  /* ---------------------------------------------------------
     CART OPEN/CLOSE
     --------------------------------------------------------- */

  function openCart() {

    $('#cartDrawer')?.classList.add('open');
    $('#overlay')?.classList.add('show');

  }

  function closeCart() {

    $('#cartDrawer')?.classList.remove('open');
    $('#overlay')?.classList.remove('show');

  }

  /* ---------------------------------------------------------
     LANGUAGE RENDER
     --------------------------------------------------------- */

  function renderText() {

    $$('[data-i18n]').forEach((element) => {

      const key =
        element.dataset.i18n;

      if (
        T[lang] &&
        T[lang][key] !== undefined
      ) {
        element.innerHTML =
          T[lang][key];
      }

    });

    $$('[data-i18n-placeholder]').forEach(
      (element) => {

        const key =
          element.dataset.i18nPlaceholder;

        if (
          T[lang] &&
          T[lang][key] !== undefined
        ) {
          element.placeholder =
            T[lang][key];
        }

      }
    );

    $$('[data-i18n-title]').forEach(
      (element) => {

        const key =
          element.dataset.i18nTitle;

        if (
          T[lang] &&
          T[lang][key] !== undefined
        ) {
          element.title =
            T[lang][key];
        }

      }
    );

    /*
     * Existing hard-coded pieces
     * inside index.html.
     */

    const hardcoded = {

      '.hero-proof span:nth-child(1)': {
        badini: '١٠٠٪ دەستکرد',
        sorani: '١٠٠٪ دەستکرد',
        arabic: '١٠٠٪ مصنوع يدوياً',
        english: '100% Handmade'
      },

      '.hero-proof span:nth-child(2)': {
        badini: 'مومی سویا و مومی زەڕەنگ',
        sorani: 'مومی سویا و مومی زەڕەنگ',
        arabic: 'شمع الصويا وشمع العسل',
        english: 'Soy & Beeswax'
      },

      '.hero-proof span:nth-child(3)': {
        badini: 'بۆنی پریمیۆم',
        sorani: 'بۆنی پریمیۆم',
        arabic: 'عطر فاخر',
        english: 'Premium Fragrance'
      },

      '.visual-note': {
        badini: 'رۆناهی<br>بۆ ساتێ',
        sorani: 'ڕووناکی<br>بۆ ساتێک',
        arabic: 'نور<br>لكل لحظة',
        english: 'LIGHT<br>THE MOMENT'
      },

      '.collection-badge': {
        badini: 'هەڵبژێردی · ٢٠٢٦',
        sorani: 'هەڵبژێردراو · ٢٠٢٦',
        arabic: 'مختارات · ٢٠٢٦',
        english: 'CURATED · 2026'
      },

      '.story-candle small': {
        badini: 'دروستکراو<br>ب دەست',
        sorani: 'دەست<br>دروستکراو',
        arabic: 'مصنوع<br>يدوياً',
        english: 'HAND<br>POURED'
      },

      '.footer-links a:nth-child(1)': {
        badini: 'بەرهەم',
        sorani: 'بەرهەمەکان',
        arabic: 'المنتجات',
        english: 'Shop'
      },

      '.footer-links a:nth-child(3)': {
        badini: 'پەیوەندی',
        sorani: 'پەیوەندی',
        arabic: 'تواصل',
        english: 'Contact'
      }
    };

    Object.entries(hardcoded)
      .forEach(([selector, translations]) => {

        const element =
          $(selector);

        if (!element) {
          return;
        }

        const value =
          translations[lang];

        if (value !== undefined) {
          element.innerHTML = value;
        }

      });

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

  /* ---------------------------------------------------------
     SET LANGUAGE
     --------------------------------------------------------- */

  function setLanguage(value) {

    if (!T[value]) {
      return;
    }

    lang = value;

    localStorage.setItem(
      'baran-language',
      lang
    );

    renderText();
    renderProducts();
    renderCart();

  }

  /* ---------------------------------------------------------
     CATEGORY FILTER
     --------------------------------------------------------- */

  function setFilter(value) {

    filter =
      value || 'all';

    $$('.filter').forEach(
      (button) => {

        button.classList.toggle(
          'active',
          button.dataset.filter === filter
        );

      }
    );

    renderProducts();

  }

  /* ---------------------------------------------------------
     CLICK EVENTS
     --------------------------------------------------------- */

  document.addEventListener(
    'click',
    (event) => {

      /* ADD */

      const addButton =
        event.target.closest(
          '[data-add]'
        );

      if (addButton) {

        if (
          addButton.disabled
        ) {
          return;
        }

        addToCart(
          addButton.dataset.add
        );

        return;
      }

      /* INCREASE */

      const increase =
        event.target.closest(
          '[data-inc]'
        );

      if (increase) {

        cartChange(
          increase.dataset.inc,
          1
        );

        return;
      }

      /* DECREASE */

      const decrease =
        event.target.closest(
          '[data-dec]'
        );

      if (decrease) {

        cartChange(
          decrease.dataset.dec,
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

        setFilter(
          filterButton.dataset.filter
        );

        return;
      }

      /* CATEGORY CARD */

      const category =
        event.target.closest(
          '.category[data-filter]'
        );

      if (category) {

        setFilter(
          category.dataset.filter
        );

        return;
      }

    }
  );

  /* ---------------------------------------------------------
     REFRESH / SCROLL FIX
     --------------------------------------------------------- */

  function preventRefreshJump() {

    /*
     * Do NOT force scroll position repeatedly.
     * The old code used replaceState + several
     * delayed scrollTo calls, which can fight with
     * browser restoration and hash navigation.
     */

    if (
      'scrollRestoration' in history
    ) {
      history.scrollRestoration =
        'manual';
    }

    const isReload =
      performance
        .getEntriesByType?.('navigation')
        ?.some(
          (entry) =>
            entry.type === 'reload'
        );

    if (isReload) {

      requestAnimationFrame(() => {

        if (
          !location.hash
        ) {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto'
          });
        }

      });

    }

  }

  /* ---------------------------------------------------------
     MOBILE MENU
     --------------------------------------------------------- */

  function setupUI() {

    $('#language')
      ?.addEventListener(
        'change',
        (event) =>
          setLanguage(
            event.target.value
          )
      );

    $('#search')
      ?.addEventListener(
        'input',
        renderProducts
      );

    $('#sort')
      ?.addEventListener(
        'change',
        renderProducts
      );

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

    $('#searchTrigger')
      ?.addEventListener(
        'click',
        () => {

          const shop =
            document.querySelector(
              '#shop'
            );

          if (shop) {

            shop.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

          }

          setTimeout(
            () =>
              $('#search')?.focus(),
            400
          );

        }
      );

    $('#checkout')
      ?.addEventListener(
        'click',
        () => {

          if (!cart.length) {
            return;
          }

          location.href =
            'checkout.html';

        }
      );

    $('#newsletter')
      ?.addEventListener(
        'submit',
        (event) => {

          event.preventDefault();

          const input =
            $('#newsletter input[type="email"]');

          if (!input?.value) {
            return;
          }

          /*
           * Keep existing UI behaviour.
           * No fake database write.
           */

          input.value = '';

        }
      );

  }

  /* ---------------------------------------------------------
     INITIALIZE
     --------------------------------------------------------- */

  async function init() {

    preventRefreshJump();

    setupUI();

    renderText();

    /*
     * Categories are optional.
     * Products are not.
     */

    await loadCategories();

    await loadProducts();

    renderCart();

  }

  /* ---------------------------------------------------------
     START
     --------------------------------------------------------- */

  if (
    document.readyState === 'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      init,
      { once: true }
    );

  } else {

    init();

  }

})();

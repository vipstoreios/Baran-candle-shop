# Baran Candle Shop — No Demo Data Policy

This project must never display fabricated/sample/demo business data in the production UI.

- Products come from `public.products`.
- Categories come from `public.categories`.
- Scents come from `public.scents`.
- Orders come from `public.orders`.
- Customers come from `public.customers`.
- Live visitor counts come from the live visitor system.
- Empty datasets display an empty state or zero, never fake records or fake statistics.
- Placeholder/demo products, orders, customers, counts, names, prices, and URLs must not be hard-coded into production pages.

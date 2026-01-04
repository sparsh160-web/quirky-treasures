# Quirky Treasures – Whacky Finds Website

Welcome to **Quirky Treasures**, a simple static website that showcases fun, quirky products you don’t really need but might buy anyway. The project is designed to be easy to maintain – all product data lives in a Google Sheet that you control. The site fetches the sheet as a CSV at runtime and renders it on the client. No backend, no databases and no paid tools required.

## Brand & name

The original brief suggested **Wacky Finds** but asked for alternatives. Three possible names were considered:

| Candidate name       | Rationale                             |
|---------------------|---------------------------------------|
| **Wacky Finds**      | The obvious choice; says what it is.  |
| **Quirky Treasures**  | Feels like a trove of oddities. Selected for this site. |
| **Oddball Bazaar**    | Fun alliteration, suggests a market of curiosities. |

We chose **Quirky Treasures** for its playful tone while still hinting at a curated collection.

## Project structure

```
wacky-finds-site/
  index.html              – Home page listing all products with search/filters
  product.html            – Product detail page loaded via `?slug=…`
  category.html           – Optional page to browse a specific category
  privacy.html            – Privacy policy
  terms.html              – Terms and conditions
  disclosure.html         – Affiliate disclosure
  contact.html            – Contact & submission form
  sitemap.xml             – Basic sitemap (update URLs after deployment)
  robots.txt              – Robots file pointing to the sitemap
  assets/
    styles.css            – All site styling (responsive & dark‑mode ready)
    csv.js                – Lightweight CSV parser
    config.js             – Single place to paste your Google Sheet CSV URL
    app.js                – Core logic for fetching, filtering and rendering
    logo.svg              – Simple SVG logo (replace if desired)
  README.md               – This documentation
```

The site has no build step. Opening `index.html` locally will load a fallback dataset. Once you supply a real Google Sheet CSV URL, the catalogue will update automatically.

## 1 Set up your Google Sheet (catalogue)

1. **Create the sheet.** Sign in to Google Sheets and create a new spreadsheet. Name it **`WackyFinds_Catalog`** (the name doesn’t matter but helps keep things tidy).
2. **Rename the first tab** to **`products`**.
3. **Add the column headers** in row 1 exactly as listed below. Order matters:

   ```
   id, slug, title, description, price_inr, category, platform, image_url, affiliate_url, added_date, tags, featured, popularity
   ```

   - **id**: unique integer
   - **slug**: URL‑safe string, must be unique (e.g. `screaming-chicken-keychain`)
   - **title**: short product name
   - **description**: witty one‑line description
   - **price_inr**: price in INR as an integer (no commas)
   - **category**: one of `Home`, `Desk`, `Gadgets`, `Food & Drink`, `Party`, `Fashion`, `Gifts`, `Travel`, `Pets`
   - **platform**: one of `Amazon`, `Flipkart`, `Other`
   - **image_url**: HTTPS URL to a product image
   - **affiliate_url**: outbound affiliate link. It should include `target="_blank"` and `rel="nofollow sponsored noopener"` attributes when rendered【538039999483484†L415-L426】【538039999483484†L490-L496】. Our code already adds these attributes.
   - **added_date**: date when you added the product (`YYYY‑MM‑DD`)
   - **tags**: comma‑separated list for filtering/search (e.g. `quirky,gift,under-999`)
   - **featured**: `TRUE` or `FALSE`
   - **popularity**: optional integer used for sorting by popularity

4. **Paste sample rows**. To get started quickly, copy the 20 rows below (excluding the header) and paste them into row 2 onward in your sheet. Feel free to edit or delete them later.

   ```csv
   1,screaming-chicken-keychain,Screaming Chicken Keychain,A mini keychain that screams when squeezed.,299,Gadgets,Amazon,https://placehold.co/600x400?text=Chicken+Keychain,https://example.com/product/1,2025-12-01,quirky,gift,under-499,TRUE,95
   2,levitating-plant-pot,Levitating Plant Pot,Make your plant float in mid-air using magnets.,2499,Home,Amazon,https://placehold.co/600x400?text=Levitating+Pot,https://example.com/product/2,2025-11-15,home,decor,unique,FALSE,80
   3,led-message-fan,LED Message Fan,Spins to display your custom message in lights.,699,Desk,Flipkart,https://placehold.co/600x400?text=LED+Fan,https://example.com/product/3,2025-12-20,desk,gadget,light,FALSE,60
   4,portable-smores-maker,Portable S'mores Maker,Enjoy gooey s'mores anytime, anywhere.,1299,Food & Drink,Amazon,https://placehold.co/600x400?text=Smores+Maker,https://example.com/product/4,2025-10-05,food,party,camping,TRUE,70
   5,rainbow-unicorn-slippers,Rainbow Unicorn Slippers,Keep your feet cosy with light‑up unicorn slippers.,899,Fashion,Flipkart,https://placehold.co/600x400?text=Unicorn+Slippers,https://example.com/product/5,2025-11-01,fashion,cozy,gift,FALSE,50
   6,inflatable-cup-holder,Inflatable Cup Holder,Let your drink float beside you in the pool.,199,Party,Other,https://placehold.co/600x400?text=Cup+Holder,https://example.com/product/6,2025-09-25,party,pool,summer,FALSE,40
   7,retro-handheld-game-console,Retro Handheld Game Console,Pocket‑sized console with 400 classic games.,1599,Gadgets,Amazon,https://placehold.co/600x400?text=Retro+Console,https://example.com/product/7,2025-12-10,gadget,gaming,nostalgia,TRUE,85
   8,dog-shark-life-jacket,Dog Shark Life Jacket,Give your pet a cute shark fin for safety & style.,1299,Pets,Flipkart,https://placehold.co/600x400?text=Dog+Life+Jacket,https://example.com/product/8,2025-07-30,pets,travel,funny,FALSE,30
   9,travel-utensil-kit,Travel Utensil Kit,Reusable cutlery set with case for zero‑waste travel.,499,Travel,Other,https://placehold.co/600x400?text=Travel+Utensils,https://example.com/product/9,2025-08-15,travel,eco,under-499,FALSE,55
   10,glow-in-dark-pillow,Glow-in-the-Dark Pillow,A soft pillow that glows softly at night.,1099,Home,Amazon,https://placehold.co/600x400?text=Glow+Pillow,https://example.com/product/10,2025-11-25,home,decor,glow,TRUE,65
   11,screaming-goat-toy,Screaming Goat Toy,A tiny screaming goat figure for instant laughs.,799,Gifts,Amazon,https://placehold.co/600x400?text=Goat+Toy,https://example.com/product/11,2025-09-12,gifts,funny,desk,FALSE,45
   12,mini-desktop-vacuum,Mini Desktop Vacuum,Clean crumbs off your desk with this adorable vacuum.,599,Desk,Flipkart,https://placehold.co/600x400?text=Desktop+Vacuum,https://example.com/product/12,2025-10-18,desk,gadget,under-999,FALSE,50
   13,usb-coffee-warmer,USB Coffee Warmer,Keep your coffee warm while you work.,499,Gadgets,Other,https://placehold.co/600x400?text=Coffee+Warmer,https://example.com/product/13,2025-11-05,gadgets,coffee,under-499,TRUE,40
   14,banana-phone,Banana Phone,A Bluetooth handset shaped like a banana.,1599,Party,Amazon,https://placehold.co/600x400?text=Banana+Phone,https://example.com/product/14,2025-08-22,party,gifts,funny,FALSE,75
   15,pizza-blanket,Pizza Blanket,A giant round blanket that looks like a pepperoni pizza.,1899,Home,Flipkart,https://placehold.co/600x400?text=Pizza+Blanket,https://example.com/product/15,2025-09-01,home,decor,food,TRUE,90
   16,cat-toast-bed,Cat Toast Bed,Make your cat sleep in a slice of bread!,1299,Pets,Amazon,https://placehold.co/600x400?text=Cat+Toast+Bed,https://example.com/product/16,2025-11-20,pets,home,funny,FALSE,35
   17,edible-candy-notes,Edible Candy Notes,Write sweet messages on edible paper.,349,Food & Drink,Other,https://placehold.co/600x400?text=Candy+Notes,https://example.com/product/17,2025-07-05,food,gifts,under-499,TRUE,60
   18,portable-bubble-machine,Portable Bubble Machine,Create a stream of bubbles wherever you go.,999,Party,Amazon,https://placehold.co/600x400?text=Bubble+Machine,https://example.com/product/18,2025-09-28,party,outdoor,family,FALSE,55
   19,lego-mug,LEGO Mug,Build on your mug while you sip your coffee.,899,Desk,Flipkart,https://placehold.co/600x400?text=LEGO+Mug,https://example.com/product/19,2025-10-12,desk,fun,cozy,FALSE,80
   20,roll-up-solar-charger,Roll‑up Solar Charger,Portable solar panel that rolls up like a mat.,2499,Travel,Other,https://placehold.co/600x400?text=Solar+Charger,https://example.com/product/20,2025-12-03,travel,gadgets,eco,FALSE,70
   ```

5. **Publish the sheet as a CSV.** In your Google Sheet, click **File → Share → Publish to the web**. Choose the *products* sheet and the **CSV** format. Click **Publish**, confirm, then copy the generated link. According to the guide on publishing Google Sheets to the web, this makes the sheet accessible via a CSV link【630364990071103†L88-L107】.
6. **Enable automatic updates.** When publishing, make sure “Automatically republish when changes are made” is ticked so that your site always reflects the latest data.

## 2 Configure the site

1. Open the file `wacky-finds-site/assets/config.js`.
2. Replace the placeholder in `SHEET_CSV_URL` with the CSV link you copied from Google Sheets. It should look something like:

   ```js
   const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/…/pub?output=csv";
   ```

3. Save the file. Now, when you load `index.html`, the site will fetch your sheet and display the products. If the fetch fails (for example, because the sheet isn’t yet published), a warning banner will appear and the built‑in fallback data will be used instead.

## 3 Deploying your site

This project is fully static – no build process is required. You can host it anywhere that serves static files. Here are three free options:

### GitHub Pages

1. Create a new repository on GitHub (e.g., `quirky-treasures`).
2. Copy the contents of the `wacky-finds-site` folder into the repository.
3. Commit and push the files.
4. In the repository settings, scroll to **Pages**, select **main** branch and `/` (root) for the folder, then save. GitHub will build and host your site at `https://<username>.github.io/<repository>/`.
5. Update `sitemap.xml` and `robots.txt` to replace `example.com` with your actual domain.

### Netlify

1. Sign up at [Netlify](https://www.netlify.com/) and click **Add new site → Import an existing project**.
2. Connect your GitHub repository and select the site. Leave the build command blank and set the publish directory to `/` (because this site is pre‑built).
3. Deploy. Netlify will give you a `*.netlify.app` domain which you can customise.

Alternatively, you can drag & drop the `wacky-finds-site` folder into Netlify’s drop‑deploy area.

### Cloudflare Pages

1. Sign in to [Cloudflare](https://pages.cloudflare.com/) and create a new Pages project.
2. Connect your Git repository. Under **Build settings**, leave **Build command** blank and set **Build output directory** to `/`.
3. Deploy the project. Cloudflare will host your site on a `*.pages.dev` domain.

## 4 Customising affiliate links

Our templates automatically add `target="_blank"` and `rel="nofollow sponsored noopener"` to all outbound affiliate links. Google recommends marking paid links with `rel="sponsored"` (and `nofollow` is still acceptable) and notes that multiple rel values can be combined【538039999483484†L415-L426】【538039999483484†L490-L496】. We also include `noopener` to protect against reverse tabnabbing – a security issue where an external page could control the source page if the link is opened in a new tab【852894883431948†L123-L150】.

To ensure your affiliate platforms properly track sales, append your affiliate IDs or UTM parameters to the `affiliate_url` column in the sheet. For example:

```
https://www.amazon.in/dp/B09XYZ?tag=yourtag-21&utm_source=quirkytreasures
```

## 5 Analytics (optional)

If you want to add Google Analytics 4 (GA4) or another analytics platform, insert the provided script into the `<head>` of `index.html` and other pages. Keep it commented out by default. When you are ready to use analytics, replace the `G-XXXXXXXXXX` ID and uncomment the script.

```html
<!-- Google Analytics 4 (optional) -->
<!--
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
-->
```

## 6 Troubleshooting

- **The site shows the warning banner and fallback data.** Ensure that you have published the sheet as CSV. In Google Sheets, go to **File → Share → Publish to the web**, choose the **products** sheet and the **CSV** format, then copy the link【630364990071103†L88-L107】. Paste this link into `config.js` and reload.
- **Some products don’t appear.** Check that each row in your sheet includes at least the required columns (slug, title, price_inr, category, platform, image_url, affiliate_url, added_date). Slugs must be unique and URL‑safe (lowercase with dashes).
- **Numbers are formatted oddly.** Prices use `Intl.NumberFormat` with the `en‑IN` locale so that they appear with lakh/crore separators (e.g. `1,23,456.789`)【941623644409432†L323-L326】. If your browser doesn’t support this API, a fallback string is shown.
- **Affiliate clicks aren’t tracked.** Verify that your affiliate URLs include your tracking parameters. When users click a link, it opens in a new tab with the appropriate `rel` attributes to signal to search engines that it is a paid link【538039999483484†L415-L426】.
- **Sharing links copy wrong URLs.** The share button uses the current page’s base URL to construct a link to `product.html?slug=…`. After deployment, sharing will copy your production domain automatically.

## Acknowledgements & sources

- Instructions for publishing a Google Sheet as CSV were adapted from a guide that describes selecting **File → Share → Publish to the web**, choosing the sheet and CSV, then clicking publish and copying the link【630364990071103†L88-L107】.
- Guidance on marking paid links used Google’s documentation on `rel` attributes, which notes that `rel="sponsored"` identifies paid links and that multiple values can be used together【538039999483484†L415-L426】【538039999483484†L490-L496】.
- Security recommendations for `rel="noopener"` come from an article explaining how the noopener tag prevents reverse tabnabbing and should be used whenever a link opens in a new tab【852894883431948†L123-L150】.
- Indian currency formatting uses the `Intl.NumberFormat` API in the `en‑IN` locale (India uses thousands/lakh/crore separators)【941623644409432†L323-L326】.

Enjoy your quirky adventures!
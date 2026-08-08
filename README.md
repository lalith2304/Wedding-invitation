# Wedding Invitation

Premium static wedding invitation website for Lalith S and Priyadharsini S. It is designed for GitHub Pages and uses only HTML, CSS, vanilla JavaScript, and CDN-hosted front-end libraries.

## 1. Project Structure

```text
wedding-invitation/
├── index.html
├── css/
│   ├── style.css
│   └── responsive.css
├── js/
│   ├── main.js
│   └── countdown.js
├── images/
│   ├── lotus.png
│   ├── logo.png
│   └── gallery/
│       ├── img1.jpg
│       ├── img2.jpg
│       └── img5.jpg
├── music/
│   ├── bg.mp3
│   └── README.md
├── favicon.ico
├── .gitignore
└── README.md
```

## 2. Customization

Most design settings live in `css/style.css` under the `:root` variables. Update colors, shadows, fonts, and spacing there to keep the site consistent.

Primary wedding content is in `index.html`. Search for these sections to update text:

- `hero`
- `story`
- `schedule`
- `venue`
- `footer`

## 3. Replacing Photos

Replace files in `images/` while keeping the same filenames, or update the matching `src` and `href` paths in `index.html`.

Recommended sizes:

- Story images `gallery/img1.jpg` through `gallery/img5.jpg`: 1200 x 900 compressed JPG.
- `logo.png`: 512 x 512 PNG.
- `lotus.png`: fallback PNG used if an image fails to load.

Run images through tools like Squoosh, TinyPNG, ImageOptim, or Photoshop export at 70-82% quality.

## 4. Replacing Music

The page expects:

```text
music/bg.mp3
```

Replace the placeholder file with a valid MP3, preferably a short compressed traditional veena/flute instrumental loop.

Music does not autoplay on page load. It starts only after user interaction and can be controlled by the floating music button. The last play/pause preference is stored in `localStorage`.

## 5. Updating Wedding Details

Update visible wedding details in `index.html`:

- Names: `Lalith S` and `Priyadharsini S`
- Date: `23 August 2026`
- Wedding Muhurtham: `4:30 AM - 6:30 AM`
- Reception: `9:00 AM - 12:00 AM`
- Wedding Muhurtham venue: `Aathi Mariamman Temple, Samayapuram`
- Wedding Muhurtham map URL: `https://maps.app.goo.gl/s7ie3bsTKAwBdE5VA`
- Reception venue: `RVG Mahal, Ayyampalayam`
- Reception map URL: `https://maps.app.goo.gl/7skzWcnPxms6Wb5AA`

Update the countdown target in `js/countdown.js`:

```js
const weddingDate = new Date("2026-08-23T04:30:00+05:30").getTime();
```

Also update the JSON-LD event block in `index.html` for SEO.

## 6. Configuring RSVP With Google Forms

The RSVP form validates on the client. By default, it stores a demo submission in `localStorage` so the static site works without a backend.

To connect Google Forms:

1. Create a Google Form with fields matching Name, Phone, Email, Guests, Attending, Food Preference, and Message.
2. Open the form, inspect the form submission request, and copy the `formResponse` URL.
3. In `js/main.js`, set:

```js
const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse";
```

4. Replace the placeholder `entry.0000000001` values in `GOOGLE_FORM_FIELDS` with the real entry IDs from your Google Form.
5. Test from GitHub Pages because Google Forms submissions can behave differently from local files.

## 7. Deploying to GitHub Pages

No build step is required.

1. Create a GitHub repository named `wedding-invitation`.
2. Push the contents of this folder to the repository root.
3. In GitHub, open Settings > Pages.
4. Choose Deploy from a branch.
5. Select the `main` branch and `/root` folder.
6. Save and wait for GitHub Pages to publish.

Your site URL will look like:

```text
https://your-github-username.github.io/wedding-invitation/
```

Update the canonical, Open Graph URL, and Twitter metadata in `index.html` after you know the final URL.

## 8. Performance Optimization Tips

- Replace placeholder images with optimized compressed assets.
- Keep the hero image below 350 KB when possible.
- Keep gallery images below 200 KB each.
- Use lazy loading for non-critical images. This is already enabled in the gallery and content sections.
- Keep third-party libraries limited to the current CDN set: AOS, Swiper, GLightbox, Font Awesome, and Google Fonts.
- Avoid adding heavy video backgrounds or large uncompressed audio.
- Test Lighthouse in Chrome DevTools after replacing real assets.

## Accessibility Notes

- The page includes semantic sections, heading hierarchy, skip link, focus indicators, ARIA labels, and keyboard-friendly controls.
- Keep replacement image alt text meaningful.
- Maintain color contrast if changing the palette.

## Local Preview

From this folder, run a simple static server:

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`.
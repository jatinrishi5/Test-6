# JRishiCPAs — website

A responsive website for **JRishiCPAs**, an online Canadian tax and accounting firm founded by Jatin Rishi. It is a static site with plain HTML, CSS and a little vanilla JavaScript: no build step and no dependencies apart from Google Fonts.

Live site (GitHub Pages): <https://jatinrishi5.github.io/Test-6/>

## Viewing the site

**Locally:** open `index.html` in any modern browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

**GitHub Pages:** the site is published from the `main` branch, `/ (root)` folder (Settings → Pages). Anything merged into `main` is republished automatically.

## What's on the page

| Section | Notes |
| --- | --- |
| Top bar & header | Phone, email and client-portal link; sticky header with section highlighting; mobile menu |
| Hero | "I'm…" switcher (employee, self-employed, business owner, newcomer) that updates an example client file and links to matching services |
| Software we work with | Short band under the hero with a horizontally scrolling strip of official logos (QuickBooks, Xero, Sage, Wave, FreshBooks, Dext, Hubdoc, Wagepoint, TaxCycle); pauses on hover, static with reduced motion |
| Services | Nine services in an explorer: personal tax, self-employed & small business tax, corporate tax & year-end, bookkeeping, payroll, business set-up, tax planning, CRA support, advisory |
| Who we help | Six client situations, each linking to the services that fit |
| How it works | Four-step process |
| Tax Centre | CRA deadline countdown for the 2026 tax year and a personal/business document checklist |
| About & founder | Firm values and Jatin Rishi's founder profile |
| FAQ | Searchable accordion |
| Book a consultation | 3-step intake form that lists the services to cover |
| Newsletter | "The JRishiCPAs Brief" sign-up |

There is intentionally no pricing on the site.

## Structure

```
index.html      All page sections
css/styles.css  Styles and responsive layout
js/main.js      Menu, hero switcher, service explorer, accordion, deadlines, checklist, intake form, newsletter
images/         Founder photo (images/jatin-rishi.jpg) and software logos (images/logos/)
```

## Before going live

- The address, phone number and email are placeholders.
- The intake and newsletter forms validate in the browser only and do not send data. Connect them to a form service, CRM or Calendly booking link.
- Point the "Client portal" links (`#portal`) at your practice-management portal.
- Update the CRA deadline list each tax year (`data-date` attributes in `index.html`).
- **Founder photo:** save the photo as `images/jatin-rishi.jpg` (square, at least 640×640px). Until that file exists the site shows a "JR" monogram.
- Replace the designation/software text badges with official partner badges you are entitled to use.

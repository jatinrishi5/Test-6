# JRishiCPAs — website (Editorial + corporate design)

A responsive website for **JRishiCPAs**, an online Canadian tax and accounting firm founded by Jatin Rishi. This version combines editorial sophistication with contemporary corporate structure: cream and charcoal, corporate navy and muted bronze, oversized serif type and a strict magazine grid. It is a static site with plain HTML, CSS and a little vanilla JavaScript: no build step and no dependencies apart from Google Fonts.

Live site (GitHub Pages): <https://jatinrishi5.github.io/Test-6/>

## Viewing the site

**Locally:** open `index.html` in any modern browser, or serve the folder:

```bash
python3 -m http.server 8000
```

**GitHub Pages:** published from the `main` branch, `/ (root)` folder. Anything pushed to `main` is republished automatically.

## What's on the page

| Section | Notes |
| --- | --- |
| Masthead | Today's date, wordmark and a sticky numbered navigation bar |
| Cover | "Clarity in complexity." headline, standfirst, call to action and an "In this issue" contents list; three departments below |
| 01 The Index | Ten services in three departments (Personal, Business, Advisory); each entry expands to show what's included |
| 02 The Practice | Feature essay with a duotone portrait, drop cap and pull quote, plus four commitments |
| 03 The Process | Four steps with outlined numerals |
| 04 The Calendar | Navy table of 2026 CRA deadlines marked Passed / Next / Upcoming, plus a document checklist |
| 05 Questions & Answers | Interview-style accordion |
| 06 Consultation | Navy and white panel with the 3-step booking form |

## Structure

```
index.html      All page sections
css/base.css    Shared layout, accessibility, accordion, checklist and form styles
css/styles.css  This design's look and layout
js/site.js      Menu, reveals, deadlines, tabs, checklists, FAQ and booking form
js/fx.js        Calendar status labels and the running section indicator
images/         Founder photo and software logos
```

## Before going live

- The phone number and email are placeholders (`(555) 010-0000`, `hello@example.com`).
- Booking: set `BOOKING_URL` in `js/site.js` to your Calendly (or similar) link. Until then, finished requests open an email to `CONTACT_EMAIL`.
- The firm's promises (quote before work starts, client portal, hours) should be confirmed before launch.
- Update the CRA deadline list each tax year (`data-date` attributes in `index.html`).

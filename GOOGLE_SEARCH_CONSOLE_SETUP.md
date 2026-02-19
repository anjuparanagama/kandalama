# Google Search Console Setup Guide

## Overview

Google Search Console (GSC) is essential for monitoring your site's visibility in Google Search and improving its search rankings.

## Step 1: Create/Access Google Search Console Account

1. Go to [Google Search Console](https://search.google.com/search-console/about)
2. Sign in with your Google Account (use business account ideally)
3. Click **"Start now"** or **"Go to Search Console"**

## Step 2: Add Property (Domain)

### Option A: URL Prefix (Recommended for YOUR SITE)

1. Click **"+ Create property"** or **"URL prefix"**
2. Enter: `https://kandalama.app`
3. Click **"Continue"**
4. Follow verification step below

### Option B: Domain Property (For Advanced)

1. Select **"Domain"**
2. Enter: `kandalama.app`
3. Verify via DNS TXT record (more complex)

## Step 3: Verify Domain Ownership

### Method 1: HTML Meta Tag (EASIEST)

1. GSC shows you a meta tag:

   ```html
   <meta
     name="google-site-verification"
     content="YOUR_VERIFICATION_CODE_HERE"
   />
   ```

2. In your project, update **layout.tsx**:

   ```tsx
   <meta name="google-site-verification" content="YOUR_CODE_HERE" />
   ```

3. Or create `.env.local`:

   ```env
   NEXT_PUBLIC_GOOGLE_VERIFICATION_ID=YOUR_CODE_HERE
   ```

4. Update layout.tsx to use environment variable:

   ```tsx
   {
     process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_ID && (
       <meta
         name="google-site-verification"
         content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_ID}
       />
     );
   }
   ```

5. Deploy changes
6. Return to GSC and click **"Verify"**

### Method 2: HTML File Upload

1. Download verification file from GSC
2. Upload to `public/` directory
3. Verify in GSC

### Method 3: Google Analytics

If you have Google Analytics set up:

1. Click **"Verification method"** → **"Google Analytics"**
2. Verify through your Analytics property

### Method 4: Google Tag Manager

If using GTM:

1. Select **"Google Tag Manager"**
2. Verify through GTM container

## Step 4: Submit Sitemap

1. In GSC left menu, click **"Sitemaps"**
2. Enter: `https://kandalama.app/sitemap.xml`
3. Click **"Submit"**
4. GSC should show "Success" status

## Step 5: Submit Robots.txt

1. GSC will automatically detect `https://kandalama.app/robots.txt`
2. You can test it in: **"Settings"** → **"Crawl statistics"**
3. Verify rules are correct

## Step 6: Initial Setup Complete ✅

After verification, you'll have access to these important reports:

### Performance Report

- **Click-through rates** (CTR)
- **Average position** in search results
- **Impressions** (how often your site shows)
- **Queries** (what people search for)

### Coverage Report

- Pages indexed by Google
- Errors and warnings
- Excluded pages

### Enhancements

- Mobile usability issues
- Structured data (Schema validation)
- AMP issues

---

## Important Initial Actions

### 1. Request Indexing (for new site)

- Go to **"URL inspection"**
- Paste: `https://kandalama.app`
- Click **"Inspect"** → **"Request indexing"**

### 2. Exclude Private Pages

- Go to **"Settings"** → **"Crawled parameters"**
- Add parameters to exclude (if needed)
- Admin URLs should be in robots.txt

### 3. Set Geographic Target

- **"Settings"** → **"Geographic target"**
- Verify it's set to **"Sri Lanka"** or leave "Not set"

### 4. Set Preferred Domain

- **"Settings"** → **"Preferred domain"**
- Choose: `https://kandalama.app/` (with www or without)
- Ensure 301 redirects are set up

---

## Monitoring & Maintenance

### Daily

- Check **"Overview"** for any critical issues
- Review new "Error" notifications

### Weekly

- Check **"Performance"** report
- Look for new keywords gaining impressions
- Monitor CTR trends

### Monthly

- Detailed **"Coverage"** review
- Check **"Enhancements"** → **"Structured Data"**
- Review crawl statistics
- Check mobile usability

### Quarterly

- Full SEO audit
- Compare performance metrics
- Plan content improvements

---

## Common Issues & Fixes

### Site Not Indexed

**Problem**: GSC shows "Discovered - currently not indexed"

**Solutions**:

1. Check `robots.txt` - ensure path is not blocked
2. Check meta tags - ensure `index, follow` is set
3. Improve page content - Google may not index thin content
4. Quality issues - check for duplicate content
5. Wait - new sites can take weeks to index

### Crawl Errors

**Problem**: GSC shows "Server error (5xx)", "Soft 404", etc.

**Solutions**:

1. Check server logs
2. Verify page returns correct HTTP status code
3. Ensure page isn't redirecting incorrectly
4. Check robots.txt blocking

### Mobile Usability Issues

**Problem**: "Mobile Usability" shows errors

**Solutions**:

1. Test with [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
2. Fix viewport meta tag ✅ (Already done)
3. Ensure buttons are clickable
4. Fix text readability
5. Fix viewport configuration

### Structured Data Issues

**Problem**: Schema errors in "Enhancements"

**Solutions**:

1. Test with [Structured Data Tester](https://search.google.com/test/rich-results)
2. Fix JSON-LD syntax
3. Ensure required fields are present
4. Review schema.org specifications

---

## Performance Goals

### Typical Timeline for New Site

| Timeframe  | Goal                               |
| ---------- | ---------------------------------- |
| Week 1     | Verified in GSC, sitemap submitted |
| Week 2-4   | First pages indexed                |
| Month 2    | Started ranking for some keywords  |
| Month 3-6  | Building domain authority          |
| Month 6-12 | Competing for competitive keywords |

### Target Metrics

| Metric                 | Target              |
| ---------------------- | ------------------- |
| Index coverage         | > 90% indexed pages |
| Mobile usability       | 0 errors            |
| Core Web Vitals        | All "Good"          |
| Structured data errors | 0 errors            |
| Crawl efficiency       | < 5% crawl errors   |

---

## Useful Tools

- **[Rich Results Test](https://search.google.com/test/rich-results)** - Test Schema.org markup
- **[Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)** - Test mobile experience
- **[URL Inspection Tool](https://support.google.com/webmasters/answer/9012289)** - Check indexing
- **[Robots.txt Tester](https://www.google.com/webmasters/tools/robots-testing-tool)** - Test robots.txt rules

---

## Additional Resources

- [Google Search Central](https://developers.google.com/search)
- [GSC Help Center](https://support.google.com/webmasters)
- [SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)

---

## Kandalama.lk GSC Checklist

- [ ] GSC account created
- [ ] Property added (https://kandalama.app)
- [ ] Domain verified (meta tag method)
- [ ] Sitemap submitted (sitemap.xml)
- [ ] Robots.txt verified
- [ ] Homepage indexed
- [ ] Geographic target set to Sri Lanka
- [ ] Performance metrics monitored
- [ ] Mobile usability checked
- [ ] Structured data validated
- [ ] Initial 10+ pages indexed
- [ ] Keywords appearing in search results

---

**Last Updated**: February 19, 2026
**For**: Kandalama.lk

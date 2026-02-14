# Cloudinary Integration - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1️⃣ Sign Up for Cloudinary (2 min)
1. Go to https://cloudinary.com/users/register/free
2. Create a free account
3. From dashboard, copy your **Cloud Name**

### 2️⃣ Create Upload Preset (1 min)
1. Settings → Upload
2. Scroll to "Upload presets"
3. Click "Add upload preset"
4. Fill:
   - **Name**: `kandalama-properties`
   - **Folder**: `kandalama-properties`
   - **Signing Mode**: Unsigned
   - Save

### 3️⃣ Add Environment Variables (1 min)
Create file `.env.local` in your project root:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxyz1234
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=kandalama-properties
```

Replace `dxyz1234` with your actual Cloud Name.

### 4️⃣ Restart Dev Server (1 min)
```bash
npm run dev
```

Done! ✅ Images will now upload to Cloudinary automatically.

---

## 📂 Files Modified/Created

| File | Action | Purpose |
|------|--------|---------|
| `lib/cloudinary.ts` | ✨ Created | Core upload functions |
| `hooks/useCloudinaryUpload.ts` | ✨ Created | React hook for uploads |
| `app/post-ad/page.tsx` | 🔧 Updated | Integrated Cloudinary |
| `.env.local.example` | ✨ Created | Template for env vars |
| `CLOUDINARY_SETUP.md` | ✨ Created | Detailed setup guide |
| `CLOUDINARY_IMPLEMENTATION.md` | ✨ Created | Full documentation |

---

## 🧪 Test It

1. Go to http://localhost:3000/post-ad
2. Fill in property details
3. Upload 1-6 images
4. Click "Post Advertisement"
5. Watch progress bar as images upload
6. Property page shows uploaded images

---

## 🎨 What Changed in Post-Ad Page

**Added:**
- ✅ Real-time image upload progress
- ✅ Upload status in submit button
- ✅ Improved error handling
- ✅ Images saved to Cloudinary and database

**Example UI Changes:**
```
Step 3: Contact Information
├── Images section shows: "3 images selected"
├── Upload progress: ████████░░ 80%
└── Submit button: "Uploading images... 80%"
```

---

## 🌐 How It Works

```
┌─────────────────┐
│ User Upload     │  ← Select up to 6 images
└────────┬────────┘
         │
┌────────▼────────┐
│ Create Property │  ← Save to Supabase
└────────┬────────┘
         │
┌────────▼────────┐
│ Upload Images   │  ← Send to Cloudinary
└────────┬────────┘
         │
┌────────▼────────┐
│ Save URLs       │  ← Store in database
└────────┬────────┘
         │
┌────────▼────────┐
│ Display in UI   │  ← Show on property page
└─────────────────┘
```

---

## ❓ Common Questions

**Q: Are my images secure?**
A: Images are stored on Cloudinary's secure CDN. URLs are public but only shown with valid properties.

**Q: Can I delete images later?**
A: Yes - when you delete a property or edit it. (Edit page enhancement coming soon)

**Q: What formats are supported?**
A: JPG, PNG, WebP, GIF (any standard web format)

**Q: Is there a file size limit?**
A: 10MB per image (configurable in Cloudinary)

**Q: Can I optimize images?**
A: Yes! Use `getOptimizedImageUrl()` in components for automatic resizing and compression

---

## 🔗 Resources

- 📚 Full Setup Guide: [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)
- 📖 Implementation Details: [CLOUDINARY_IMPLEMENTATION.md](./CLOUDINARY_IMPLEMENTATION.md)
- 🌐 Cloudinary Docs: https://cloudinary.com/documentation

---

## ⚡ What's Next?

**Optional Enhancements:**
1. Add image management to edit page
2. Create image gallery component
3. Add image reordering
4. Backend deletion API

See [CLOUDINARY_IMPLEMENTATION.md](./CLOUDINARY_IMPLEMENTATION.md) for details.

---

**Need help?** Check the browser console for error messages and verify your `.env.local` file is correct.

# Cloudinary Integration Setup Guide

## Step 1: Create a Cloudinary Account

1. Go to [Cloudinary's website](https://cloudinary.com/) and sign up for a free account
2. After signup, you'll be redirected to your dashboard
3. Note your **Cloud Name** - visible on the dashboard

## Step 2: Create an Upload Preset

1. In Cloudinary Dashboard, go to **Settings** → **Upload**
2. Scroll to **Upload presets** section
3. Click **Add upload preset**
4. Fill in:
   - **Name**: `kandalama-properties` (or any name you prefer)
   - **Folder**: `kandalama-properties` (images will be organized in this folder)
   - **Signing Mode**: Select **Unsigned** (for client-side uploads)
   - Click **Save**
5. Copy the preset name

## Step 3: Set Environment Variables

Create or update `.env.local` in your project root with:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name
```

**Example:**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxyz1234
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=kandalama-properties
```

⚠️ **Important**: These are prefixed with `NEXT_PUBLIC_` which means they'll be exposed to the browser (which is fine for unsigned uploads).

## Step 4: How It Works

### Image Upload Flow:
1. User selects images in the post-ad form (up to 6 images)
2. Preview thumbnails appear locally
3. When user clicks "Post Advertisement":
   - Property is created in Supabase
   - Images are uploaded to Cloudinary
   - Cloudinary URLs are stored in `property_images` table
   - User is redirected to property page

### Image Display:
- PropertyCard component automatically displays images from Cloudinary URLs
- Images are optimized with Cloudinary transformations for better performance

## Step 5: Optimize Image Performance

The `lib/cloudinary.ts` file includes a `getOptimizedImageUrl()` function. Use it to optimize images:

```typescript
import { getOptimizedImageUrl } from '@/lib/cloudinary';

// In components:
const optimized = getOptimizedImageUrl(imageUrl, {
  width: 400,
  height: 300,
  quality: 'auto',
  crop: 'fill'
});

<img src={optimized} alt="Property" />
```

## Troubleshooting

### Images not uploading?
- Check environment variables are set in `.env.local`
- Verify upload preset name is correct
- Check browser console for error messages
- Ensure CORS is enabled (usually enabled by default)

### To view uploaded images:
- Go to Cloudinary Dashboard → Media Library
- Filter by folder "kandalama-properties"
- Images should be listed there

### Delete images from Cloudinary:
- Currently done via Supabase workflow (auto-deletes when property is deleted)
- Can be manually deleted from Cloudinary dashboard

## Optional: Delete API Setup

For advanced image deletion from client, create an API endpoint:

```typescript
// app/api/cloudinary/delete/route.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const { publicId } = await request.json();

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: 'Delete failed' }, { status: 500 });
  }
}
```

Add to `.env.local`:
```env
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Find API key/secret in Cloudinary Dashboard → Settings → API Keys

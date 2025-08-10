# 🚀 Quick Customization Guide

This guide helps you quickly customize the 3D Studio platform for your project.

## 📋 Customization Checklist

### Essential Changes (Do These First!)

#### 1. Update Site Metadata
**File:** `src/app/layout.tsx` (lines 15-31)
```typescript
title: "Your Company Name",
description: "Your business description",
```

#### 2. Update Hero Content
**File:** `src/app/page.tsx`
- **Line 48:** Change headline text
- **Line 52:** Update description
- **Lines 55-60:** Update button text

#### 3. Customize Colors
**File:** `src/components/three/Scene.tsx` (lines 31-37)
```typescript
colorPrimary: new THREE.Color('#FF6B6B'),   // Your primary
colorSecondary: new THREE.Color('#4ECDC4'), // Your secondary
colorAccent: new THREE.Color('#FFE66D'),    // Your accent
```

#### 4. Update Footer
**File:** `src/app/page.tsx` (lines 386-459)
- Company name
- Copyright year
- Contact info

### Optional Customizations

#### Replace 3D Model
1. Add your `.glb` file to `public/models/`
2. Update `src/components/three/Scene.tsx`
3. Import and use your model

#### Adjust Animations
**File:** `src/components/three/CameraRig.tsx`
- Modify camera positions (lines 16-17)
- Adjust rotation angles (lines 19-20)

#### Change Post-Processing
**File:** `src/components/three/PostProcessing.tsx`
- Bloom intensity (line 24)
- Vignette effect (line 26)

## 🎨 Brand Colors Reference

### Where to Update Colors:

1. **Shader Colors:** `src/components/three/Scene.tsx`
2. **UI Colors:** Throughout `src/app/page.tsx`
   - Search for: `bg-slate-`, `text-slate-`, `from-slate-`
   - Replace with your brand colors

3. **Button Gradients:** 
   - Primary: `from-slate-800 to-slate-600`
   - Secondary: `from-blue-600 to-purple-600`

## 📱 Testing Checklist

- [ ] Desktop Chrome
- [ ] Desktop Safari
- [ ] Desktop Firefox
- [ ] Mobile iOS Safari
- [ ] Mobile Chrome
- [ ] Tablet iPad
- [ ] Check scroll animations
- [ ] Test 3D performance
- [ ] Verify responsive layout

## 🚢 Deployment Steps

1. **Build locally:**
   ```bash
   npm run build
   npm run start
   ```

2. **Deploy to Vercel:**
   ```bash
   npx vercel --prod
   ```

3. **Custom domain:**
   - Add domain in Vercel dashboard
   - Update DNS records

## 📞 Need Help?

Common issues and solutions:

### 3D Model Not Loading
- Check file path in `public/models/`
- Verify GLB format is correct
- Check browser console for errors

### Performance Issues
- Reduce particle count in `Scene.tsx`
- Lower shadow resolution
- Disable post-processing effects

### Build Errors
- Run `npm install` to ensure dependencies
- Check for TypeScript errors with `npm run lint`
- Clear `.next` folder and rebuild

---

**Remember:** Always test on actual devices, not just browser dev tools!
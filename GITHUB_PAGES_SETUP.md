# Deploying core-dash to GitHub Pages

## Quick Setup

Follow these steps to deploy your Angular dashboard to GitHub Pages:

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production
```bash
npm run build
```

This creates an optimized production build in the `dist/` folder with the correct base href for GitHub Pages.

### 3. Deploy to GitHub Pages

**Option A: Automatic Deployment**
```bash
npm run deploy
```

**Option B: Manual Deployment**
```bash
npx angular-cli-ghpages --dir=dist/core-dash/browser --repo=https://github.com/Josloader3/core-dash.git --branch=gh-pages
```

**Option C: Using bash script**
```bash
chmod +x deploy.sh
./deploy.sh
```

### 4. Enable GitHub Pages
1. Go to your repository settings
2. Scroll to **Pages** section
3. Select **Deploy from a branch**
4. Choose branch: `gh-pages`
5. Choose folder: `/ (root)`
6. Click **Save**

### 5. Access Your App
Your dashboard will be available at:
```
https://Josloader3.github.io/core-dash/
```

## What Was Changed

- ✅ **angular.json**: Added `"baseHref": "/core-dash/"` to production build configuration
- ✅ **package.json**: Added `angular-cli-ghpages` dependency and `deploy` script
- ✅ **deploy.sh**: Added deployment automation script

## Notes

- The app will be deployed on the `gh-pages` branch
- The `baseHref` ensures all Angular routing works correctly on the GitHub Pages subdirectory
- Assets and styles will be properly referenced with the correct base path
- Charts, PrimeNG components, and TailwindCSS will work as expected

## Troubleshooting

If the app doesn't load:
- Clear browser cache
- Verify the `gh-pages` branch exists in your repository
- Check GitHub Pages settings point to `gh-pages` branch
- Ensure all relative paths use the correct base href

For issues with routing, add a `.nojekyll` file to the `dist/core-dash/browser` folder before deploying.

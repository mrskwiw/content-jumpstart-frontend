# Deployment Guide - Operator Dashboard

## Netlify Deployment

### Prerequisites
- Netlify account (free tier works fine)
- GitHub/GitLab repository (or direct Netlify CLI deployment)
- Backend API deployed and accessible

### Option 1: Deploy via Netlify UI (Recommended)

1. **Push to GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Initial commit - ready for deployment"
   git remote add origin <your-repo-url>
   git push -u origin master
   ```

2. **Connect to Netlify**
   - Log in to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select your Git provider (GitHub/GitLab)
   - Choose your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: (leave empty or set to `project/operator-dashboard`)

4. **Set Environment Variables**
   In Netlify dashboard → Site settings → Environment variables, add:
   ```
   VITE_API_URL=https://your-backend-api.com
   VITE_WS_URL=wss://your-backend-api.com
   VITE_USE_MOCKS=false
   ```

5. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy
   - Get your live URL: `https://your-site-name.netlify.app`

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Netlify Site**
   ```bash
   cd project/operator-dashboard
   netlify init
   ```

4. **Set Environment Variables**
   ```bash
   netlify env:set VITE_API_URL "https://your-backend-api.com"
   netlify env:set VITE_WS_URL "wss://your-backend-api.com"
   netlify env:set VITE_USE_MOCKS "false"
   ```

5. **Deploy**
   ```bash
   # Deploy to draft URL for testing
   netlify deploy

   # Deploy to production
   netlify deploy --prod
   ```

### Option 3: Manual Deploy

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify Drop**
   - Go to [Netlify Drop](https://app.netlify.com/drop)
   - Drag and drop the `dist` folder
   - Configure environment variables in the dashboard

## Environment Variables

### Development (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_USE_MOCKS=true
```

### Production (Netlify Environment Variables)
```env
VITE_API_URL=https://api.yourproductiondomain.com
VITE_WS_URL=wss://api.yourproductiondomain.com
VITE_USE_MOCKS=false
```

## Post-Deployment Configuration

### 1. Custom Domain (Optional)
- In Netlify dashboard → Domain settings
- Add custom domain
- Configure DNS records

### 2. HTTPS Certificate
- Automatically provisioned by Netlify
- Free Let's Encrypt certificate

### 3. Deploy Previews
- Automatically created for pull requests
- Enable in Netlify dashboard → Build settings

### 4. Continuous Deployment
- Automatic deployments on git push
- Configure branch deploys in Netlify dashboard

## Troubleshooting

### Build Fails
- Check Node.js version (should be 20+)
- Verify all dependencies are in `package.json`
- Check build logs in Netlify dashboard

### Routing Issues (404 on refresh)
- Verify `_redirects` file exists in `public/` folder
- Check `netlify.toml` redirect rules

### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Rebuild after changing environment variables
- Check Netlify environment variables dashboard

### API Connection Issues
- Verify CORS settings on backend API
- Check API URL environment variable
- Ensure backend is deployed and accessible

## Performance Optimization

### Already Configured
- Asset caching (1 year for static assets)
- Gzip/Brotli compression (automatic)
- CDN distribution (automatic)

### Recommended
- Enable Netlify Analytics (paid)
- Set up performance monitoring
- Configure error tracking (Sentry, etc.)

## Monitoring

### Netlify Analytics
- Deploy logs: Netlify dashboard → Deploys
- Function logs: Netlify dashboard → Functions
- Analytics: Netlify dashboard → Analytics (paid feature)

### External Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Configure error tracking (Sentry)
- Add performance monitoring (New Relic, DataDog)

## Rollback

### Via Netlify UI
1. Go to Deploys
2. Find previous successful deploy
3. Click "Publish deploy"

### Via Netlify CLI
```bash
netlify deploy --prod --alias=previous-version
```

## Environment-Specific Builds

### Preview Deploys
- Automatically use mock data (`VITE_USE_MOCKS=true`)
- Connect to staging API if available

### Production Deploys
- Use real API endpoints
- Disable mock data
- Enable production analytics

## Security Checklist

- [ ] Environment variables configured (not in code)
- [ ] API endpoints use HTTPS
- [ ] CORS properly configured on backend
- [ ] Security headers configured (see `netlify.toml`)
- [ ] No sensitive data in client-side code
- [ ] Authentication tokens secured
- [ ] Rate limiting enabled on API

## Cost Optimization

### Netlify Free Tier Includes
- 100 GB bandwidth/month
- 300 build minutes/month
- Automatic HTTPS
- Deploy previews
- Continuous deployment

### Upgrade When Needed
- Higher bandwidth requirements
- More build minutes
- Team collaboration features
- Advanced analytics

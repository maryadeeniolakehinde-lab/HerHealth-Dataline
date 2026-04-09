# Deployment Guide

## 🚀 Vercel Deployment (Recommended)

### Prerequisites
- GitHub account with repo
- Vercel account (free)
- Supabase project set up

### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/herhealth.git
git push -u origin main
```

2. **Import to Vercel**
- Go to https://vercel.com
- Click "Add New..." → "Project"
- Select GitHub repository
- Click "Import"

3. **Configure Environment Variables**
In Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OLLAMA_API_URL=https://api.ollama.ai
OLLAMA_API_KEY=your_ollama_cloud_api_key
OLLAMA_MODEL=meditron:7b
```

4. **Deploy**
- Click "Deploy"
- Wait for build completion
- Get your production URL

---

## 📦 Docker Deployment

### Build Image
```bash
# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "start"]
EOF
```

### Build & Run
```bash
docker build -t herhealth:latest .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  herhealth:latest
```

---

## ☁️ AWS Deployment

### Using AWS Amplify
1. Connect GitHub repo to AWS Amplify
2. Set environment variables
3. Auto-deploys on push

### Using EC2
1. Launch Node.js instance
2. Clone repo
3. Run `npm install && npm run build`
4. Use PM2 to keep running:
```bash
npm install -g pm2
pm2 start "npm start"
```

---

## 🔧 Environment Variables Checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `OLLAMA_API_URL`
- [ ] `OLLAMA_MODEL`
- [ ] `NODE_ENV=production`

---

## ✅ Pre-Deployment Checklist

- [ ] Database migrations applied
- [ ] Edge Functions deployed
- [ ] Environment variables set
- [ ] Ollama accessibility verified
- [ ] All tests passing
- [ ] UI tested on mobile
- [ ] Disclaimers reviewed
- [ ] Emergency resources verified
- [ ] Privacy policy created
- [ ] Terms of service created

---

## 📊 Post-Deployment

1. Monitor dashboard: Vercel Analytics
2. Set up error tracking: Sentry
3. Enable HTTPS (automatic on Vercel)
4. Configure CDN (Vercel edge network)
5. Set up monitoring & alerts
6. Load testing with Lighthouse

---

## 💾 Database Backups

```bash
# Supabase auto-backups weekly
# Manual backup:
supabase db pull

# Store securely in S3 or similar
```

---

## 🔐 Security Hardening

- [ ] Enable CORS properly in Supabase
- [ ] Set up rate limiting on Edge Functions
- [ ] Enable RLS on all tables
- [ ] Rotate API keys regularly
- [ ] Use HTTPS only
- [ ] Set secure session cookies
- [ ] Monitor for suspicious activity

---

See [README.md](./README.md) for full documentation.

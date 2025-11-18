# Security Guidelines

## 🔒 Environment Variables

This project uses environment variables for sensitive data. **Never commit these files:**

- `.env`
- `.env.local`
- `.env.*.local`

### Setting Up Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your values:
   ```env
   VITE_GITHUB_TOKEN=your_token_here
   VITE_SUPABASE_URL=your_url_here
   VITE_SUPABASE_ANON_KEY=your_key_here
   ```

3. Verify it's ignored:
   ```bash
   git check-ignore .env.local
   # Should output: .env.local
   ```

## 🛡️ What's Protected

### In `.gitignore`:
- ✅ All `.env*` files (except `.env.example`)
- ✅ `downloads/` directory (may contain scraped data)
- ✅ Temporary documentation files
- ✅ Node modules and build artifacts

### What's Safe to Commit:
- ✅ `.env.example` - Template with no real values
- ✅ Source code using `import.meta.env.VITE_*`
- ✅ Configuration files without hardcoded secrets

## 🔍 Before Committing

Run this security check:
```bash
# Check if sensitive files are ignored
git check-ignore .env.local

# See what will be committed
git status

# Search for potential secrets (PowerShell)
Select-String -Path "src\**\*.ts","src\**\*.tsx" -Pattern "ghp_|sk_|pk_|eyJ"
```

## 🚨 If You Accidentally Commit Secrets

1. **Immediately rotate/revoke** the exposed credentials
2. Remove from git history:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env.local" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push (if already pushed):
   ```bash
   git push origin --force --all
   ```

## 📝 API Keys Used

### GitHub Personal Access Token
- **Purpose**: Higher rate limits for scraping (5000/hour vs 60/hour)
- **Scopes**: `public_repo` (read-only)
- **Get it**: https://github.com/settings/tokens
- **Variable**: `VITE_GITHUB_TOKEN`

### Supabase Credentials
- **Purpose**: Backend database (optional, app works without it)
- **Get it**: https://app.supabase.com/project/YOUR_PROJECT/settings/api
- **Variables**: 
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY` (public key, safe to expose in frontend)

## ✅ Security Checklist

Before pushing to GitHub:
- [ ] `.env.local` is in `.gitignore`
- [ ] No hardcoded tokens in source code
- [ ] `.env.example` has placeholder values only
- [ ] `git status` shows no `.env*` files
- [ ] Tested with `git check-ignore .env.local`

## 📧 Report Security Issues

If you find a security vulnerability, please email:
- Do NOT open a public issue
- Contact: [your-email@example.com]

---

Last updated: November 2024


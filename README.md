# Aram Algorithm Landing Page

A modern, responsive Node.js Express landing page for Aram Algorithm's AI Red Teaming & EU AI Act Compliance services.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- PowerShell 5.1+ (Windows)
- Git (optional, for version control)
- Vercel CLI (optional, for deployment)

### Installation

1. **Clone or download this repository**
```powershell
git clone https://github.com/your-username/aram-landing.git
cd aram-landing
```

2. **Install dependencies**
```powershell
npm install
```

3. **Start the development server**
```powershell
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:3000`

## 📁 Project Structure

```
aram-landing/
├── server.js              # Express server entry point
├── package.json           # Dependencies and scripts
├── vercel.json            # Vercel deployment config
├── views/
│   └── index.ejs          # Main landing page template
├── public/
│   ├── css/
│   │   └── main.css       # Styles
│   └── js/
│       └── main.js        # Client-side JavaScript
├── scripts/               # PowerShell automation scripts
│   ├── drop_generated.ps1 # Inject generated code
│   ├── restart_server.ps1 # Server management
│   └── deploy_vercel.ps1  # Deployment automation
├── logs/                  # Server and script logs
└── .generated_backups/    # Automatic backups
```

## 🛠️ Available Scripts

### Node.js Scripts
```powershell
npm run dev        # Start development server with nodemon
npm start          # Start production server
npm run prod       # Start server in production mode
npm test           # Run tests
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

### PowerShell Scripts
```powershell
# Server management
.\scripts\restart_server.ps1                    # Restart dev server
.\scripts\restart_server.ps1 -Port 3001        # Use different port
.\scripts\restart_server.ps1 -Mode prod        # Production mode
.\scripts\restart_server.ps1 -Background       # Run in background
.\scripts\restart_server.ps1 -Force            # Kill existing processes

# Code injection and deployment
.\scripts\drop_generated.ps1 "path\to\file.ejs"           # Drop EJS template
.\scripts\drop_generated.ps1 "path\to\file.css" -Type css # Drop CSS file
.\scripts\drop_generated.ps1 "path\to\file.js" -Type js   # Drop JavaScript file
.\scripts\drop_generated.ps1 "path\to\file.ejs" -Deploy   # Drop and deploy

# Deployment
.\scripts\deploy_vercel.ps1                     # Deploy to production
.\scripts\deploy_vercel.ps1 -Environment preview # Deploy to preview
.\scripts\deploy_vercel.ps1 -AutoCommit        # Auto-commit before deploy
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Optional: Add your analytics, monitoring, etc.
ANALYTICS_ID=your_analytics_id
SENTRY_DSN=your_sentry_dsn
```

### Vercel Deployment

1. **Install Vercel CLI**
```powershell
npm install -g vercel
```

2. **Login to Vercel**
```powershell
vercel login
```

3. **Link your project**
```powershell
vercel link
```

4. **Deploy**
```powershell
# Using Vercel CLI directly
vercel --prod

# Or using our PowerShell script
.\scripts\deploy_vercel.ps1
```

## 🎯 Code Generation Workflow

This boilerplate is designed for easy integration with AI-generated code:

### 1. Generate Code
Use your preferred AI tool (Claude, GPT, etc.) to generate:
- EJS templates
- CSS styles
- JavaScript functionality
- Server-side routes

### 2. Drop Generated Code
```powershell
# Drop an EJS template
.\scripts\drop_generated.ps1 "C:\path\to\generated\template.ejs"

# Drop CSS styles
.\scripts\drop_generated.ps1 "C:\path\to\generated\styles.css" -Type css

# Drop JavaScript
.\scripts\drop_generated.ps1 "C:\path\to\generated\script.js" -Type js

# Drop and immediately deploy
.\scripts\drop_generated.ps1 "C:\path\to\generated\template.ejs" -Deploy
```

### 3. Automatic Features
- ✅ **Automatic backups** of existing files
- ✅ **Code formatting** with Prettier
- ✅ **Server restart** detection and handling
- ✅ **Hot reload** for template/asset changes
- ✅ **Git integration** for version control
- ✅ **Deployment automation** to Vercel

## 📋 Usage Examples

### Basic Development Workflow

```powershell
# 1. Start development server
npm run dev

# 2. Edit files or drop generated code
.\scripts\drop_generated.ps1 "new_template.ejs"

# 3. View changes at http://localhost:3000
# (Server automatically restarts for EJS changes)

# 4. Deploy when ready
.\scripts\deploy_vercel.ps1 -AutoCommit
```

### Production Deployment

```powershell
# Quick production deployment
.\scripts\deploy_vercel.ps1 -Environment prod -AutoCommit

# Or step by step
git add .
git commit -m "Ready for production"
git push origin main
vercel --prod
```

### File Type Examples

```powershell
# Update the main landing page
.\scripts\drop_generated.ps1 "generated_homepage.ejs" -Type ejs

# Update styles
.\scripts\drop_generated.ps1 "new_styles.css" -Type css

# Update client JavaScript
.\scripts\drop_generated.ps1 "updated_interactions.js" -Type js

# Update server code
.\scripts\drop_generated.ps1 "new_server.js" -Type server
```

## 🔍 Monitoring & Logs

### Log Files
- `logs/server.log` - Server output and errors
- `logs/deploy.log` - Deployment logs
- `logs/drop_generated.log` - Code injection logs

### Health Checks
- **Local**: `http://localhost:3000/health`
- **Production**: `https://your-app.vercel.app/health`

## 🛡️ Security Features

- **Helmet.js** for security headers
- **Rate limiting** (100 requests/15 minutes per IP)
- **CORS protection**
- **Input validation and sanitization**
- **CSP (Content Security Policy)**
- **XSS protection**

## 🧪 Testing

```powershell
# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format
```

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🔧 Troubleshooting

### Common Issues

**Port already in use:**
```powershell
.\scripts\restart_server.ps1 -Force
# or
.\scripts\restart_server.ps1 -Port 3001
```

**Vercel deployment fails:**
```powershell
vercel login
vercel link
.\scripts\deploy_vercel.ps1
```

**Generated code not updating:**
```powershell
# Check if server is running
Get-Process -Name "node" -ErrorAction SilentlyContinue

# Force restart
.\scripts\restart_server.ps1 -Force
```

### Getting Help

1. Check the logs in the `logs/` directory
2. Ensure all prerequisites are installed
3. Verify you're in the project root directory
4. Try with `-Force` flag for server operations

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ for the Aram Algorithm team**

# deploy_vercel.ps1
# PowerShell script to deploy Node.js Express app to Vercel
# Usage: .\scripts\deploy_vercel.ps1 [-Environment prod] [-AutoCommit]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("prod", "preview", "dev")]
    [string]$Environment = "prod",
    
    [Parameter(Mandatory=$false)]
    [switch]$AutoCommit = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBuild = $false,
    
    [Parameter(Mandatory=$false)]
    [string]$Message = "Deploy to Vercel from PowerShell script"
)

# Configuration
$LOGS_DIR = "logs"
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"

# Create logs directory if it doesn't exist
if (-not (Test-Path $LOGS_DIR)) {
    New-Item -ItemType Directory -Path $LOGS_DIR -Force | Out-Null
}

# Function to log messages
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $LogMessage = "[$TIMESTAMP] [$Level] $Message"
    Write-Host $LogMessage
    Add-Content -Path "$LOGS_DIR\deploy.log" -Value $LogMessage
}

Write-Log "Starting Vercel deployment process..."
Write-Log "Environment: $Environment"

try {
    # Check prerequisites
    Write-Host "🔍 Checking prerequisites..." -ForegroundColor Blue
    
    # Check if Vercel CLI is installed
    if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
        Write-Log "ERROR: Vercel CLI not found" "ERROR"
        Write-Host "❌ Vercel CLI is not installed" -ForegroundColor Red
        Write-Host "📦 Install it with: npm i -g vercel" -ForegroundColor Yellow
        Write-Host "🔗 Or download from: https://vercel.com/cli" -ForegroundColor Yellow
        exit 1
    }
    
    # Check if we're in a Node.js project
    if (-not (Test-Path "package.json")) {
        Write-Log "ERROR: package.json not found" "ERROR"
        Write-Host "❌ Not in a Node.js project directory" -ForegroundColor Red
        exit 1
    }
    
    # Check if Git is available (for auto-commit)
    $GitAvailable = Get-Command git -ErrorAction SilentlyContinue
    if (-not $GitAvailable -and $AutoCommit) {
        Write-Log "WARN: Git not available but AutoCommit requested" "WARN"
        Write-Host "⚠️  Git not found but -AutoCommit specified" -ForegroundColor Yellow
        $AutoCommit = $false
    }
    
    Write-Log "Prerequisites check passed" "SUCCESS"
    
    # Auto-commit changes if requested
    if ($AutoCommit -and $GitAvailable) {
        Write-Host "📝 Auto-committing changes..." -ForegroundColor Blue
        Write-Log "Starting auto-commit process..."
        
        # Check if there are changes to commit
        & git add .
        $GitStatus = & git status --porcelain
        
        if ($GitStatus) {
            Write-Log "Found changes to commit: $($GitStatus.Count) files"
            & git commit -m "$Message - $TIMESTAMP"
            
            if ($LASTEXITCODE -eq 0) {
                Write-Log "Git commit successful" "SUCCESS"
                Write-Host "✅ Changes committed successfully" -ForegroundColor Green
                
                # Push to remote if configured
                $RemoteExists = & git remote 2>&1
                if ($RemoteExists -and $LASTEXITCODE -eq 0) {
                    Write-Host "🚀 Pushing to remote repository..." -ForegroundColor Blue
                    & git push
                    if ($LASTEXITCODE -eq 0) {
                        Write-Log "Git push successful" "SUCCESS"
                        Write-Host "✅ Pushed to remote repository" -ForegroundColor Green
                    } else {
                        Write-Log "Git push failed" "WARN"
                        Write-Host "⚠️  Failed to push to remote (continuing anyway)" -ForegroundColor Yellow
                    }
                }
            } else {
                Write-Log "Git commit failed" "ERROR"
                Write-Host "❌ Failed to commit changes" -ForegroundColor Red
                exit 1
            }
        } else {
            Write-Log "No changes to commit" "INFO"
            Write-Host "ℹ️  No changes to commit" -ForegroundColor Cyan
        }
    }
    
    # Run build process unless skipped
    if (-not $SkipBuild) {
        Write-Host "🔨 Running build process..." -ForegroundColor Blue
        Write-Log "Starting build process..."
        
        # Install dependencies first
        Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
        & npm ci --only=production
        if ($LASTEXITCODE -ne 0) {
            Write-Log "npm ci failed" "ERROR"
            Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
            exit 1
        }
        
        # Run linting if available
        Write-Host "🔍 Running linter..." -ForegroundColor Blue
        & npm run lint 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Linting passed" "SUCCESS"
            Write-Host "✅ Linting passed" -ForegroundColor Green
        } else {
            Write-Log "Linting failed or not available" "WARN"
            Write-Host "⚠️  Linting failed or not configured" -ForegroundColor Yellow
        }
        
        # Run tests if available
        Write-Host "🧪 Running tests..." -ForegroundColor Blue
        & npm test 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Tests passed" "SUCCESS"
            Write-Host "✅ Tests passed" -ForegroundColor Green
        } else {
            Write-Log "Tests failed or not available" "WARN"
            Write-Host "⚠️  Tests failed or not configured (continuing anyway)" -ForegroundColor Yellow
        }
        
        Write-Log "Build process completed" "SUCCESS"
    }
    
    # Deploy to Vercel
    Write-Host "🚀 Deploying to Vercel ($Environment)..." -ForegroundColor Green
    Write-Log "Starting Vercel deployment to $Environment..."
    
    # Determine Vercel deployment flags
    $VercelFlags = @()
    
    switch ($Environment) {
        "prod" { $VercelFlags += @("--prod") }
        "preview" { $VercelFlags += @() } # Default behavior
        "dev" { $VercelFlags += @("--target", "development") }
    }
    
    # Add confirmation flag for production
    if ($Environment -eq "prod") {
        $VercelFlags += @("--confirm")
    }
    
    # Execute Vercel deployment
    Write-Host "⚡ Running: vercel $($VercelFlags -join ' ')" -ForegroundColor Gray
    
    $VercelOutput = & vercel @VercelFlags 2>&1
    $VercelExitCode = $LASTEXITCODE
    
    # Log the output
    $VercelOutput | ForEach-Object { Write-Log "Vercel: $_" "INFO" }
    
    if ($VercelExitCode -eq 0) {
        Write-Log "Vercel deployment successful" "SUCCESS"
        Write-Host "🎉 Deployment successful!" -ForegroundColor Green
        
        # Extract deployment URL from output
        $DeploymentUrl = $VercelOutput | Where-Object { $_ -match "https://.*\.vercel\.app" } | Select-Object -First 1
        if ($DeploymentUrl) {
            Write-Host "🌐 Deployment URL: $DeploymentUrl" -ForegroundColor Cyan
            Write-Log "Deployment URL: $DeploymentUrl" "INFO"
        }
        
        # Extract preview URL if not production
        if ($Environment -ne "prod") {
            $PreviewUrl = $VercelOutput | Where-Object { $_ -match "Preview:" } | Select-Object -First 1
            if ($PreviewUrl) {
                Write-Host "👀 Preview: $PreviewUrl" -ForegroundColor Cyan
                Write-Log "Preview URL: $PreviewUrl" "INFO"
            }
        }
        
    } else {
        Write-Log "Vercel deployment failed with exit code: $VercelExitCode" "ERROR"
        Write-Host "❌ Deployment failed!" -ForegroundColor Red
        Write-Host "📋 Check the logs above for details" -ForegroundColor Gray
        exit 1
    }
    
    # Success summary
    Write-Host "`n📊 Deployment Summary:" -ForegroundColor Green
    Write-Host "   ✅ Environment: $Environment" -ForegroundColor White
    Write-Host "   ✅ Timestamp: $TIMESTAMP" -ForegroundColor White
    Write-Host "   ✅ Status: Success" -ForegroundColor White
    Write-Host "   📁 Logs: $LOGS_DIR\deploy.log" -ForegroundColor White
    
    if ($AutoCommit) {
        Write-Host "   ✅ Auto-commit: Enabled" -ForegroundColor White
    }
    
    Write-Log "Deployment process completed successfully" "SUCCESS"
    
} catch {
    Write-Log "ERROR: $($_.Exception.Message)" "ERROR"
    Write-Host "❌ Deployment failed! Check logs for details." -ForegroundColor Red
    Write-Host "📋 Log file: $LOGS_DIR\deploy.log" -ForegroundColor Gray
    
    # Show troubleshooting tips
    Write-Host "`n🔧 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Check if you're logged into Vercel: vercel login" -ForegroundColor White
    Write-Host "   2. Verify project is linked: vercel link" -ForegroundColor White
    Write-Host "   3. Check vercel.json configuration" -ForegroundColor White
    Write-Host "   4. Ensure all dependencies are in package.json" -ForegroundColor White
    
    exit 1
}

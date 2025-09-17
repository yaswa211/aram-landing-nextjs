# drop_generated.ps1
# PowerShell script to inject externally-generated EJS template/code into the Node.js project
# Usage: .\scripts\drop_generated.ps1 "C:\path\to\generated\template.ejs" [-Deploy] [-Type "ejs"]

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$GeneratedPath,
    
    [Parameter(Mandatory=$false)]
    [switch]$Deploy = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBackup = $false,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("ejs", "css", "js", "server")]
    [string]$Type = "ejs"
)

# Configuration based on file type
$TARGETS = @{
    "ejs" = "views\index.ejs"
    "css" = "public\css\main.css"
    "js" = "public\js\main.js"
    "server" = "server.js"
}

$TARGET = $TARGETS[$Type]
$BACKUP_DIR = ".generated_backups"
$LOGS_DIR = "logs"
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"

# Create required directories
@($BACKUP_DIR, $LOGS_DIR) | ForEach-Object {
    if (-not (Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force | Out-Null
        Write-Host "Created directory: $_" -ForegroundColor Green
    }
}

# Function to log messages
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $LogMessage = "[$TIMESTAMP] [$Level] $Message"
    Write-Host $LogMessage
    Add-Content -Path "$LOGS_DIR\drop_generated.log" -Value $LogMessage
}

# Validate input file exists
if (-not (Test-Path $GeneratedPath)) {
    Write-Log "ERROR: Generated file not found: $GeneratedPath" "ERROR"
    exit 1
}

# Validate target file exists
if (-not (Test-Path $TARGET)) {
    Write-Log "ERROR: Target file not found: $TARGET" "ERROR"
    Write-Log "Available types: ejs, css, js, server" "INFO"
    exit 1
}

try {
    Write-Log "Starting Node.js code drop process..."
    Write-Log "Source: $GeneratedPath"
    Write-Log "Target: $TARGET"
    Write-Log "Type: $Type"
    
    # Create backup of existing file (unless skipped)
    if (-not $SkipBackup -and (Test-Path $TARGET)) {
        $BackupFile = "$BACKUP_DIR\$(Split-Path $TARGET -Leaf)_$TIMESTAMP"
        Copy-Item $TARGET $BackupFile -Force
        Write-Log "Backup created: $BackupFile" "SUCCESS"
    }
    
    # Copy generated file to target
    Copy-Item $GeneratedPath $TARGET -Force
    Write-Log "Generated file copied successfully" "SUCCESS"
    
    # Verify the copy was successful
    if (Test-Path $TARGET) {
        $FileSize = (Get-Item $TARGET).Length
        Write-Log "Target file size: $FileSize bytes" "INFO"
    }
    
    # Format with Prettier if available and it's a supported file type
    if ((Get-Command npm -ErrorAction SilentlyContinue) -and ($Type -in @("js", "css", "ejs"))) {
        Write-Log "Running Prettier formatter..."
        try {
            & npm run format 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Log "Code formatted successfully" "SUCCESS"
            } else {
                Write-Log "Prettier formatting failed" "WARN"
            }
        } catch {
            Write-Log "Prettier not available or failed" "WARN"
        }
    }
    
    # Check if Node.js server is running
    $NodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { 
        $_.CommandLine -like "*server.js*" -or $_.CommandLine -like "*nodemon*" 
    }
    
    if ($NodeProcesses) {
        Write-Log "Node.js server is running - restart may be needed for server.js changes" "INFO"
        
        if ($Type -eq "server") {
            Write-Log "Server file changed - attempting restart..."
            & .\scripts\restart_server.ps1 -Force
        } else {
            Write-Host "🔄 Server is running - EJS/CSS/JS changes should be reflected automatically" -ForegroundColor Yellow
        }
    } else {
        Write-Log "Node.js server not detected - you may need to start it manually" "WARN"
        Write-Host "💡 Start server with: npm run dev" -ForegroundColor Cyan
    }
    
    # Handle deployment if requested
    if ($Deploy) {
        Write-Log "Deploy flag detected - initiating deployment..." "INFO"
        
        # Check if git is available and repo is initialized
        if (Get-Command git -ErrorAction SilentlyContinue) {
            if (Test-Path ".git") {
                Write-Log "Committing changes to Git..."
                & git add $TARGET
                & git commit -m "chore: update generated $Type file (automated drop - $TIMESTAMP)"
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Log "Git commit successful" "SUCCESS"
                    
                    # Push to main branch
                    & git push origin main
                    if ($LASTEXITCODE -eq 0) {
                        Write-Log "Git push successful" "SUCCESS"
                    } else {
                        Write-Log "Git push failed" "ERROR"
                    }
                } else {
                    Write-Log "Git commit failed - no changes to commit or error occurred" "WARN"
                }
            } else {
                Write-Log "No Git repository found - skipping Git operations" "WARN"
            }
        }
        
        # Deploy to Vercel if CLI is available
        if (Get-Command vercel -ErrorAction SilentlyContinue) {
            Write-Log "Deploying to Vercel..."
            & vercel --prod --confirm
            if ($LASTEXITCODE -eq 0) {
                Write-Log "Vercel deployment successful" "SUCCESS"
                Write-Host "🚀 Deployment complete!" -ForegroundColor Green
            } else {
                Write-Log "Vercel deployment failed" "ERROR"
            }
        } else {
            Write-Log "Vercel CLI not found - install with: npm i -g vercel" "WARN"
        }
    }
    
    Write-Log "Code drop process completed successfully" "SUCCESS"
    Write-Host "`n✅ Code drop completed!" -ForegroundColor Green
    Write-Host "📁 Target: $TARGET" -ForegroundColor Gray
    Write-Host "📂 Type: $Type" -ForegroundColor Gray
    if (-not $SkipBackup) {
        Write-Host "💾 Backup: $BACKUP_DIR\$(Split-Path $TARGET -Leaf)_$TIMESTAMP" -ForegroundColor Gray
    }
    Write-Host "📋 Log: $LOGS_DIR\drop_generated.log" -ForegroundColor Gray
    
    # Show next steps
    Write-Host "`n📝 Next Steps:" -ForegroundColor Cyan
    if (-not $NodeProcesses) {
        Write-Host "   1. Start server: npm run dev" -ForegroundColor White
        Write-Host "   2. Open browser: http://localhost:3000" -ForegroundColor White
    } else {
        Write-Host "   1. Check browser for updates: http://localhost:3000" -ForegroundColor White
    }
    if (-not $Deploy) {
        Write-Host "   2. Deploy when ready: .\scripts\drop_generated.ps1 `"$GeneratedPath`" -Deploy" -ForegroundColor White
    }
    
} catch {
    Write-Log "ERROR: $($_.Exception.Message)" "ERROR"
    Write-Host "❌ Code drop failed! Check logs for details." -ForegroundColor Red
    exit 1
}

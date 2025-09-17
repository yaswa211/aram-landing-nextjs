# restart_server.ps1
# PowerShell script to restart the Node.js Express server
# Usage: .\scripts\restart_server.ps1 [-Port 3000] [-Force] [-Background]

param(
    [Parameter(Mandatory=$false)]
    [int]$Port = 3000,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Background = $false,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("dev", "prod", "start")]
    [string]$Mode = "dev"
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
    Add-Content -Path "$LOGS_DIR\server.log" -Value $LogMessage
}

Write-Log "Starting Node.js server restart process..."

try {
    # Kill existing Node.js processes if Force is specified or if we detect conflicts
    $ExistingProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { 
        $_.CommandLine -like "*server.js*" -or $_.CommandLine -like "*nodemon*" 
    }
    
    if ($ExistingProcesses -or $Force) {
        Write-Log "Checking for existing Node.js server processes..."
        
        if ($ExistingProcesses) {
            Write-Log "Found $($ExistingProcesses.Count) existing Node.js server process(es)"
            $ExistingProcesses | ForEach-Object {
                Write-Log "Terminating process ID: $($_.Id) ($($_.ProcessName))"
                try {
                    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
                    Write-Log "Process $($_.Id) terminated successfully" "SUCCESS"
                } catch {
                    Write-Log "Failed to terminate process $($_.Id): $($_.Exception.Message)" "WARN"
                }
            }
            
            # Wait a moment for processes to fully terminate and ports to be released
            Write-Log "Waiting for processes to terminate and ports to be released..."
            Start-Sleep -Seconds 3
        } else {
            Write-Log "No existing Node.js server processes found"
        }
    }
    
    # Check if port is available
    try {
        $PortInUse = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        if ($PortInUse) {
            Write-Log "Port $Port is still in use by another process" "WARN"
            Write-Host "⚠️  Port $Port is busy. Options:" -ForegroundColor Yellow
            Write-Host "   - Wait a few seconds and try again" -ForegroundColor Yellow
            Write-Host "   - Use a different port: .\scripts\restart_server.ps1 -Port 3001" -ForegroundColor Yellow
            Write-Host "   - Force kill all processes: .\scripts\restart_server.ps1 -Force" -ForegroundColor Yellow
            
            if (-not $Force) {
                Write-Log "Port conflict detected and -Force not specified" "ERROR"
                exit 1
            }
        }
    } catch {
        # Get-NetTCPConnection may not work on all systems
        Write-Log "Could not check port status (may not be supported on this system)" "WARN"
    }
    
    # Verify package.json exists
    if (-not (Test-Path "package.json")) {
        Write-Log "ERROR: package.json not found in current directory" "ERROR"
        Write-Host "❌ Make sure you're in the project root directory" -ForegroundColor Red
        Write-Host "📂 Current directory: $(Get-Location)" -ForegroundColor Gray
        exit 1
    }
    
    # Install dependencies if node_modules doesn't exist
    if (-not (Test-Path "node_modules")) {
        Write-Log "node_modules not found - installing dependencies..."
        Write-Host "📦 Installing Node.js dependencies..." -ForegroundColor Blue
        & npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Log "ERROR: npm install failed" "ERROR"
            Write-Host "❌ Dependency installation failed" -ForegroundColor Red
            exit 1
        }
        Write-Log "Dependencies installed successfully" "SUCCESS"
    }
    
    # Set environment variables
    $env:PORT = $Port
    if ($Mode -eq "prod") {
        $env:NODE_ENV = "production"
    } else {
        $env:NODE_ENV = "development"
    }
    
    # Determine npm script to run
    $NpmScript = switch ($Mode) {
        "dev" { "dev" }
        "prod" { "prod" }
        "start" { "start" }
        default { "dev" }
    }
    
    # Start the server
    Write-Log "Starting Node.js server on port $Port in $Mode mode..."
    Write-Host "🚀 Starting Node.js Express server..." -ForegroundColor Green
    Write-Host "🌐 Server will be available at: http://localhost:$Port" -ForegroundColor Cyan
    Write-Host "📝 Logs: $LOGS_DIR\server.log" -ForegroundColor Gray
    Write-Host "🔄 Mode: $Mode ($NpmScript script)" -ForegroundColor Magenta
    
    if ($Background) {
        # Start in background using PowerShell Job
        Write-Host "🔙 Starting server in background..." -ForegroundColor Yellow
        
        $Job = Start-Job -ScriptBlock {
            param($Port, $LogPath, $Script, $ProjectPath)
            Set-Location $ProjectPath
            $env:PORT = $Port
            & npm run $Script 2>&1 | Tee-Object -FilePath $LogPath -Append
        } -ArgumentList $Port, "$LOGS_DIR\server.log", $NpmScript, (Get-Location).Path
        
        Write-Log "Server started in background (Job ID: $($Job.Id))" "SUCCESS"
        Write-Host "✅ Server running in background" -ForegroundColor Green
        Write-Host "📋 Check job status: Get-Job -Id $($Job.Id)" -ForegroundColor Gray
        Write-Host "📄 View job output: Receive-Job -Id $($Job.Id)" -ForegroundColor Gray
        Write-Host "⏹️  Stop server: Stop-Job -Id $($Job.Id); Remove-Job -Id $($Job.Id)" -ForegroundColor Gray
        
        # Wait a moment to check if the job started successfully
        Start-Sleep -Seconds 2
        $JobState = (Get-Job -Id $Job.Id).State
        Write-Log "Job state after 2 seconds: $JobState" "INFO"
        
        if ($JobState -eq "Failed") {
            Write-Log "Background job failed to start" "ERROR"
            Receive-Job -Id $Job.Id
            Remove-Job -Id $Job.Id
            exit 1
        }
        
    } else {
        # Start in foreground
        Write-Host "⏹️  Press Ctrl+C to stop the server" -ForegroundColor Yellow
        Write-Host ""
        
        Write-Log "Starting server in foreground with npm run $NpmScript..."
        
        # Use Tee-Object to log output while displaying it
        & npm run $NpmScript 2>&1 | Tee-Object -FilePath "$LOGS_DIR\server.log" -Append
        
        # This will only be reached if the server stops
        Write-Log "Server process ended" "INFO"
    }
    
} catch {
    Write-Log "ERROR: $($_.Exception.Message)" "ERROR"
    Write-Host "❌ Failed to restart server! Check logs for details." -ForegroundColor Red
    Write-Host "📋 Log file: $LOGS_DIR\server.log" -ForegroundColor Gray
    
    # Show common troubleshooting steps
    Write-Host "`n🔧 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Check if port $Port is already in use" -ForegroundColor White
    Write-Host "   2. Try with -Force flag to kill existing processes" -ForegroundColor White
    Write-Host "   3. Try a different port: -Port 3001" -ForegroundColor White
    Write-Host "   4. Check package.json exists in current directory" -ForegroundColor White
    
    exit 1
}

Write-Log "Server restart script completed"

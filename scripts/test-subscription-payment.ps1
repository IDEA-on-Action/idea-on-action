# =====================================================
# Subscription Payment Edge Function Test Script (PowerShell)
# =====================================================
# Description: 구독 자동 결제 Edge Function 로컬 테스트 스크립트
# Usage: .\scripts\test-subscription-payment.ps1 [-Env local|prod]
# =====================================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("local", "prod")]
    [string]$Env = "local"
)

# Colors
function Write-ColorOutput {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Message,
        [Parameter(Mandatory=$false)]
        [ValidateSet("Green", "Red", "Yellow", "White")]
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Configuration
if ($Env -eq "local") {
    $Url = "http://localhost:54321/functions/v1/process-subscription-payments"
    Write-ColorOutput "Testing LOCAL Edge Function..." -Color Yellow
} else {
    $Url = "https://zykjdneewbzyazfukzyg.supabase.co/functions/v1/process-subscription-payments"
    Write-ColorOutput "Testing PRODUCTION Edge Function..." -Color Yellow
}

# Get ANON_KEY from environment
$AnonKey = $env:SUPABASE_ANON_KEY
if (-not $AnonKey) {
    $AnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
    Write-ColorOutput "Using demo ANON_KEY (set SUPABASE_ANON_KEY env var for custom key)" -Color Yellow
}

Write-ColorOutput "URL: $Url" -Color Yellow
Write-Host ""

# Call Edge Function
Write-ColorOutput "Calling Edge Function..." -Color Yellow

try {
    $Headers = @{
        "Authorization" = "Bearer $AnonKey"
        "Content-Type" = "application/json"
    }

    $Response = Invoke-RestMethod -Uri $Url -Method Post -Headers $Headers -Body '{}' -StatusCodeVariable StatusCode

    Write-Host ""
    Write-ColorOutput "Response:" -Color Yellow
    $Response | ConvertTo-Json -Depth 10

    Write-Host ""
    if ($StatusCode -eq 200) {
        Write-ColorOutput "✅ Success! HTTP $StatusCode" -Color Green

        # Parse results
        $Processed = $Response.processed
        if ($null -eq $Processed) { $Processed = 0 }

        Write-ColorOutput "Processed subscriptions: $Processed" -Color Green

        if ($Processed -gt 0) {
            Write-ColorOutput "Results:" -Color Yellow
            foreach ($result in $Response.results) {
                Write-Host "  - Subscription $($result.id): $($result.status)"
            }
        }
    }
} catch {
    $StatusCode = $_.Exception.Response.StatusCode.value__
    Write-Host ""
    Write-ColorOutput "❌ Failed! HTTP $StatusCode" -Color Red
    Write-ColorOutput "Error: $($_.Exception.Message)" -Color Red
    exit 1
}

Write-Host ""
Write-ColorOutput "Next steps:" -Color Yellow
Write-Host "1. Check logs: supabase functions logs process-subscription-payments"
Write-Host "2. Query payments: SELECT * FROM subscription_payments ORDER BY created_at DESC LIMIT 5;"
Write-Host "3. Check activity logs: SELECT * FROM activity_logs WHERE entity_type = 'subscription' ORDER BY created_at DESC LIMIT 5;"

#!/bin/bash

# =====================================================
# Subscription Payment Edge Function Test Script
# =====================================================
# Description: 구독 자동 결제 Edge Function 로컬 테스트 스크립트
# Usage: ./scripts/test-subscription-payment.sh [local|prod]
# =====================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default to local
ENV=${1:-local}

if [ "$ENV" = "local" ]; then
  URL="http://localhost:54321/functions/v1/process-subscription-payments"
  echo -e "${YELLOW}Testing LOCAL Edge Function...${NC}"
elif [ "$ENV" = "prod" ]; then
  URL="https://zykjdneewbzyazfukzyg.supabase.co/functions/v1/process-subscription-payments"
  echo -e "${YELLOW}Testing PRODUCTION Edge Function...${NC}"
else
  echo -e "${RED}Invalid environment. Use: local or prod${NC}"
  exit 1
fi

# Get ANON_KEY from environment
ANON_KEY=${SUPABASE_ANON_KEY:-"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"}

echo -e "${YELLOW}URL: ${URL}${NC}"
echo ""

# Call Edge Function
echo -e "${YELLOW}Calling Edge Function...${NC}"
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  --location --request POST "${URL}" \
  --header "Authorization: Bearer ${ANON_KEY}" \
  --header "Content-Type: application/json" \
  --data '{}')

# Extract HTTP code and body
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

echo ""
echo -e "${YELLOW}Response:${NC}"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"

echo ""
if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ Success! HTTP ${HTTP_CODE}${NC}"

  # Parse results
  PROCESSED=$(echo "$BODY" | jq -r '.processed // 0' 2>/dev/null)
  echo -e "${GREEN}Processed subscriptions: ${PROCESSED}${NC}"

  if [ "$PROCESSED" -gt 0 ]; then
    echo -e "${YELLOW}Results:${NC}"
    echo "$BODY" | jq -r '.results[] | "  - Subscription \(.id): \(.status)"' 2>/dev/null
  fi
else
  echo -e "${RED}❌ Failed! HTTP ${HTTP_CODE}${NC}"
  exit 1
fi

echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Check logs: supabase functions logs process-subscription-payments"
echo "2. Query payments: SELECT * FROM subscription_payments ORDER BY created_at DESC LIMIT 5;"
echo "3. Check activity logs: SELECT * FROM activity_logs WHERE entity_type = 'subscription' ORDER BY created_at DESC LIMIT 5;"

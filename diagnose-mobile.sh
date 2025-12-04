#!/bin/bash

echo "========================================="
echo "🔍 Mobile Connection Diagnostic Tool"
echo "========================================="
echo ""

# Get computer IP
echo "📍 Your Computer's IP Address:"
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    IP=$(ipconfig getifaddr en0 2>/dev/null)
    if [ -z "$IP" ]; then
        IP=$(ipconfig getifaddr en1 2>/dev/null)
    fi
    echo "   $IP"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    IP=$(hostname -I | awk '{print $1}')
    echo "   $IP"
else
    echo "   Run 'ipconfig' on Windows to find your IPv4 address"
fi

echo ""
echo "========================================="
echo "✅ Checklist:"
echo "========================================="
echo ""

# Check if backend is running
echo "1. Backend Server Status:"
if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null ; then
    echo "   ✅ Backend is running on port 5001"
else
    echo "   ❌ Backend is NOT running on port 5001"
    echo "      → Run: cd backend && npm run dev"
fi

echo ""
echo "2. Update These Files:"
echo "   📄 admin/app/login.tsx (line 11)"
echo "   📄 admin/app/register.tsx (line 8)"
echo "   "
echo "   Change:"
echo "   return 'http://192.168.1.39:5001/api';"
echo "   "
echo "   To:"
echo "   return 'http://$IP:5001/api';"

echo ""
echo "3. WiFi Network:"
echo "   ⚠️  Ensure your mobile device and computer are on the SAME WiFi network"

echo ""
echo "4. Test Backend Connection:"
echo "   📱 Open this URL in your phone's browser:"
echo "   http://$IP:5001/api"
echo "   "
echo "   If you see a response, backend is reachable!"

echo ""
echo "========================================="
echo "🔧 Quick Fix Commands:"
echo "========================================="
echo ""
echo "# 1. Stop backend if running"
echo "pkill -f 'node.*backend'"
echo ""
echo "# 2. Start backend"
echo "cd /Users/patelpulseventures/Documents/rohit/samajwaditechforce-admin/backend && npm run dev"
echo ""
echo "# 3. In another terminal, restart admin app"
echo "cd /Users/patelpulseventures/Documents/rohit/samajwaditechforce-admin/admin && npm start"
echo ""
echo "========================================="

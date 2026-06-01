#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Scalable API Setup${NC}\n"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js is installed${NC}"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm is installed${NC}\n"

# Setup Backend
echo -e "${YELLOW}Setting up Backend...${NC}"
cd backend
cp .env.example .env
npm install
echo -e "${GREEN}✓ Backend setup complete${NC}\n"

# Setup Frontend
echo -e "${YELLOW}Setting up Frontend...${NC}"
cd ../frontend
cp .env.example .env
npm install
echo -e "${GREEN}✓ Frontend setup complete${NC}\n"

echo -e "${GREEN}✓ Setup complete!${NC}\n"
echo -e "${YELLOW}To start the application:${NC}"
echo -e "  1. Terminal 1 (MongoDB): mongod"
echo -e "  2. Terminal 2 (Backend): cd backend && npm run dev"
echo -e "  3. Terminal 3 (Frontend): cd frontend && npm start\n"
echo -e "Or use Docker: docker-compose up -d"

# Operator Dashboard

Internal web UI for managing the 30-Day Content Jumpstart content generation workflow.

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

Visit `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Configuration

### Development (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_USE_MOCKS=true
```

### Production
Set these environment variables in your Netlify dashboard:
```env
VITE_API_URL=https://your-api-domain.com
VITE_WS_URL=wss://your-api-domain.com
VITE_USE_MOCKS=false
```

## Deployment

### Netlify Deployment (Recommended)

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.**

Quick deploy:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
npm run deploy:preview  # For preview
npm run deploy           # For production
```

### Manual Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider

## Features

- **Project Management** - Create and manage client projects
- **Generation Wizard** - Multi-step content generation workflow
- **Quality Assurance** - Automated post validation and regeneration
- **Deliverable Management** - Track and deliver completed content
- **Research Tools** - Optional research add-ons integration

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **State Management:** Zustand + React Query
- **Routing:** React Router v7
- **HTTP Client:** Axios

## Project Structure

```
operator-dashboard/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── lib/             # Utilities and helpers
│   ├── types/           # TypeScript type definitions
│   └── api/             # API client and endpoints
├── public/              # Static assets
│   └── _redirects       # Netlify redirect rules
├── netlify.toml         # Netlify configuration
└── vite.config.ts       # Vite configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Build with production mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run deploy:preview` - Deploy to Netlify preview
- `npm run deploy` - Deploy to Netlify production

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Prefer composition over inheritance
- Keep components small and focused

### Testing
```bash
npm run test
```

### Linting
```bash
npm run lint
```

## Backend Integration

The dashboard expects a FastAPI backend at the URL specified in `VITE_API_URL`.

**Expected API Endpoints:**
- `POST /api/generator/generate-all` - Generate posts
- `POST /api/generator/regenerate` - Regenerate specific posts
- `POST /api/qa/validate` - Validate quality
- `GET /api/projects` - List projects
- `GET /api/deliverables` - List deliverables

See `../backend/` for backend implementation.

## Troubleshooting

### Build Issues
- Ensure Node.js version 20+
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite && npm run dev`

### Routing Issues
- Verify `_redirects` file exists in `public/`
- Check `netlify.toml` configuration

### API Connection
- Verify `VITE_API_URL` is set correctly
- Check CORS settings on backend
- Ensure backend is running and accessible

## Documentation

- **Complete Guide:** [OPERATOR_DASHBOARD.md](../OPERATOR_DASHBOARD.md)
- **Deployment:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Setup Guide:** [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Implementation Plan:** [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)

## License

MIT

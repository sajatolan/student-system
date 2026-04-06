# Deployment Model
## Student Management System

### Platform Choice: Render Cloud (PaaS)

### Architecture Overview
User Browser → Render CDN → Web Service (Node.js) → JSON File Storage
                                              ↓
                                        Authentication
                                        (Session-based)

### Deployment Type: Continuous Deployment (CI/CD)

### CI/CD Pipeline
| Stage | Tool | Action |
|-------|------|--------|
| Code Push | GitHub | Developer pushes to main branch |
| Build | Render | npm install |
| Test | Render | Automatic health check |
| Deploy | Render | node index.js |

### Deployment Configuration
Service Type: Web Service
Runtime: Node.js 22.22.0
Build Command: npm install
Start Command: node index.js
Branch: main
Auto-Deploy: Enabled

### Environment Variables
| Variable | Purpose |
|----------|---------|
| PORT | Server port (default: 3000) |
| SESSION_SECRET | Session encryption key |

### Scaling Strategy
- Type: Automatic horizontal scaling
- Trigger: CPU > 70% or Memory > 80%
- Min Instances: 1 (free tier)
- Max Instances: 3 (paid tier)

### Environment Strategy
- Development: Local machine (Windows)
- Production: Render cloud platform

### Rollback Strategy
- Automatic rollback on failed health check
- Manual rollback: Revert to previous Git commit

### Data Persistence
- Current: JSON files (students.json, users.json)
- Storage Type: Ephemeral (Render disk)
- Note: Data persists between deploys on free tier
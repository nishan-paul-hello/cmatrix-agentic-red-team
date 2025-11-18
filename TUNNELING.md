# Cloudflare Tunnel Setup Guide

This guide shows you how to expose your CMatrix application to the internet using Cloudflare Tunnel.

### 1. Install Cloudflared

If you don't have `cloudflared` installed:

```bash
# Download the latest version
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Install it
sudo dpkg -i cloudflared-linux-amd64.deb

# Verify installation
cloudflared --version
```

### 2. Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

This will:
- Open a browser window
- Ask you to log in to Cloudflare
- Let you select a domain
- Save credentials to `~/.cloudflared/cert.pem`

### 3. Create a Named Tunnel

```bash
# Create a tunnel named "cmatrix"
cloudflared tunnel create cmatrix

# This creates a tunnel ID and credentials file
# Location: ~/.cloudflared/<TUNNEL-ID>.json
```

### 4. Configure the Tunnel

Create a config file at `~/.cloudflared/config.yml`:

```yaml
tunnel: <TUNNEL-ID>
credentials-file: /home/<YOUR-USERNAME>/.cloudflared/<TUNNEL-ID>.json

ingress:
  - hostname: cmatrix.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404
```

Replace:
- `<TUNNEL-ID>` with your actual tunnel ID
- `<YOUR-USERNAME>` with your Linux username
- `cmatrix.yourdomain.com` with your desired subdomain

### 5. Create DNS Record

```bash
cloudflared tunnel route dns cmatrix cmatrix.yourdomain.com
```

This creates a CNAME record pointing to your tunnel.

### 6. Run the Tunnel

```bash
cloudflared tunnel run cmatrix
```

Or run it in the background:

```bash
cloudflared tunnel run cmatrix &
```

### 7. Install as a Service (Optional)

To run the tunnel automatically on system startup:

```bash
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

---

## Running Your App with Tunnel

### Option 1: Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
./dev.sh
```

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm dev
```

**Terminal 3 - Tunnel:**
```bash
./cloudflared tunnel --url http://localhost:3000
```

### Option 2: Using tmux/screen

```bash
# Start tmux
tmux

# Window 1: Backend
cd backend && ./dev.sh

# Create new window (Ctrl+B, C)
cd frontend && pnpm dev

# Create new window (Ctrl+B, C)
./cloudflared tunnel --url http://localhost:3000

# Detach from tmux (Ctrl+B, D)
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or port 8000
lsof -ti:8000 | xargs kill -9
```

### Tunnel Connection Issues
```bash
# Check if cloudflared is running
ps aux | grep cloudflared

# Check tunnel status
cloudflared tunnel info cmatrix

# View tunnel logs
cloudflared tunnel run cmatrix --loglevel debug
```

### CORS Issues
If you see CORS errors, make sure your backend allows the tunnel domain in CORS settings.

---

## Security Notes

1. **Don't commit** `cloudflared` binary or `.deb` files to git
2. **Don't commit** tunnel credentials (`~/.cloudflared/*.json`)
3. **Use environment variables** for sensitive configuration
4. **Enable authentication** on your Cloudflare dashboard for production
5. **Monitor access logs** in `audit_logs/` directory

---

## Useful Commands

```bash
# List all tunnels
cloudflared tunnel list

# Delete a tunnel
cloudflared tunnel delete cmatrix

# View tunnel info
cloudflared tunnel info cmatrix

# Update cloudflared
sudo cloudflared update
```

---

## Resources

- [Cloudflare Tunnel Documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [Cloudflared GitHub](https://github.com/cloudflare/cloudflared)

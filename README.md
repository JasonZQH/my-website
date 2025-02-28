# Next.js + Express Deployment Guide (Amazon Lightsail)

This document details how to create and test a full-stack project with a Next.js front-end and an Express back-end locally, and then deploy it on Amazon Lightsail. It covers server creation and connection, MongoDB setup (optional), code deployment (using rsync), Nginx configuration, PM2 process management, and HTTPS certificate setup.

---

## Table of Contents

1. [Local Development and Testing](#local-development-and-testing)
   - [Environment Setup](#environment-setup)
   - [Project Initialization](#project-initialization)
   - [Creating the Next.js Front-end](#creating-the-nextjs-front-end)
   - [Creating the Express Back-end](#creating-the-express-back-end)
   - [Local Testing](#local-testing)
2. [Preparing the Amazon Lightsail Server](#preparing-the-amazon-lightsail-server)
   - [Creating a Lightsail Instance](#creating-a-lightsail-instance)
   - [Configuring SSH Access](#configuring-ssh-access)
3. [Server Environment Setup](#server-environment-setup)
   - [Installing Node.js and npm](#installing-nodejs-and-npm)
   - [MongoDB Setup (Optional)](#mongodb-setup-optional)
4. [Nginx Configuration](#nginx-configuration)
   - [Installing Nginx](#installing-nginx)
   - [Reverse Proxy Setup](#reverse-proxy-setup)
   - [Testing and Restarting Nginx](#testing-and-restarting-nginx)
5. [HTTPS Certificate Setup (Certbot)](#https-certificate-setup-certbot)
6. [Using PM2 for Process Management](#using-pm2-for-process-management)
7. [Deployment and Update Process](#deployment-and-update-process)
   - [Local Build and Synchronization](#local-build-and-synchronization)
   - [Sample Automated Deployment Script](#sample-automated-deployment-script)
8. [Connecting to the domain](#connecting-to-the-domain)
9. [Common Issues and Troubleshooting](#common-issues-and-troubleshooting)

---

## 1. Local Development and Testing

### Environment Setup

- Install [Node.js](https://nodejs.org/) (LTS version recommended, e.g., 16.x or 18.x)
- Install npm or yarn
- Use your preferred code editor (e.g., VSCode)
- (Optional) Install MongoDB locally if you plan to test database connections

### Project Initialization

Run the following commands in your terminal:

```
mkdir personal-website
cd personal-website
npm init -y
```
### Creating the Next.js Front-end
`npm install next react react-dom`

Add following scripts in `package.json`:
```
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}
```

### Creating the Express Back-end
under app's folder:
`npm install express`

Example: server/index.js
```
const express = require('express');
const app = express();
const port = 4000;

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.listen(port, () => {
  console.log(`Express server listening on http://localhost:${port}`);
});
```
Add `"server": "node server/index.js"` in "scripts" in `package.json`.

### Local Testing
For Express back-end: `npm run server`

For Next.js front-end: `npm run dev`

## 2. Preparing the Amazon Lightsail Server

### Creating a Lightsail Instance
1. Login to Amazon Lightsail console
2. Click Create instance, choose Linux/Unix, and select an Ubuntu distribution.
3. Choose your instance plan, region, etc., and create the instance. Wait for it to start.
4. Go to Networking tab -> attach static ip address.
5. Add `HTTPS` and a Custom rule (port 300-3001) in both IPv4 and IPv6.

### Configuring ssh Access
1. Download the SSH private key (typically a .pem file, e.g., LightsailDefaultKey-us-west-2.pem) from the Lightsail console.
2. Place the file in your local ~/.ssh/ directory and update its permissions:
    `chmod 400 ~/.ssh/LightsailDefaultKey-us-west-2.pem` under the app's folder
3. Connect to the server (assuming the username is ubuntu; replace <Your-Lightsail-Public-IP> with your instance’s public IP): 
    `ssh -i ~/.ssh/LightsailDefaultKey-us-west-2.pem ubuntu@<Your-Lightsail-Public-IP>`

## 3. Server Environment Setup

### Installing Node.js and npm
After connect into online server:
```
 sudo apt update
 curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
 sudo bash nodesource_setup.sh
 sudo apt install nodejs
 node -v
 npm -v
```
### MongoDB Setup (Optional)
After you login to the MongoDB, ou can download under local folder.

## 4. Nginx Configuration

### Installing Nginx
```
 sudo apt update
 sudo apt install nginx ufw
 sudo ufw allow 'Nginx Full'
 sudo ufw allow 3001
 sudo ufw allow ssh
 sudo ufw enable
 sudo systemctl restart nginx
```
Check website at http://your_server_ip

### Reverse Proxy Setup
Edit `/etc/nginx/sites-available/default` in your online server:
```
sudo nano /etc/nginx/sites-available/default
```
Then, modify it to
```
server {
    listen 80;
    server_name your_domain;

    # Proxy to the Next.js front-end (running on port 3001)
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Proxy to the Express back-end (running on port 4000)
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
### Testing and Restarting Nginx
Test the Nginx configuration: `sudo nginx -t`
If there are no errors, restart Nginx: `sudo systemctl restart nginx`

## 5. HTTPS Certificate Setup (Certbot)
```
 sudo apt install certbot python3-certbot-nginx
 sudo certbot --nginx -d example.com -d www.example.com
 sudo systemctl status certbot.timer
 sudo certbot renew --dry-run
```
Test HTTPS by visiting `https://example.com` and `https://www.example.com` in your browser. 

## 6. Deployment and Update Process
Create a folder for your app in the server: `mkdir -p ~/apps/your_app`
Edit local **package.json**: 
```
"scripts": {
  "deploy": "npm run build && rsync --exclude=.git --exclude=node_modules -azP -e \"ssh -i ~/.ssh/LightsailDefaultKey-us-west-2.pem\" . ubuntu@<Your-Lightsail-Public-IP>:/home/ubuntu/apps/personal"
}
```

Make sure your .env include all your neccesary keys, for example:
```
   MONGODB_URI=mongodb+srv://user:pass@cluster0.vczzh.mongodb.net/dbname?retryWrites=true&w=majority

   NEXT_PUBLIC_APP_URL=http://your_server_ip:3001/
   NEXTAUTH_URL=http://your_server_ip:3001/
   NEXTAUTH_SECRET=somethingsecret
```

## 7. Using pm2 for Process Management
Located at /home/ubuntu/apps/your_app:
```
    cd /home/ubuntu/apps/personal`
    pm2 start npm --watch app --name "your_app" -- start --  -p 3001
```
Check: `pm2 list`
### Local Build and Synchronization 
`npm run build`
`npm run dev`

### Sample Automated Deployment Script
`npm run deploy`

## 8. Connecting to the Domain
1. login to dns management of the domain
2. add A record to the domain or subdomain (example.com) pointing to your_server_ip
3. If it is not subdomain, also An A record with www.example.com pointing to your_server_ip.

## 9. Common Issues and Troubleshooting
- Nginx Configuration Errors
    - Use sudo nginx -t to verify your configuration.
    - Ensure that all curly braces are correctly paired and directives are correct.
- Certbot Certificate Issues
    - Make sure your Nginx configuration is error-free and HTTP traffic is accessible for domain verification.
    - Verify that your DNS records point to the correct Lightsail instance IP.
- PM2 Process Not Starting or Restarting
    - Check your processes with `pm2 list` and `pm2 status`.
    - Ensure that the Node.js environment is correctly configured on the server.

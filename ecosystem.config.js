// pm2 ecosystem config for HerCare Hub backend on Hostinger VPS
module.exports = {
    apps: [
        {
            name: 'hercarehub-backend',
            script: 'server.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '512M',
            env_production: {
                NODE_ENV: 'production',
                PORT: 5000,
            },
        },
    ],
};

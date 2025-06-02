export function getSwaggerServersForEnvironment(env: string) {
    const servers: string[] = [];
    if (env === 'production') {
        servers.push('https://cracy.jimber.io');
    } else if (env === 'staging') {
        servers.push('https://cracy.staging.jimber.io');
    } else if (env === 'testing') {
        servers.push('https://cracy.testing.jimber.io');
    } else {
        servers.push('http://localhost:4000');
        servers.push('http://localhost:4001');
    }
    return servers;
}

const testEnv = {
    PORT: '3000',
    JWT_SECRET: '3281d64d71abcf40e862001e6a5e7c58',
    DATABASE_URL: 'postgres://e8bed05cd93c359caffde0b1cfd7893d083ff43a33fd823541a1cd64a06166ca:sk_RPYM96bNxVZdYSnR1eImN@pooled.db.prisma.io:5432/postgres?sslmode=verify-full',
    FRONT_END_URL: 'http://localhost:5173',
    GEMINI_API_KEY: 'AQ.Ab8RN6K77Z4J9e7IUQ2G2o0_Fv0QP819l7t2jLeLK79k4wFBbg',
} as const

for (const [key, value] of Object.entries(testEnv)) {
    process.env[key] = value
}

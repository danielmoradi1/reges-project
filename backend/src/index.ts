import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import trainRoutes from './routes/trains.js'

const fastify = Fastify({ logger: true })

// Tillåt Cors / anrop från frontend port 5173
fastify.register(cors, { origin: 'http://localhost:5173' })

// registrera train routes
fastify.register(trainRoutes, { prefix: '/api' })

// Kontrollera att servern är igång
fastify.get('/health', async () => {
  return { status: 'ok' }
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log('Servern kör på http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
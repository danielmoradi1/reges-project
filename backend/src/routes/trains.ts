import type { FastifyInstance } from 'fastify'

// URL for Trafikverket API
const TRAFIKVERKET_API_URL = 'https://api.trafikinfo.trafikverket.se/v2/data.json'
// API KEY for Trafikverket API
const API_KEY = process.env.TRAFIKVERKET_API_KEY

// Funktionen bygger XML-förfrågan, tar emot ett datum som parameneter
function buildQuery(date: string): string {
    return `<REQUEST>
    <LOGIN authenticationkey="${API_KEY}"/>
    <QUERY objecttype="TrainAnnouncement" schemaversion="1.9" limit="10" orderby="ModifiedTime ASC">
      <FILTER>
        <EQ name="DepartureDateOTN" value="${date}" />
        <EQ name="Advertised" value="true"/>
      </FILTER>
    </QUERY>
    </REQUEST>`
}

export default async function trainRoutes(fastify: FastifyInstance) {

    //SÖker på tåg för ett specifikt datum
    // OM inget datum anges, används dagens datum automatiskt

    fastify.get('/trains', async (request, reply) => {
        // om inget datum?
        console.log('API_KEY:', API_KEY)
        const today = new Date().toISOString().split('T')[0]
        const { date: searchDate = today } = request.query as { date?: string }

        try {
            // anropa API:et
            const response = await fetch(TRAFIKVERKET_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/xml'
                },
                body: buildQuery(searchDate)
            })

            // om anropet misslyckas -> returnera 500
            if (!response.ok) {
                const errorText = await response.text()
                console.log('Status:', response.status)
                console.log('Svar från Trafikverket:', errorText)

                return reply.status(500).send({
                    error: 'Failed to fetch data from API',
                    status: response.status,
                    details: errorText
                })
            }

            // annars, omvandla svaret till JSON
            const data = await response.json()
            // Tåglistan nästlade svar
            const trains = data.RESPONSE.RESULT[0].TrainAnnouncement

            // skicka tillbaka datum med listan med tåg
            return {
                date: searchDate,
                count: trains.length,
                trains
            }
        } catch (error) {
            return reply.status(500).send({ error: 'An error occurred while fetching data' })
        }
    })
}
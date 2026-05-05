import type { b } from "vue-router/dist/index-D_VEAp3P.js";

// URL for the backend API
const API_URL = 'http://localhost:3000/api';

export interface Location {
    LocationName: string
    Priority: number 
    Order: number
}


export interface Train {
    ActivityId: string
    ActivityType: string
    Advertised: boolean
    AdvertisedTimeAtLocation: string
    AdvertisedTrainIdent: string // tågnummer 7151
    Canceled: boolean
    Deleted: boolean
    FromLocation: Location[]
    ToLocation: Location[]
    ViaToLocation: Location[]
    LocationSignature: string // stationskod t.ex. "Sjka"
    InformationOwner: string
    Operator: string
    TrainOwer: string // tågägare
    TrackAtLocation: string // spårnummer
    ModifiedTime: string
}


// funktioen som hämtar alla tåg från backend 
export async function fetchTrains(date: string): Promise<Train[]> {
    const response = await fetch(`${API_URL}/trains?date=${date}`)

    if (!response.ok){
        throw new Error('Failed to fetch trains')
    }

    // svar som kommer från backend är rå text
    const data = await response.json()
    // returnerar bara listan av tåg
    return data.trains
}
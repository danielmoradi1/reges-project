<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {fetchTrains, type Train} from '../services/trainService'

// Dagens datum
const today = new Date().toISOString().split('T')[0]

// Reaktiva variabler
const trains = ref<Train[]>([])
const date = ref(today)
const loading = ref(false)
const error = ref('')

// hämta tåg från backend api
async function loadTrains() {
  loading.value = true
  error.value=''

  try{
    trains.value = await fetchTrains(date.value)
  } catch (err){
    error.value = 'Kunde inte hämta tågdata. Försök igen senare.'
  } finally {
    loading.value = false
  }
}

// kör automatiskt när kompoenten laddas ´
onMounted(() => loadTrains())
</script>

<template>
  <main>
    <h1>Tåginformation</h1>

    <!-- DatumVäljare - när datum ändras anropas loadTrains -->
    <div>
      <label for="date">Välj datum:</label>
      <input type="date" id="date" v-model="date" @change="loadTrains" />
    </div>

    <!-- Visas medan data hämtas -->
    <p v-if="error">{{ error }}</p>

    <!-- Tabellen vissas när datan har hämtats -->
    <table v-else>
      <thead>
        <tr>
          <th>Tågnummer</th>
          <th>Från</th>
          <th>Till</th>
          <th>Station</th>
          <th>Avgångstid</th>
          <th>Inställd</th>
          <th>Operatör</th>
          <th>Spår</th>
        </tr>
      </thead>

      <tbody>
        <!-- v-for loopar igenom alla tåg och skapar en rad per tåg -->
        <!-- :key hjälper Vue hålla koll på varje unik rad -->

        <tr v-for="train in trains" :key="train.ActivityId">
          <!-- Tågnummer -->
          <td>{{ train.AdvertisedTrainIdent }}</td>

          <!-- Från-station, ?. betyder "om det finns" annars '-' -->
          <td>{{ train.FromLocation?.[0]?.LocationName ?? "-" }}</td>

          <!-- Till-station -->
          <td>{{ train.ToLocation?.[0]?.LocationName ?? "-" }}</td>

          <!-- Stationskod -->
          <td>{{ train.LocationSignature }}</td>

          <!-- Avgångstid – omvandlas till läsbart format t.ex. 06:11:00 -->
          <td>
            {{ new Date(train.AdvertisedTimeAtLocation).toLocaleTimeString("sv-SE") }}
          </td>

          <!-- Inställd – true/false omvandlas till Ja/Nej -->
          <td>{{ train.Canceled ? "Ja" : "Nej" }}</td>

          <!-- Operatör -->
          <td>{{ train.Operator }}</td>

          <!-- Spårnummer -->
          <td>{{ train.TrackAtLocation }}</td>
        </tr>
      </tbody>
    </table>

    <!-- visas om inga tåg hittas -->
    <p v-if="!loading && trains.length === 0">Inga tåg hittades för det datum</p>
  </main>
</template>

<script setup lang = "ts">
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



</script>

<template>
  <main>
  <h1>Trafikverket</h1>
  </main>
</template>

<script setup lang="ts">
import Chart from 'chart.js/auto';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  times: string[]
  temps: number[]
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

// "2026-10-27T15:00" -> "15:00"
function labels() {
  return props.times.map((t) => t.slice(11, 16))
}

onMounted(() => {
  if (!canvas.value) return

  chart = new Chart(canvas.value, {
    type: 'line',
    data: {
      labels: labels(),
      datasets: [
        {
          label: 'Temperatura (°C)',
          data: [...props.temps],
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          fill: true,
          tension: 0.35,
          pointRadius: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#94a3b8', maxTicksLimit: 8 }, grid: { display: false } },
        y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.15)' } },
      },
    },
  })
})

// Cuando cambia la ciudad, actualiza el gráfico
watch(
  () => [props.times, props.temps],
  () => {
    if (!chart) return
    chart.data.labels = labels()
    chart.data.datasets[0]!.data = [...props.temps]
    chart.update()
  },
)

onBeforeUnmount(() => chart?.destroy())
</script>

<template>
  <div class="h-64 w-full">
    <canvas
      ref="canvas"
      role="img"
      aria-label="Gráfico de temperatura de las próximas 24 horas"
    ></canvas>
  </div>
</template>
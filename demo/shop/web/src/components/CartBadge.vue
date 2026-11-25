<template>
  <span class="badge">{{ label }}</span>
</template>
<script setup>
import { computed } from 'vue'
import { formatCount } from '../format.js'
const props = defineProps({ n: Number })
const label = computed(() => formatCount(props.n))
</script>

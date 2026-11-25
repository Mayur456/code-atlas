<template>
  <header><CartBadge :n="3" /></header>
</template>
<script setup>
import CartBadge from './components/CartBadge.vue'
function greet(name) {
  return 'hi ' + name
}
greet('shop')
</script>

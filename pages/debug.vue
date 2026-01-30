<script setup lang="ts">
const config = useRuntimeConfig()
const { layoutConfig, isSlotEnabled, getSlotComponent } = useLayout()
</script>

<template>
  <div style="padding: 20px; background: #333; color: #fff;">
    <h1>Debug Layout Config</h1>
    
    <h2>Raw runtimeConfig.public</h2>
    <pre>{{ JSON.stringify({
      layoutHomeTop: config.public.layoutHomeTop,
      layoutHomeLeft: config.public.layoutHomeLeft,
      layoutHomeCenter: config.public.layoutHomeCenter,
      layoutHomeRight: config.public.layoutHomeRight,
      layoutHomeBottom: config.public.layoutHomeBottom,
    }, null, 2) }}</pre>
    
    <h2>Parsed layoutConfig</h2>
    <pre>{{ JSON.stringify(layoutConfig, null, 2) }}</pre>
    
    <h2>isSlotEnabled</h2>
    <ul>
      <li>home.top: {{ isSlotEnabled('home', 'top') }}</li>
      <li>home.left: {{ isSlotEnabled('home', 'left') }}</li>
      <li>home.center: {{ isSlotEnabled('home', 'center') }}</li>
      <li>home.right: {{ isSlotEnabled('home', 'right') }}</li>
      <li>home.bottom: {{ isSlotEnabled('home', 'bottom') }}</li>
    </ul>
    
    <h2>getSlotComponent</h2>
    <ul>
      <li>home.top: {{ getSlotComponent('home', 'top') }}</li>
      <li>home.left: {{ getSlotComponent('home', 'left') }}</li>
      <li>home.center: {{ getSlotComponent('home', 'center') }}</li>
      <li>home.right: {{ getSlotComponent('home', 'right') }}</li>
      <li>home.bottom: {{ getSlotComponent('home', 'bottom') }}</li>
    </ul>
  </div>
</template>

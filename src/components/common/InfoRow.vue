<template>
  <div class="flex flex-col gap-0.5">
    <span class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">{{ label }}</span>
    <slot>
      <span
        :class="[
          'text-sm text-gray-800 dark:text-white',
          mono ? 'font-mono' : 'font-medium'
        ]"
      >
        {{ value }}
      </span>
    </slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value?: string | number;
  mono?: boolean;
}>();
</script>
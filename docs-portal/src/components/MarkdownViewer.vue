<template>
  <div class="markdown-body p-6 rounded-2xl bg-slate-900/60 border border-slate-800" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  content: string;
}>();

const parseMarkdown = (md: string): string => {
  if (!md) return '';
  return md
    .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-slate-200 mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-slate-100 mt-5 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-xl font-extrabold text-blue-400 mt-6 mb-4 pb-2 border-b border-slate-800">$1</h1>')
    .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 bg-blue-500/10 text-slate-300 rounded-r-lg my-3">$1</blockquote>')
    .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold text-slate-100">$1</strong>')
    .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
    .replace(/`([^`]+)`/gim, '<code class="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded text-xs">$1</code>')
    .replace(/\n\n/gim, '<br><br>');
};

const renderedContent = computed(() => {
  if (!props.content) return '<p class="text-slate-500 italic">No markdown content available.</p>';
  return parseMarkdown(props.content);
});
</script>

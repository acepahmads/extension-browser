<template>
  <div class="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-blue-500 selection:text-white">
    <!-- Top Navbar -->
    <Navbar />

    <div class="flex-1 flex overflow-hidden">
      <!-- Sticky Sidebar -->
      <Sidebar />

      <!-- Main View Area -->
      <main class="flex-1 overflow-y-auto p-6 md:p-8">
        <router-view />
      </main>
    </div>

    <!-- Search Modal Component -->
    <SearchModal />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue';
import SearchModal from '@/components/SearchModal.vue';
</script>

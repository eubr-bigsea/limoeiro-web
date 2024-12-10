<template>
  <!-- Toolbar -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-lemonade fixed-top ms-auto toolbar">
    <div class="container-fluid">
      <div class="text-left me-5 logo">
        <img class="logo" src="@/assets/lemonade_logo.svg" /><br />
        <span class="navbar-brand">Limoeiro</span>
      </div>
      <div class="">
        <!--
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link :to="{ name: 'home' }" class="nav-link"><Home /> Go to Home</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'about' }" class="nav-link"><Info /> Sobre</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'explore' }" class="nav-link"
              ><GlobeIcon /> Explore</router-link
            >
          </li>
        </ul>
      --></div>
      <div class="ms-auto">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="#"><Bell /></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"><UserCircle /></a>
          </li>
        </ul>
      </div>
      <div class="ms-auto">
        <input type="text" class="form-control form-control-sm" />
      </div>
    </div>
  </nav>
</template>
<script setup>
import { Bell, GlobeIcon, Home, Info, UserCircle } from 'lucide-vue-next'
</script>
<style scoped>
img.logo {
  -webkit-filter: invert(1);
  filter: invert(0.8);
  width: 100px;
  height: auto;
  margin: 0;
  padding: 0;
}
div.logo {
  line-height: 14px;
  text-align: center;
}
</style>

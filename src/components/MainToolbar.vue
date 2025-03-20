<template>
  <!-- Toolbar -->
  <nav class="navbar navbar-expand-lg navbar-dark xbg-lemonade fixed-top ms-auto toolbar">
    <div class="container-fluid">
      <div class="text-left me-5 logo">
        <img class="logo" src="@/assets/lemonade_logo.svg" alt="Lemonade" /><br />
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
        <!-- <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="#"><Bell /></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"><UserCircle /></a>
          </li>
        </ul> -->
      </div>
      <!-- <div class="ms-auto d-flex flex-nowrap align-items-center w-25">
        <div class="input-group">
          <input type="text" class="form-control form-control-sm shadow-none" />
          <span class="input-group-text p-0 px-3" role="button">
            <LucideSearch size="16" />Pesquisar
          </span>
        </div>
      </div> -->
    </div>
  </nav>
</template>
<script setup>
import { Bell, GlobeIcon, Home, Info, LucideSearch, UserCircle } from 'lucide-vue-next'
</script>
<style scoped>
img.logo {
  /* -webkit-filter: invert(1);
  filter: invert(0.8); */
  width: 180px;
  height: auto;
  margin: 0;
  padding: 0px 5px;
}
div.logo {
  line-height: 14px;
  text-align: center;
  padding-left: 0px;
}
.toolbar {
  z-index: 1000;
  background-color: #568f32;
  background-color: #235c00;
}
</style>

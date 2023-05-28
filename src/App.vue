<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<script lang="ts">
export default {
  methods: {
    getFriendlyRouteName(routeName:String | undefined) {
      switch (routeName)
      {
        case "config":
          return "CONFIGURATION";
        default:
          return "OVERVIEW";
      }
    }
  }
}
</script >

<template>
  <div class="header">
    <div class="navigation-container">
      <div class="navbar">
        <RouterLink to="/" class="navbar-item title-font-bold">OVERVIEW</RouterLink>
        <RouterLink to="/statistics" class="navbar-item title-font-bold">STATISTICS</RouterLink>
        <RouterLink to="/achievements" class="navbar-item title-font-bold">ACHIEVEMENTS</RouterLink>
        <RouterLink to="/cosmetics" class="navbar-item title-font-bold">COSTMETICS</RouterLink>
      </div>

      <div class="settings-gear-container">
        <RouterLink to="/config" class="settings-gear-background"><img src="src/assets/gear.svg"/></RouterLink>
      </div>
    </div>
  
    <div class="profile-header-container">
      <img class="player-icon" src="https://d15f34w2p8l1cc.cloudfront.net/overwatch/c3090e3a1dccc58f143ff53801bc0cecb139f0eb1278f157d0b5e29db9104bed.png"/>
      <h1 class="nameplate title-font-italic"> {{ getFriendlyRouteName($route.name?.toString()) }}</h1>
    </div>
  </div>

  <div class="view-content">
    <RouterView />
  </div>
</template>

<style scoped>
.view-content {
  padding-top: 2.5rem;
  margin-left: 3rem;
  display: flex;
}

.header {
  background-color: var(--color-header-background);
  padding-top: 2rem;
  
}

.navigation-container {
  display: flex;
  height: 4.15rem;
  margin-left: 3rem;
}

.profile-header-container {
  display: flex;
  height: 7rem;
  margin-top: 2rem;
  margin-left: 3rem;
}

.player-icon {
  width: 140px;
  height: 140px;
  border-radius: 5px;
  border: solid 5px white;
  margin-right: 2rem;
}

.nameplate {
  font-size: 4rem;
}

.navbar {
  display: inline-flex;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  background-color: var(--color-nav-background);
  border-radius: 5px;
  align-self: stretch;
}

.navbar-item {
  align-self: center;
  font-size: 1.75rem;
  text-decoration: none;
  padding-left: 1.8rem;
  padding-right: 1.8rem;
  margin-right: 0.1rem;
  margin-left: 0.1rem;
  border-radius: 5px;
  border: solid 2px transparent;
}

.navbar-item.router-link-active {
  background-color: var(--color-nav-selected);
  color: var(--color-nav-selected-text);
}

.navbar-item:not(.router-link-active):hover {
  background-color: var(--color-nav-hover);
  border-color: var(--color-nav-border);
  border-width: 2px;
  border-style: solid;
}

.settings-gear-container {
  align-self: flex-end;
  height: 100%;
  margin-left: auto;
  margin-right: 3rem;
  border: solid 2px transparent;
  border-radius: 5px;
}

.settings-gear-background {
  height: 100%;
  width: 4.15rem;
  display: flex;
  justify-content: center;
  background-color: var(--color-button-secondary);
  border-radius: 5px;
}

.settings-gear-container img {
  width: 70%;
  height: 70%;
  margin: auto;
  display: block;
  color: var(--color-primary-text);
}

.settings-gear-container:hover img {
  width: 75%;
  height: 75%;
}

.settings-gear-container:hover {
  border: solid 2px var(--color-primary-text);
}

.settings-link {
  display: inherit;
}


.settings-gear-background.router-link-active {
  background-color: transparent;
  border: solid 2px var(--color-primary-text);
}

</style>

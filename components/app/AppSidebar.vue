<!-- This file defines the application sidebar. -->
<!-- It should later include grouped navigation, quick filters, and scenario shortcuts. -->
<template>
  <aside class="surface-card app-sidebar">
    <h3>Workspace</h3>
    <ul>
      <li><NuxtLink to="/">Overview</NuxtLink></li>
      <li><NuxtLink to="/friends">Following</NuxtLink></li>
      <li><NuxtLink to="/wishlists">My Wishlists</NuxtLink></li>
      <li><NuxtLink to="/wishlists/create">Create Wishlist</NuxtLink></li>
      <li><NuxtLink to="/profile">Profile</NuxtLink></li>
    </ul>
  </aside>
</template>

<style scoped>
.app-sidebar ul {
  padding-left: 1rem;
  margin-bottom: 0;
}
</style>

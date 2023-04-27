<template>
  <sideBar/>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import SideBar from '@/components/admin/sideBar.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
    SideBar
  }
}
</script>

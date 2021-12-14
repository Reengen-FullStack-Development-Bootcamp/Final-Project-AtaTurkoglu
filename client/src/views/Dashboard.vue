<template>
  <div id="dashboard">
    <DataTable
      v-if="$store.state.datatable['factories']"
      :tableName="'Factories'"
      :data="factoriesData"
    />

    <DataTable
      v-if="$store.state.datatable['departments']"
      :tableName="'Departments'"
      :data="departmentsData"
    />
  </div>
</template>

<script>
import user from '@/store/modules/user.js';
import DataTable from '../components/tables/DataTable.vue';
export default {
  components: {
    DataTable,
  },
  beforeCreate() {
    if (!user.state.authenticated) {
      this.$router.push({ name: 'Home' });
    }
  },
  computed: {
    factoriesData() {
      return this.$store.state.datatable.factories;
    },
    departmentsData() {
      return this.$store.state.datatable.departments;
    },
  },
  created() {
    this.$store.dispatch('datatable/getAll', { tableName: 'departments' });
    this.$store.dispatch('datatable/getAll', { tableName: 'factories' });
  },
};
</script>

<style></style>

<template>
  <v-dialog
    v-model="$parent.$parent.dialogs.deleteRowDialogState"
    :width="
      $vuetify.breakpoint.lgAndUp
        ? '25%'
        : $vuetify.breakpoint.smAndDown
        ? '75%'
        : '50%'
    "
  >
    <v-card>
      <v-card-title>{{ $t('Delete Row') }}</v-card-title>
      <v-card-text class="mt-4">
        <strong class="mr-4">id= {{ id }}</strong>
        {{ $t('Are you sure to delete this row?') }}
      </v-card-text>
      <v-card-actions>
        <v-container>
          <v-row justify="end">
            <v-btn
              class="mx-2"
              text
              @click="$parent.$parent.dialogs.deleteRowDialogState = false"
              >{{ $t('No') }}</v-btn
            >
            <v-btn color="primary" class="mx-2" text @click="deleteItem"
              >{{ $t('Yes') }}
            </v-btn>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['tableName', 'id'],
  methods: {
    deleteItem() {
      this.$store.dispatch('datatable/deleteRow', {
        tableName: String(this.tableName).toLowerCase(),
        id: this.id,
      });
      this.$parent.$parent.dialogs.deleteRowDialogState = false;
    },
  },
};
</script>

<style></style>

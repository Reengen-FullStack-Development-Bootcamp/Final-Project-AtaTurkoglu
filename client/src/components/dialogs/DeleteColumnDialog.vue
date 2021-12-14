<template>
  <v-dialog
    v-model="$parent.$parent.dialogs.deleteColumnDialogState"
    :width="
      $vuetify.breakpoint.lgAndUp
        ? '25%'
        : $vuetify.breakpoint.smAndDown
        ? '50%'
        : '25%'
    "
    persistent
  >
    <v-card>
      <v-card-title>{{ $t('Delete Column') }}</v-card-title>
      <v-container>
        <v-form v-model="valid">
          <v-select
            :label="$t('Select a Column')"
            outlined
            :rules="[checkCol]"
            :items="headers"
            v-model="deletedColumn"
          ></v-select>
        </v-form>
      </v-container>
      <v-card-actions justify-end>
        <v-container>
          <v-row justify="end">
            <v-btn
              color="grey darken-2"
              small
              text
              @click="$parent.$parent.dialogs.deleteColumnDialogState = false"
            >
              {{ $t('Cancel') }}
            </v-btn>
            <v-btn
              color="red darken-2"
              small
              text
              :disabled="!valid"
              @click="deleteColumn(deletedColumn)"
            >
              {{ $t('Delete') }}
            </v-btn>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['tableName', 'headers'],
  data() {
    return {
      deletedColumn: null,
      valid: true,
      required: (value) => !!value || 'Required',
      checkCol: (value) =>
        !['id', 'name', 'factory'].includes(value) ||
        this.$t('You can not delete this column'),
    };
  },
  methods: {
    deleteColumn(column) {
      this.$store.dispatch('datatable/deleteColumn', {
        tableName: String(this.tableName).toLowerCase(),
        column,
      });
      this.$parent.$parent.dialogs.deleteColumnDialogState = false;
    },
  },
};
</script>

<style></style>

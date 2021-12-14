<template>
  <v-dialog
    v-model="$parent.$parent.dialogs.addNewColumnDialogState"
    :width="
      $vuetify.breakpoint.lgAndUp
        ? '25%'
        : $vuetify.breakpoint.smAndDown
        ? '75%'
        : '50%'
    "
    persistent
  >
    <v-card>
      <v-card-title>{{ $t('Add Column') }}</v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field
            :label="$t('Column Name')"
            outlined
            :rules="[required]"
            v-model="newColumn.name"
          ></v-text-field>
          <v-autocomplete
            v-model="newColumn.type"
            :items="dataTypes"
            outlined
            :rules="[required]"
            :label="$t('Select type of datas')"
          ></v-autocomplete>
          <v-expand-transition>
            <v-text-field
              v-if="
                newColumn.type == 'Char' ||
                newColumn.type == 'Character Varying'
              "
              label="Length"
              type="number"
              outlined
              :rules="[required]"
              v-model="dataLength"
            ></v-text-field>
          </v-expand-transition>
        </v-form>
      </v-card-text>
      <v-card-actions justify-end>
        <v-container>
          <v-row justify="end">
            <v-btn
              color="grey darken-2"
              small
              text
              @click="$parent.$parent.dialogs.addNewColumnDialogState = false"
            >
              {{ $t('Cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-2"
              small
              text
              :disabled="!valid"
              @click="addColumn(newColumn)"
            >
              {{ $t('Add') }}
            </v-btn>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['tableName'],
  data() {
    return {
      newColumn: {
        name: null,
        index: null,
        type: null,
      },
      dataTypes: [
        'Boolean',
        'Char',
        'Character Varying',
        'CIDR',
        'Date',
        'Date Range',
        'Int',
        'MACaddr',
        'Numeric',
        'SmallInt',
        'Text',
      ],
      dataLength: null,
      valid: true,
      required: (value) => !!value || 'Required',
    };
  },
  methods: {
    addColumn(column) {
      let item = {};
      if (column.type == 'Char' || column.type == 'Character Varying') {
        item = {
          name: column.name.replaceAll(' ', '_'),
          type: String(column.type).toLowerCase() + `(${this.dataLength})`,
        };
      } else {
        item = {
          name: column.name.replaceAll(' ', '_'),
          type: String(column.type).toLowerCase(),
        };
      }
      this.$store.dispatch('datatable/addNewColumn', {
        tableName: String(this.tableName).toLowerCase(),
        column: item,
      });
      this.$parent.$parent.dialogs.addNewColumnDialogState = false;
    },
  },
};
</script>

<style></style>

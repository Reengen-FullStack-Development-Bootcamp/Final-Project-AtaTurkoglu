<template>
  <v-dialog
    v-model="$parent.$parent.dialogs.editRowDialogState"
    :width="
      $vuetify.breakpoint.xsOnly
        ? '100%'
        : $vuetify.breakpoint.mdAndDown
        ? headers.length > 5
          ? '50%'
          : '75%'
        : headers.length > 8
        ? '25%'
        : '100%'
    "
    persistent
  >
    <v-card>
      <v-card-title>{{ $t('Edit Row') }}</v-card-title>
      <v-container fluid class="py-6 px-6">
        <v-form v-model="valid">
          <v-row
            class="my-2 flex-column flex-sm-column"
            :class="
              (headers.length > 5
                ? 'flex-md-column flex-lg-row'
                : 'flex-md-row',
              headers.length < 8 ? 'flex-lg-row' : 'flex-lg-column')
            "
          >
            <v-col v-for="(item, index) in headers" :key="index">
              <span>
                <small class="dtype">{{ item.type }}</small>
              </span>
              <v-text-field
                v-if="item.type == 'date'"
                :label="item.text"
                outlined
                v-model="row[item.value]"
                type="date"
              ></v-text-field>
              <v-menu
                v-else-if="item.type == 'daterange'"
                v-model="dateRangeMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
                persistent
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    id="daterange"
                    v-model="row[item.value]"
                    :label="item.text"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    outlined
                    role="button"
                    v-on="on"
                  >
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="row[item.value]"
                  no-title
                  scrollable
                  range
                  persistent
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="dateRangeMenu = false">
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="dateRangeMenu = false">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
              <v-text-field
                v-else-if="item.type == 'boolean'"
                :label="item.text"
                outlined
                readonly
              >
                <!--eslint-disable-next-line-->
                <template v-slot:prepend-inner>
                  <v-simple-checkbox
                    v-model="row[item.value]"
                  ></v-simple-checkbox>
                </template>
              </v-text-field>
              <v-text-field
                v-else
                :label="item.text"
                outlined
                ripple="false"
                v-model="row[item.value]"
                :rules="[(v) => check(v, item.type)]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align-content="center" justify="center" class="mt-6">
            <v-btn
              class="mx-2"
              text
              @click="$parent.$parent.dialogs.editRowDialogState = false"
              >{{ $t('Cancel') }}</v-btn
            >
            <v-btn
              color="primary"
              class="mx-2"
              text
              @click="editRow"
              :disabled="
                !valid ||
                Object.values(row).length == 0 ||
                row['name'] == null ||
                row['name'] == ''
              "
              >{{ $t('Save') }}</v-btn
            >
          </v-row>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { validation } from '@/mixins/validator.js';
export default {
  props: ['tableName', 'headers', 'data'],
  mixins: [validation],
  data() {
    return {
      row: null,
      dateRangeMenu: false,
      dateRange: null,
      valid: true,
    };
  },
  created() {
    this.row = { ...this.data };
  },
  methods: {
    async editRow() {
      let newRow = await this.correctRange(this.headers, this.row);
      let cols = await this.headers.map((col) => col.value);
      Object.keys(newRow).forEach((item) => {
        if (!cols.includes(item) && item != 'id') {
          delete newRow[item];
        }
      });
      await this.$store.dispatch('datatable/editRow', {
        tableName: String(this.tableName).toLowerCase(),
        row: newRow,
      });
      this.$parent.$parent.dialogs.editRowDialogState = false;
    },
    correctRange(columns, row) {
      let newRow = { ...row };
      let dateranges = columns
        .filter((col) => col.type == 'daterange')
        .map((item) => item.value);

      Object.keys(newRow).forEach((item) => {
        if (dateranges.includes(item) && item != null) {
          newRow[item] = `[${newRow[item][0]},${newRow[item][1]})`;
        }
      });
      return newRow;
    },
  },
};
</script>

<style></style>

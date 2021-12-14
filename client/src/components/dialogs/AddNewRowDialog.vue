<template>
  <v-dialog
    v-model="$parent.$parent.dialogs.addNewRowDialogState"
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
      <v-card-title> {{ $t('Add Row') }} </v-card-title>
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
                type="date"
                v-model="newRow[item.value]"
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
                    v-model="dateRangePickerValue"
                    :label="item.text"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    outlined
                    role="button"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dateRange"
                  no-title
                  scrollable
                  range
                  persistent
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="(dateRangeMenu = false), (newRow[item.value] = [])"
                  >
                    {{ $t('Cancel') }}
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="
                      (dateRangeMenu = false),
                        correctRange(dateRange, item.value)
                    "
                  >
                    {{ $t('Ok') }}
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
                    v-model="newRow[item.value]"
                  ></v-simple-checkbox>
                </template>
              </v-text-field>
              <!--eslint-disable-->
              <v-text-field
                v-else
                :label="item.text"
                outlined
                ripple="false"
                v-model="newRow[item.value]"
                :rules="[(v) => check(v, item.type)]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align-content="center" justify="center" class="mt-6">
            <v-btn
              class="mx-2"
              text
              @click="$parent.$parent.dialogs.addNewRowDialogState = false"
            >
              {{ $t('Cancel') }}
            </v-btn>
            <v-btn
              color="primary"
              class="mx-2"
              text
              @click="addNewRow"
              :disabled="
                !valid ||
                Object.values(newRow).length == 0 ||
                newRow['name'] == null ||
                newRow['name'] == ''
              "
              >{{ $t('Add') }}</v-btn
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
  props: ['tableName', 'headers'],
  mixins: [validation],
  data() {
    return {
      newRow: [],
      dateRangeMenu: false,
      dateRange: null,
      addRowDialogState: true,
      valid: true,
    };
  },
  computed: {
    dateRangePickerValue() {
      if (this.dateRange) {
        return this.dateRange.join(' ~ ');
      } else {
        return '';
      }
    },
  },
  methods: {
    addNewRow() {
      this.$store.dispatch('datatable/addNewRow', {
        tableName: String(this.tableName).toLowerCase(),
        row: { ...this.newRow },
      });
      this.$parent.$parent.dialogs.addNewRowDialogState = false;
    },
    correctRange(item, value) {
      this.newRow[value] = `[${item[0]},${item[1]})`;
    },
  },
};
</script>

<style>
.dtype {
  font-size: 0.7rem;
  color: #78909c;
  margin-right: 5px;
  margin-bottom: 3px;
  display: flex;
  justify-content: flex-end;
}
.v-messages__message {
  hyphens: none !important;
}
</style>

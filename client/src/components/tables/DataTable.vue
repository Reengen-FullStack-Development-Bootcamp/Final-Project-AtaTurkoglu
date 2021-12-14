<template>
  <v-card max-width="75%" class="mt-16 mx-auto" :id="tableName + '-card'">
    <v-card-title class="title-bg">{{ tableName }}</v-card-title>
    <!--eslint-disable-->
    <v-data-table
      :headers="tableData.columns"
      :items="tableData.rows"
      :item-key="tableData.rows.id"
      :items-per-page="itemsPerPage"
      loading="false"
      mobile-breakpoint="960"
      :loading-text="$t('Loading... Please wait')"
      class="capitalize"
      :footer-props="{
        'items-per-page-text': $t('Rows Per Page'),
        'items-per-page-all-text': $t('All'),
      }"
    >
      <template
        v-if="$vuetify.breakpoint.mdAndUp"
        v-slot:item="{ item, index, headers }"
      >
        <tr @click="clickRow(item)">
          <td v-for="(col, indx) in headers" :key="indx">
            <v-simple-checkbox
              v-if="headers[indx].type == 'boolean'"
              :value="item[col.value]"
              color="blue-grey lighten-3"
              :ripple="false"
            ></v-simple-checkbox>
            <span v-else-if="headers[indx].type == 'daterange'">
              <v-chip
                v-for="(chip, idx) in item[col.value]"
                :key="idx"
                small
                color="blue-grey lighten-5"
                class="mr-2"
              >
                {{ chip }}
              </v-chip>
            </span>
            <span v-else-if="headers[indx].type == 'date'">
              <v-chip small color="blue-grey lighten-5">
                {{ item[col.value] }}
              </v-chip>
            </span>
            <div v-else-if="headers[indx].value == 'actions'">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon
                small
                @click="
                  (dialogs.deleteRowDialogState = true),
                    (idForDelete = item.id);
                "
              >
                mdi-delete
              </v-icon>
            </div>
            <span v-else
              >{{ item[col.value] }}
              <small class="lowercase" v-if="col.text == 'usage'"> kWh</small>
              <small class="lowercase" v-if="col.text == 'fee'"> TL</small>
            </span>
          </td>
        </tr>
      </template>
      <template
        v-if="$vuetify.breakpoint.smAndDown"
        v-slot:item.actions="{ item }"
      >
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon
          small
          @click="
            (dialogs.deleteRowDialogState = true), (idForDelete = item.id);
          "
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:top>
        <v-container>
          <v-row justify="end">
            <v-btn
            v-if="tableName == 'Departments'"
              color="blue-grey lighten-1"
              small
              text
              class="mt-2"
              @click="showAll"
            >
              {{ $t('Show All') }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="blue-grey lighten-1"
              small
              text
              class="mt-2"
              @click="dialogs.addNewColumnDialogState = true"
            >
              {{ $t('Add Column') }}
            </v-btn>
            <v-btn
              color="blue-grey lighten-1"
              small
              text
              class="mt-2"
              @click="dialogs.deleteColumnDialogState = true"
            >
              {{ $t('Delete Column') }}
            </v-btn>
          </v-row>
        </v-container>
      </template>
      <template v-slot:footer.prepend>
        <v-btn
          text
          color="blue-grey lighten-1"
          small
          class="my-4"
          @click="dialogs.addNewRowDialogState = true"
        >
          {{ $t('Add New Row') }}
        </v-btn>
      </template>
    </v-data-table>
    <AddNewRowDialog
      v-if="dialogs.addNewRowDialogState"
      :tableName="tableName"
      :headers="tableDataColumns"
    />
    <EditRowDialog
      v-if="dialogs.editRowDialogState"
      :tableName="tableName"
      :headers="tableDataColumns"
      :data="edittingRow"
    />
    <DeleteRowDialog
      v-if="dialogs.deleteRowDialogState"
      :tableName="tableName"
      :id="idForDelete"
    />
    <AddNewColumnDialog
      v-if="dialogs.addNewColumnDialogState"
      :tableName="tableName"
    />
    <DeleteColumnDialog
      :key="`delete-${tableName}`"
      v-if="dialogs.deleteColumnDialogState"
      :tableName="tableName"
      :headers="tableDataColumns"
    />
  </v-card>
</template>

<script>
import AddNewRowDialog from '../dialogs/AddNewRowDialog.vue';
import EditRowDialog from '../dialogs/EditRowDialog.vue';
import DeleteRowDialog from '../dialogs/DeleteRowDialog.vue';
import AddNewColumnDialog from '../dialogs/AddNewColumnDialog.vue';
import DeleteColumnDialog from '../dialogs/DeleteColumnDialog.vue';
export default {
  props: ['tableName', 'data'],
  components: {
    AddNewRowDialog,
    EditRowDialog,
    DeleteRowDialog,
    AddNewColumnDialog,
    DeleteColumnDialog,
  },
  data() {
    return {
      itemsPerPage: 5,
      tableData: {
        columns: [],
        rows: [],
      },
      tablekey: 1,
      dialogs: {
        addNewRowDialogState: false,
        editRowDialogState: false,
        deleteRowDialogState: false,
        addNewColumnDialogState: false,
        deleteColumnDialogState: false,
      },
      drag: false,
      dragSelected: null,
      itemIndex: null,
      targetIndex: null,
      dragList: [],
      edittingRow: null,
      idForDelete: null,
    };
  },
  created() {
    this.setTableData(this.data);
  },
  mounted() {
    window.onbeforeunload = () => {
      window.localStorage.setItem(
        `${this.tableName.toLowerCase()}Cols`,
        JSON.stringify(this.data.columns.map((c) => c.attname)),
      );
    };
    document
      .getElementById(`${this.tableName}-card`)
      .addEventListener('dragenter', this.moveHeader);
    document
      .getElementById(`${this.tableName}-card`)
      .addEventListener('dragleave', this.dragLeave);
    document
      .getElementById(`${this.tableName}-card`)
      .addEventListener('dragstart', this.dragStart);
    document
      .getElementById(`${this.tableName}-card`)
      .addEventListener('dragend', this.dragEnd);
  },
  beforeDestroy() {
    window.localStorage.setItem(
      `${this.tableName.toLowerCase()}Cols`,
      JSON.stringify(this.data.columns.map((c) => c.attname)),
    );
  },
  watch: {
    stateData: {
      deep: true,
      handler(val) {
        if (val != null) {
          this.setTableData(val);
        }
      },
    },
    '$store.state.datatable.selectedFactory': {
      handler(val) {
        if (this.tableName == 'Departments') {
          this.tableData.rows = this.data.rows.filter((e) => e.factory == val);
        }
      },
    },
  },
  computed: {
    stateData() {
      return this.$store.state.datatable[this.tableName.toLowerCase()];
    },
    tableDataColumns() {
      return this.tableData.columns.slice(1, this.tableData.columns.length - 1);
    },
    /*
    tableDataColumnsIndexes() {
      return this.tableDataColumns.length
    },*/
  },
  methods: {
    setTableData(data) {
      this.tableData.columns = [];
      this.tableData.rows = [];
      this.tableData.rows = data.rows;
      data.columns.forEach((col) => {
        let obj = new Object({
          text: col.attname.replaceAll('_', ' '),
          value: col.attname,
          type: col.format_type,
        });
        this.tableData.columns.push(obj);
      });
      this.tableData.columns.push({
        text: 'Actions',
        value: 'actions',
        sortable: false,
      });
      this.tablekey++;
    },
    editItem(item) {
      this.edittingRow = this.tableData.rows.find((el) => el.id == item.id);
      this.tableDataColumns.forEach((el) => {
        if (Object.keys(item).includes(el.value) == false) {
          this.edittingRow[el.value] = null;
        }
      });
      this.dialogs.editRowDialogState = true;
    },
    dragStart(e) {
      e.target.draggable = true;
      e.target.style.cursor = 'grab';
      this.dragList = [];
      let element = e.target;
      if (element.tagName == 'TH' && element.textContent != 'Actions') {
        e.dataTransfer.dropEffect = 'move';
        console.log(e);
        this.dragSelected = element.textContent.replaceAll(' ', '_');
        this.drag = true;
      }
    },
    moveHeader(e) {
      e.preventDefault();
      let element = e.target;

      if (element.tagName == 'TH' && element.textContent != 'Actions') {
        this.dragList.push(element.textContent.replaceAll(' ', '_'));

        if (
          Object.values(this.data.columns.map((e) => e.attname)).indexOf(
            this.dragSelected,
          ) >= 0
        ) {
          this.itemIndex = Object.values(
            this.data.columns.map((e) => e.attname),
          ).indexOf(this.dragSelected);

          if (
            Object.values(this.data.columns.map((e) => e.attname)).indexOf(
              this.dragList[this.dragList.length - 1],
            ) >= 0
          ) {
            this.targetIndex = Object.values(
              this.data.columns.map((e) => e.attname),
            ).indexOf(this.dragList[this.dragList.length - 1]);
            if (this.targetIndex < this.itemIndex) {
              e.target.style['border-left'] = '2px solid #78909c';
            } else if (this.targetIndex > this.itemIndex) {
              e.target.style['border-right'] = '2px solid #78909c';
            }

            this.drag = true;
          } else {
            this.drag = false;
          }
          this.drag = true;
        } else {
          this.drag = false;
        }
      } else {
        this.drag = false;
      }
    },
    dragEnd() {
      if (this.drag) {
        let header = this.data.columns[this.itemIndex];
        this.data.columns.splice(this.itemIndex, 1);
        this.data.columns.splice(this.targetIndex, 0, header);
      }
    },
    dragLeave(e) {
      e.target.style['border'] = '';
    },
    clickRow(item) {
      if (this.tableName == 'Factories') {
        this.$store.state.datatable.selectedFactory = item.name;
      }
    },
    showAll() {
      this.tableData.rows = this.data.rows;
    },
  },
};
</script>

<style>
.title-bg {
  background-color: #78909c !important;
  color: white;
}
.capitalize {
  text-transform: capitalize;
}

th {
  user-select: all !important;
  -moz-user-select: all !important;
  -webkit-user-select: all !important;
}
th > span {
  pointer-events: none;
}
tr {
  cursor: pointer;
}
.borderleft:hover {
  border-left-width: 2px;
  border-left-style: solid;
  border-left-color: cadetblue;
}
::selection {
  color: none;
  background: none;
}
.lowercase {
  text-transform: lowercase;
}
</style>

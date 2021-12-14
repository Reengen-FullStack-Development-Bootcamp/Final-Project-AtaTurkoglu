import axios from 'axios';

const setDateFormat = (columns, rowData) => {
  let dates = columns
    .filter((col) => col.format_type == 'date')
    .map((item) => item.attname);
  rowData.forEach((data) => {
    Object.keys(data).forEach((item) => {
      if (dates.includes(item) && data[item] != null) {
        data[item] = data[item].split('T')[0];
      }
    });
  });
};

const setDateRangeFormat = (columns, rowData) => {
  let dateranges = columns
    .filter((col) => col.format_type == 'daterange')
    .map((item) => item.attname);
  rowData.forEach((data) => {
    Object.keys(data).forEach((item) => {
      if (dateranges.includes(item) && data[item] != null) {
        let range = data[item].split(',');
        data[item] = [range[0].slice(1), range[1].slice(0, -1)];
      }
    });
  });
};

export default {
  namespaced: true,
  state: {
    departments: null,
    factories: null,
    selectedFactory: null,
  },
  mutations: {
    setDepartments(state, [table, data]) {
      state[table] = data;
    },
    deleteRow(state, [table, id]) {
      let index = state[table].rows.findIndex((item) => item.id == id);
      state[table].rows.splice(index, 1);
    },
    addNewRow(state, [table, row]) {
      state[table].rows.push(row.data.rows[0]);
    },
    editRow(state, [table, row]) {
      let index = state[table].rows.findIndex((item) => item.id == row.id);
      state[table].rows.splice(index, 1, row);
    },
    addNewColumn(state, [table, column]) {
      let item = {
        attname: column.name,
        format_type: column.type,
      };
      state[table].columns.push(item);
    },
    deleteColumn(state, [table, column]) {
      let index = state[table].columns.findIndex(
        (item) => item.attname == column
      );
      state[table].columns.splice(index, 1);
    },
  },
  actions: {
    async getAll({ commit }, data) {
      await axios
        .get(process.env.VUE_APP_API + '/dashboard/datatable/getall', {
          params: {
            tablename: data.tableName,
          },
        })
        .then((res) => {
          console.log('-data-', res);
          //timestamp date datas to date
          setDateFormat(res.data.columns, res.data.rows);
          //set daterange to array
          setDateRangeFormat(res.data.columns, res.data.rows);
          commit('setDepartments', [data.tableName, res.data]);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async addNewRow({ commit, state }, data) {
      await axios
        .post(process.env.VUE_APP_API + '/dashboard/datatable/addnewrow', data)
        .then((res) => {
          //timestamp date datas to date
          setDateFormat(state[data.tableName].columns, res.data.rows);
          //set daterange to array
          setDateRangeFormat(state[data.tableName].columns, res.data.rows);
          commit('addNewRow', [data.tableName, res]);
          console.log(res.status + ' new row added successfully');
        })
        .catch((err) => {
          console.error(err);
        });
    },

    async deleteRow({ commit }, data) {
      await axios
        .delete(process.env.VUE_APP_API + '/dashboard/datatable/deleterow', {
          data: { tableName: data.tableName, id: data.id },
        })
        .then((res) => {
          commit('deleteRow', [data.tableName, res.data]);
          console.log(res.status + ' row deleted successfully');
        })
        .catch((err) => {
          console.error(err);
        });
    },

    async editRow({ commit, state }, data) {
      console.log(data);
      await axios
        .patch(process.env.VUE_APP_API + '/dashboard/datatable/updaterow', data)
        .then((res) => {
          //timestamp date datas to date
          setDateFormat(state[data.tableName].columns, res.data.rows);
          //set daterange to array
          setDateRangeFormat(state[data.tableName].columns, res.data.rows);
          commit('editRow', [data.tableName, res.data.rows[0]]);
          console.log(res.status + ' row updated successfully');
        })
        .catch((err) => {
          console.error(err);
        });
    },

    async addNewColumn({ commit }, data) {
      await axios
        .post(
          process.env.VUE_APP_API + '/dashboard/datatable/addnewcolumn',
          data
        )
        .then((res) => {
          commit('addNewColumn', [data.tableName, data.column]);
          console.log(res.status + ' new column added successfully');
        })
        .catch((err) => {
          console.error(err);
        });
    },

    async deleteColumn({ commit }, data) {
      await axios
        .delete(process.env.VUE_APP_API + '/dashboard/datatable/deletecolumn', {
          data: { tableName: data.tableName, column: data.column },
        })
        .then((res) => {
          commit('deleteColumn', [data.tableName, data.column]);
          console.log(res.status + ' column deleted successfully');
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};

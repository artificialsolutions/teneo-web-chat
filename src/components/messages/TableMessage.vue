<template>
    <table class="twc-table twc-table-border">
      <caption class="twc-table-title" v-if="tableTitle">{{ tableTitle }}</caption>
      <thead v-if="tableHeaders">
      <tr class="twc-table-header-row">
        <th
            v-for="(header) in tableHeaders"
            class="twc-table-header-cell"
        >
          {{ header }}
        </th>
      </tr>
      </thead>
      <tbody v-if="tableBody">
      <tr
          v-for="(row) in tableBody"
          class="twc-table-body-row"
      >
        <td
            v-for="(cell) in row"
            class="twc-table-body-cell"
        >{{ cell }}
        </td>
      </tr>
      </tbody>
      <tfoot v-if="tableFooters">
      <tr class="twc-table-footer-row">
        <td
            v-for="(footer) in tableFooters"
            class="twc-table-footer-cell"
        >{{ footer }}
        </td>
      </tr>
      </tfoot>
    </table>
</template>

<script>
export default {
  name: 'TableMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
            message &&
            message.type === 'table' &&
            message.data
            && message.data.body
        );
      },
    },
  },
  data() {
    return {
      longestArray: [...this.message.data.body, this.message.data.headers || [], this.message.data.footers || []].reduce((accumulator, currentValue, currentIndex, sourceArray) => accumulator > currentValue.length ? accumulator : currentValue.length, 0)

    };
  },
  computed: {
    tableTitle() {
      if (this.message.data.title) {
        return this.message.data.title;
      }
    },
    tableHeaders() {
      if(this.message.data.headers) {
        while (this.$data.longestArray > this.message.data.headers.length) {
          this.message.data.headers.push("")
        }
      return this.message.data.headers;
      }
    },
    tableBody() {
      for(let row of this.message.data.body){
        while(this.$data.longestArray > row.length){
          row.push("")
        }
      }
      return this.message.data.body;
    },
    tableFooters() {
      if(this.message.data.footers) {
        while (this.$data.longestArray > this.message.data.footers.length) {
          this.message.data.footers.push("")
        }
        return this.message.data.footers;
      }
    }
  },
};
</script>

<style>
.twc-table-border {
  border: 2px solid var(--table-border-color);
}
.twc-table-title {
  color: var(--table-title-text-color);
  background: var(--table-title-background-color);
  font-weight: bold;
  padding: 5px;
  font-size: larger;
}


.twc-table-header-cell {
  color: var(--table-header-text-color);
  background: var(--table-header-background-color);
  padding: 2px;
}

.twc-table-body-row:nth-child(even) .twc-table-body-cell {
  color: var(--table-body-even-text-color);
  background: var(--table-body-even-background-color);
  padding: 2px;
}

.twc-table-body-row:nth-child(odd) .twc-table-body-cell {
  color: var(--table-body-odd-text-color);
  background: var(--table-body-odd-background-color);
  padding: 2px;
}
.twc-table-footer-cell {
  color: var(--table-footer-text-color);
  background: var(--table-footer-background-color);
  padding: 2px;
}
</style>

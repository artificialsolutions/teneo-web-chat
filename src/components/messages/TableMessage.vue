<template>
  <table class="twc-table twc-table-border">
    <caption class="twc-table-title" v-if="tableTitle">{{ tableTitle }}</caption>
    <thead v-if="tableHeaders">
    <tr class="twc-table-header-row">
      <th
          v-for="(header, hIndex) in tableHeaders"
          :key="hIndex"
          class="twc-table-header-cell"
      >
        {{ header }}
      </th>
    </tr>
    </thead>

    <tbody v-if="tableBody">
    <tr
        v-for="(row, rIndex) in tableBody"
        :key="rIndex"
        class="twc-table-body-row"
    >
      <td
          v-for="(cell, cIndex) in row"
          :key="cIndex"
          class="twc-table-body-cell"
      >{{ cell }}
      </td>
    </tr>
    </tbody>

    <tfoot v-if="tableFooters">
    <tr class="twc-table-footer-row">
      <td
          v-for="(footer, fIndex) in tableFooters"
          :key="fIndex"
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
  .twc-table {
    border-spacing: 0 5px;
    border-collapse: separate;
    background: rgb(231, 231, 231);
    border-radius: 6px;
    overflow: hidden;
    max-width: 400px;
    width: 300px;
    margin: 0 auto;
    position: relative;
  }

  .twc-table-border {
    border: none;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
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
    background: var(--table-header-background-color, rgb(231, 231, 231));
    padding: 5px;
    height: 35px;
    text-align: center;
  }

  .twc-table-header-cell:first-child {
    border-top-left-radius: 6px;
  }

  .twc-table-header-cell:last-child {
    border-top-right-radius: 6px;
  }

  .twc-table-body-row {
    height: 30px;
    background-color: rgba(247, 247, 247, 0.7);
  }

  .twc-table-body-cell:first-child {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  .twc-table-body-cell:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  .twc-table-body-row:hover {
    background-color: var(--header-fg-color, rgba(47, 40, 110, 0.8));
    color: var(--light-bg-color,#ffffff);
  }

  .twc-table-body-row:nth-child(even) .twc-table-body-cell,
  .twc-table-body-row:nth-child(odd) .twc-table-body-cell {
    padding: 2px;
    text-align: center;
  }

  .twc-table-body-row:nth-child(even) .twc-table-body-cell {
    color: var(--table-body-even-text-color);
    background: var(--table-body-even-background-color);
  }

  .twc-table-body-row:nth-child(odd) .twc-table-body-cell {
    color: var(--table-body-odd-text-color);
    background: var(--table-body-odd-background-color);
  }

  .twc-table-footer-row:first-child {
    border-bottom-left-radius: 6px;
  }

  .twc-table-footer-row:last-child {
    border-bottom-right-radius: 6px;
  }

  .twc-table-footer-cell {
    color: var(--table-footer-text-color);
    background: var(--table-footer-background-color, rgb(231, 231, 231));
    padding: 2px;
    text-align: center;
  }

</style>

<style scoped>
  .twc-table .td {
    text-align: center;
  }
</style>

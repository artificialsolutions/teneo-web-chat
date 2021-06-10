<template>
  <div class="twc-table-message">
    <table>
      <caption class="twc-table-title" v-if="tableTitle">{{ tableTitle }}</caption>
      <thead v-if="tableHeaders">
      <tr class="twc-headers-row">
        <th
            v-for="(header) in tableHeaders"
            class="twc-header"
        >
          {{ header }}
        </th>
      </tr>
      </thead>
      <tbody v-if="tableBody">
      <tr
          v-for="(row) in tableBody"
          class="twc-body-row"
      >
        <td
            v-for="(cell) in row"
            class="twc-body-cell"
        >{{ cell }}
        </td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <td
            v-for="(footer) in tableFooters"
            class="twc-footer"
        >{{ footer }}
        </td>
      </tr>
      </tfoot>
    </table>
  </div>
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
        );
      },
    },
  },
  data() {
    return {
      longestArray: [...this.message.data.body, this.message.data.headers, this.message.data.footers].reduce((accumulator, currentValue, currentIndex, sourceArray) => accumulator > currentValue.length ? accumulator : currentValue.length, 0)

    };
  },
  computed: {
    tableTitle() {
      if (this.message.data.title) {
        return this.message.data.title;
      }
    },
    tableHeaders() {
      while(this.$data.longestArray > this.message.data.headers){
        this.message.data.headers.push("")
      }
      return this.message.data.headers;
    },
    tableBody() {
      return this.message.data.body;
    },
    tableFooters() {
      return this.message.data.footers;
    }
  },
};
</script>

<style>

</style>

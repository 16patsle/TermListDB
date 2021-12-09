<template>
  <table class="table is-fullwidth is-hoverable">
    <thead>
      <tr>
        <slot name="table-header" />
      </tr>
    </thead>
    <tbody ref="termlist" class="list">
      <slot name="table-body" />
    </tbody>
  </table>
</template>

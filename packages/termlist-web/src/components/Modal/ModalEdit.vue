<template>
  <form @submit.prevent>
    <AppModal ref="modal" :title="ui.editterm">
      <template #modal-body>
        <div v-for="field in mutableFields" :key="field.name" class="field">
          <label class="label">{{ ui[field.name] }}</label>
          <div class="control">
            <input
              v-if="field.type === 'short'"
              :ref="field.name + 'field'"
              class="input"
              type="text"
            />
            <textarea
              v-else-if="field.type === 'long'"
              :ref="field.name + 'field'"
              class="textarea"
              rows="8"
            />
            <AppSelect
              v-else-if="
                field.type === 'select' && field.options instanceof Array
              "
              :ref="field.name + 'field'"
              :options="reduce(field.options)"
              fullwidth
            />
          </div>
        </div>
      </template>
      <template #modal-footer>
        <input
          :value="ui.save"
          type="submit"
          class="button is-primary"
          accesskey="s"
          @click="saveTerm"
        />
        <AppButton @click="close">
          {{ ui.cancel }}
        </AppButton>
      </template>
    </AppModal>
  </form>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import AppModal from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import AppSelect from '../Generic/AppSelect.vue'

import type { FieldType } from '../../types/FieldType'
import type { TermType } from '../../types/TermType'
import type { SelectOptionType } from '../../types/SelectOptionType'

import ui from '../../assets/ui'
import fields from '../../assets/fields'

@Component({
  components: {
    AppModal,
    AppButton,
    AppSelect,
  },
})
export default class ModalEdit extends Vue {
  $refs!: {
    modal: AppModal
  }

  ui = ui
  fields = fields
  current: TermType | null = null
  mode: 'add' | 'edit' = 'edit'

  get mutableFields(): FieldType[] {
    return (this.fields as FieldType[]).filter(field => {
      return !field.immutable
    })
  }

  toggleModal(bool: boolean): void {
    this.$refs.modal.toggleModal(bool)
  }

  editTerm(current: TermType | null, mode: 'add' | 'edit' = 'edit'): void {
    this.current = current
    this.mode = mode

    if (this.mode === 'edit' && this.current) {
      for (const field of this.fields) {
        if (!field.immutable && this.$refs[field.name + 'field']) {
          this.$refs[field.name + 'field'][0].value =
            this.current[field.name] || ''
        }
      }
    }

    this.toggleModal(true)
    this.$refs.modal.$el
      .querySelector('.field input, .field textarea, .field select')
      .focus()
  }

  addTerm(): void {
    this.editTerm(null, 'add')
  }

  saveTerm(): void {
    let termObject: TermType
    if (this.mode === 'add') {
      const date = new Date().toJSON()
      termObject = {
        _id: date,
        date,
      }
    } else {
      if (this.current === null) {
        return
      }
      termObject = {
        _id: this.current._id,
        date: this.current._id,
      }
    }

    for (const field of this.fields) {
      if (
        !field.immutable &&
        field.name !== '_id' &&
        this.$refs[field.name + 'field']
      ) {
        termObject[field.name] = this.$refs[field.name + 'field'][0].value
        this.$refs[field.name + 'field'][0].value = ''
      }
    }

    this.$emit('save', termObject)

    this.toggleModal(false)

    this.current = null
  }

  close(): void {
    this.toggleModal(false)
  }

  reduce(options: string[]): SelectOptionType[] {
    return options.reduce(
      (allOptions: SelectOptionType[], option) => {
        allOptions.push({
          name: option,
          ui: this.ui.wordClasses[option],
        })
        return allOptions
      },
      [{ name: '', ui: this.ui.selectTermType }]
    )
  }
}
</script>
<style></style>

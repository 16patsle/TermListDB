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
              :data-field="field.name"
              class="input"
              type="text"
              @keyup="handleKeyUp"
            />
            <textarea
              v-else-if="field.type === 'long'"
              :ref="field.name + 'field'"
              :data-field="field.name"
              class="textarea"
              rows="8"
              @keyup="handleKeyUp"
            />
            <AppSelect
              v-else-if="
                field.type === 'select' && field.options instanceof Array
              "
              :ref="field.name + 'field'"
              :options="reduce(field.options)"
              :data-field="field.name"
              fullwidth
              @change="handleSelectChange"
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
import debounce from 'lodash.debounce'
import AppModal from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import AppSelect from '../Generic/AppSelect.vue'

import type { FieldType } from '../../types/FieldType'
import type { TermDefType, TermType } from '../../types/TermType'
import type { SelectOptionType } from '../../types/SelectOptionType'
import type { FieldNameType } from '../../types/FieldNameType'

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
  } & {
    [K in `${FieldNameType}field`]:
      | HTMLInputElement[]
      | HTMLTextAreaElement[]
      | AppSelect[]
  }

  ui = ui
  fields = fields
  current: TermType | null = null
  mode: 'add' | 'edit' = 'edit'
  // @ts-expect-error We need to assign a value here, but the object is populated later.
  debouncedChangeHandlers: {
    [K in FieldNameType]: () => void
  } = {}

  get mutableFields(): FieldType[] {
    return (this.fields as FieldType[]).filter(field => {
      return !field.immutable
    })
  }

  created(): void {
    for (const field of this.fields) {
      if (!field.immutable) {
        this.debouncedChangeHandlers[field.name] = debounce(
          this.handleDirty.bind(this, field.name),
          400
        )
      }
    }
  }

  handleKeyUp(e: KeyboardEvent): void {
    this.debouncedChangeHandlers[
      (e.target as HTMLElement).dataset.field as FieldNameType
    ]()
  }

  handleSelectChange(_value: never, target: HTMLElement): void {
    const el = (target as HTMLElement).parentElement
    if (el) {
      this.debouncedChangeHandlers[el.dataset.field as FieldNameType]()
    }
  }

  handleDirty(fieldName?: string): void {
    console.log(fieldName)
  }

  toggleModal(bool: boolean): void {
    this.$refs.modal.toggleModal(bool)
  }

  editTerm(current: TermType | null, mode: 'add' | 'edit' = 'edit'): void {
    this.current = current
    this.mode = mode

    if (this.mode === 'edit' && this.current) {
      for (const field of this.fields) {
        const refName = `${field.name}field` as `${FieldNameType}field`
        if (!field.immutable && this.$refs[refName]) {
          this.$refs[refName][0].value = this.current[field.name] || ''
        }
      }
    }

    this.toggleModal(true)
    const focus = this.$refs.modal.$el.querySelector(
      '.field input, .field textarea, .field select'
    ) as HTMLElement
    if (focus) {
      focus.focus()
    }
  }

  addTerm(): void {
    this.editTerm(null, 'add')
  }

  saveTerm(): void {
    let termObject: TermDefType
    if (this.mode === 'add') {
      termObject = {
        date: new Date().toJSON(),
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
      const refName = `${field.name}field` as `${FieldNameType}field`
      if (!field.immutable && field.name !== '_id' && this.$refs[refName]) {
        termObject[field.name] = this.$refs[refName][0].value
        this.$refs[refName][0].value = ''
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

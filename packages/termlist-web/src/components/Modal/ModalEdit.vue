<template>
  <form @submit.prevent>
    <AppModal ref="modal" :title="ui.editterm" :close-callback="close">
      <template #modal-body>
        Dirty: {{ dirty }}
        <div v-for="field in mutableFields" :key="field.name" class="field">
          <label class="label">{{ ui[field.name] }}</label>
          <div class="control">
            <input
              v-if="field.type === 'short'"
              v-model="currentTerm[field.name]"
              :data-field="field.name"
              class="input"
              type="text"
              @keyup="handleKeyUp"
            />
            <textarea
              v-else-if="field.type === 'long'"
              v-model="currentTerm[field.name]"
              :data-field="field.name"
              class="textarea"
              rows="8"
              @keyup="handleKeyUp"
            />
            <AppSelect
              v-else-if="
                field.type === 'select' && field.options instanceof Array
              "
              v-model="currentTerm[field.name]"
              :default-option-name="ui.selectTermType"
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
    <AppModal
      ref="modalUnsavedWarning"
      :title="ui.unsavedWarningTitle"
      :ok-text="ui.save"
      :callback="saveTerm"
      :cancel-text="ui.discard"
      :close-callback="
        () => {
          dirty = false
          close()
        }
      "
    >
      <template #modal-body>
        {{ ui.unsavedWarningText }}
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

const emptyTerm: TermDefType = {
  date: new Date().toJSON(),
  desc: undefined,
  term: undefined,
  type: undefined,
}

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
    modalUnsavedWarning: AppModal
  }

  ui = ui
  fields = fields
  currentTerm: TermDefType = Object.assign({}, emptyTerm)
  originalTerm: TermType | null = null
  mode: 'add' | 'edit' = 'edit'
  // @ts-expect-error We need to assign a value here, but the object is populated later.
  debouncedChangeHandlers: {
    [K in FieldNameType]: () => void
  } = {}
  // @ts-expect-error We need to assign a value here, but the object is populated later.
  dirtyFields: {
    [K in FieldNameType]: boolean
  } = {}
  dirty = false

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
        this.dirtyFields[field.name] = false
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

  handleDirty(fieldName: FieldNameType): void {
    if (this.mode === 'add' && this.currentTerm[fieldName] === '') {
      // When adding a term and the field is empty
      this.dirtyFields[fieldName] = false
    } else if (
      this.mode === 'edit' &&
      this.originalTerm &&
      this.originalTerm[fieldName] === this.currentTerm[fieldName]
    ) {
      // When editing a term and the field's value is unchanged
      this.dirtyFields[fieldName] = false
    } else {
      this.dirtyFields[fieldName] = true
    }

    this.dirty = Object.values(this.dirtyFields).reduce((prev, curr) => {
      return curr || prev
    }, false)
  }

  toggleModal(bool: boolean): void {
    this.$refs.modal.toggleModal(bool)
  }

  toggleModalUnsavedWarning(bool: boolean): void {
    this.$refs.modalUnsavedWarning.toggleModal(bool)
  }

  editTerm(originalTerm: TermType | null, mode: 'add' | 'edit' = 'edit'): void {
    this.originalTerm = originalTerm
    this.mode = mode

    if (originalTerm) {
      this.currentTerm.date = originalTerm.date
    }

    for (const field of this.fields) {
      if (!field.immutable) {
        if (this.mode === 'edit' && originalTerm) {
          // Populate fields with term values
          this.currentTerm[field.name] = originalTerm[field.name] || ''
        } else {
          // Reset fields
          this.currentTerm[field.name] = ''
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
      if (this.originalTerm === null) {
        return
      }
      termObject = {
        _id: this.originalTerm._id,
        date: this.originalTerm._id,
      }
    }

    for (const field of this.fields) {
      if (!field.immutable && field.name !== '_id') {
        termObject[field.name] = this.currentTerm[field.name]
        this.currentTerm[field.name] = ''
      }
    }

    this.$emit('save', termObject)

    this.toggleModal(false)
    this.toggleModalUnsavedWarning(false)

    this.originalTerm = null
    this.dirty = false
  }

  close(): void {
    if (this.dirty) {
      this.toggleModalUnsavedWarning(true)
    } else {
      this.toggleModal(false)
      this.toggleModalUnsavedWarning(false)
    }
  }

  reduce(options: string[]): SelectOptionType[] {
    return options.reduce((allOptions: SelectOptionType[], option) => {
      allOptions.push({
        name: option,
        ui: this.ui.wordClasses[option],
      })
      return allOptions
    }, [])
  }
}
</script>
<style></style>

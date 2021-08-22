<template>
  <form @submit.prevent>
    <AppModal ref="modal" :title="ui.editterm" :close-callback="close">
      <template #modal-body>
        Dirty: {{ dirty }}
        <div v-for="field in mutableFields" :key="field.name" class="field">
          <label class="label">{{ field.name !== '' && ui[field.name] }}</label>
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
              @update:modelValue="debouncedChangeHandlers[field.name]()"
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
        <AppButton @click="close">{{ ui.cancel }}</AppButton>
      </template>
    </AppModal>
    <AppModal ref="modalUnsavedWarning" :title="ui.unsavedWarningTitle">
      <template #modal-body>{{ ui.unsavedWarningText }}</template>
      <template #modal-footer>
        <AppButton primary @click="saveTerm">{{ ui.save }}</AppButton>
        <AppButton danger @click="discard">{{ ui.discard }}</AppButton>
      </template>
    </AppModal>
  </form>
</template>
<script lang="ts">
export type ModalEditMethods = {
  addTerm(): void
  editTerm(originalEditTerm: TermType | null, editMode?: 'add' | 'edit'): void
}
</script>
<script lang="ts" setup>
import { computed, ref } from "vue";
import debounce from 'lodash.debounce'
import AppModal, { AppModalMethods } from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import AppSelect from '../Generic/AppSelect.vue'
import type { FieldType } from '../../types/FieldType'
import type { TermDefType, TermType } from '../../types/TermType'
import type { SelectOptionType } from '../../types/SelectOptionType'
import type { FieldNameType } from '../../types/FieldNameType'
import ui from '../../assets/ui'
import fields from '../../assets/fields'

const makeEmptyTerm = (): TermDefType => ({
  date: new Date().toJSON(),
  desc: undefined,
  term: undefined,
  type: undefined,
})

const emit = defineEmits<{
  (e: 'save', term: TermDefType): void
}>()

const currentTerm = ref<TermDefType>(makeEmptyTerm())
const originalTerm = ref<TermType | null>(null)
const mode = ref<'add' | 'edit'>('edit')
// @ts-expect-error We need to assign a value here, but the object is populated later.
const debouncedChangeHandlers: {
  [K in FieldNameType]: () => void
} = {}
// @ts-expect-error We need to assign a value here, but the object is populated later.
const dirtyFields: {
  [K in FieldNameType]: boolean
} = {}
const dirty = ref(false)

const modal = ref<InstanceType<typeof AppModal> & AppModalMethods>()
const modalUnsavedWarning = ref<InstanceType<typeof AppModal> & AppModalMethods>()

const mutableFields = computed((): FieldType[] => {
  return (fields as FieldType[]).filter(field => {
    return !field.immutable
  })
})

const handleKeyUp = (e: KeyboardEvent): void => {
  debouncedChangeHandlers[
    (e.target as HTMLElement).dataset.field as FieldNameType
  ]()
}

const handleDirty = (fieldName: FieldNameType): void => {
  if (mode.value === 'add' && currentTerm.value[fieldName] === '') {
    // When adding a term and the field is empty
    dirtyFields[fieldName] = false
  } else if (
    mode.value === 'edit' &&
    originalTerm.value &&
    originalTerm.value[fieldName] === currentTerm.value[fieldName]
  ) {
    // When editing a term and the field's value is unchanged
    dirtyFields[fieldName] = false
  } else {
    dirtyFields[fieldName] = true
  }

  dirty.value = Object.values(dirtyFields).reduce((prev, curr) => {
    return curr || prev
  }, false)
}

const toggleModal = (bool: boolean): void => {
  modal.value?.toggleModal(bool)
}

const toggleModalUnsavedWarning = (bool: boolean): void => {
  modalUnsavedWarning.value?.toggleModal(bool)
}

const editTerm = (originalEditTerm: TermType | null, editMode: 'add' | 'edit' = 'edit'): void => {
  originalTerm.value = originalEditTerm
  mode.value = editMode

  if (originalEditTerm) {
    currentTerm.value.date = originalEditTerm.date
  }

  for (const field of fields) {
    if (!field.immutable) {
      if (mode.value === 'edit' && originalEditTerm) {
        // Populate fields with term values
        if(field.name === 'type') {
          currentTerm.value[field.name] = originalEditTerm[field.name]
        } else {
          currentTerm.value[field.name] = originalEditTerm[field.name] || ''
        }
      } else {
        // Reset fields
        if(field.name === 'type') {
          currentTerm.value[field.name] = undefined
        } else {
          currentTerm.value[field.name] = ''
        }
      }
    }
  }

  toggleModal(true)
  const focus = modal.value?.$el.querySelector(
    '.field input, .field textarea, .field select'
  ) as HTMLElement
  if (focus) {
    focus.focus()
  }
}

const addTerm = (): void => {
  editTerm(null, 'add')
}

const saveTerm = (): void => {
  let termObject: TermDefType
  if (mode.value === 'add') {
    termObject = {
      date: new Date().toJSON(),
    }
  } else {
    if (originalTerm.value === null) {
      return
    }
    termObject = {
      _id: originalTerm.value._id,
      date: originalTerm.value._id,
    }
  }

  for (const field of fields) {
    if (!field.immutable && currentTerm.value[field.name]) {
      if(field.name === 'type') {
        termObject[field.name] = currentTerm.value[field.name]
        currentTerm.value[field.name] = undefined
      } else {
        termObject[field.name] = currentTerm.value[field.name] || ''
        currentTerm.value[field.name] = ''
      }
    }
  }

  emit('save', termObject)

  toggleModal(false)
  toggleModalUnsavedWarning(false)

  originalTerm.value = null
  dirty.value = false
}

const close = (): void => {
  if (dirty.value) {
    toggleModalUnsavedWarning(true)
  } else {
    toggleModal(false)
    toggleModalUnsavedWarning(false)
  }
}

const discard = (): void => {
  dirty.value = false
  close()
}

const reduce = (options: string[]): SelectOptionType[] => {
  return options.reduce((allOptions: SelectOptionType[], option) => {
    allOptions.push({
      name: option,
      ui: ui.wordClasses[option],
    })
    return allOptions
  }, [])
}

for (const field of fields) {
  if (!field.immutable) {
    debouncedChangeHandlers[field.name] = debounce(
      handleDirty.bind(this, field.name),
      400
    )
    dirtyFields[field.name] = false
  }
}

defineExpose({
  addTerm,
  editTerm,
})
</script>
<style>
</style>

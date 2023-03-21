<template>
  <form @submit.prevent>
    <AppModal is-active :title="ui.editterm" @close="close">
      <template #modal-body>
        Dirty: {{ dirty }}
        <AppInputField
          v-for="field in mutableFields"
          :key="field.name"
          :label="(field.name !== '' && ui[field.name]) || undefined"
          help-danger
        >
          <AppInput
            v-if="field.type === 'short'"
            v-model="currentTerm[field.name]"
            :autofocus="field.name === 'term'"
          />
          <textarea
            v-else-if="field.type === 'long'"
            v-model="currentTerm[field.name]"
            class="textarea"
            rows="8"
          />
          <AppSelect
            v-else-if="
              field.type === 'select' && field.options instanceof Array
            "
            v-model="currentTerm[field.name]"
            :default-option-name="ui.selectTermType"
            :options="reduce(field.options)"
            fullwidth
          />
          <template #help>
            <AppZodError
              v-if="errors && field.name !== ''"
              :errors="errors"
              :field-name="field.name"
            />
          </template>
        </AppInputField>
      </template>
      <template #modal-footer>
        <AppButton
          primary
          :loading="loading"
          :disabled="!valid"
          type="submit"
          accesskey="s"
          @click="saveTerm"
          >{{ ui.save }}</AppButton
        >
        <AppButton @click="close">{{ ui.cancel }}</AppButton>
      </template>
    </AppModal>
    <AppModal
      :is-active="showUnsavedWarningModal"
      :title="ui.unsavedWarningTitle"
      @close="() => (showUnsavedWarningModal = false)"
    >
      <template #modal-body>{{ ui.unsavedWarningText }}</template>
      <template #modal-footer>
        <AppButton primary :loading="loading" @click="saveTerm">{{
          ui.save
        }}</AppButton>
        <AppButton danger @click="discard">{{ ui.discard }}</AppButton>
      </template>
    </AppModal>
  </form>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import compare from 'just-compare'
import debounce from 'just-debounce-it'
import type { ZodError } from 'zod'
import AppModal from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import AppInput from '../Generic/AppInput.vue'
import AppInputField from '../Generic/AppInputField.vue'
import AppSelect from '../Generic/AppSelect.vue'
import AppZodError from '../Generic/AppZodError.vue'
import { useTermsStore } from '@/stores/terms'
import { globalService } from '@/machines/globalService'
import { FieldType } from '@/types/FieldType'
import {
  Term,
  TermDef,
  type TermDefType,
  type TermType,
} from '@/types/TermType'
import type { SelectOptionType } from '@/types/SelectOptionType'

import ui from '@/assets/ui'
import fields from '@/assets/fields'

const props = defineProps<{ term?: TermDefType }>()

const termsStore = useTermsStore()

const showUnsavedWarningModal = ref(false)
const originalTerm = ref<TermDefType>(
  props.term
    ? {
        date: props.term?.date,
        desc: props.term?.desc,
        term: props.term?.term,
        type: props.term?.type,
      }
    : {
        date: new Date().toJSON(),
        desc: '',
        term: '',
        type: undefined,
      }
)
const currentTerm = ref<TermDefType>({
  date: originalTerm.value.date,
  desc: originalTerm.value.desc,
  term: originalTerm.value.term,
  type: originalTerm.value.type,
})

const dirty = computed(
  (): boolean => !compare(currentTerm.value, originalTerm.value)
)
const loading = ref(false)
const valid = ref(false)
const errors = ref<ZodError<TermDefType>>()

watch(
  currentTerm.value,
  debounce(() => {
    const result = TermDef.safeParse(currentTerm.value)
    errors.value = result.success ? undefined : result.error
    valid.value = result.success
  }, 400)
)

const mutableFields = computed((): FieldType[] =>
  fields.filter(field => !field.immutable)
)

const saveTerm = async () => {
  let termObject: TermDefType
  if (props.term) {
    if (!props.term?._id) {
      return
    }
    termObject = {
      _id: props.term._id,
      date: props.term._id,
      term: props.term.term,
    }
  } else {
    termObject = {
      date: currentTerm.value.date,
      _id: currentTerm.value.date,
      term: '',
    }
  }

  loading.value = true

  // Save to the term object
  for (const field of fields) {
    if (!field.immutable && currentTerm.value[field.name]) {
      if (field.name === 'type') {
        termObject[field.name] = currentTerm.value[field.name]
      } else {
        termObject[field.name] = currentTerm.value[field.name] || ''
      }
    }
  }

  if (props.term) {
    // Update existing term
    await termsStore.save(Term.parse(termObject))
  } else {
    // Add new term
    await termsStore.add(Term.parse(termObject))
  }

  loading.value = false
}

const close = () => {
  if (dirty.value) {
    showUnsavedWarningModal.value = true
  } else {
    globalService.send('CANCEL')
  }
}

const discard = () => globalService.send('CANCEL')

const reduce = (options: string[]): SelectOptionType[] =>
  options.reduce((allOptions: SelectOptionType[], option) => {
    allOptions.push({
      name: option,
      ui: ui.wordClasses[option as NonNullable<TermType['type']>],
    })
    return allOptions
  }, [])
</script>

<style lang="scss">
@import '@/assets/includes';
@import 'bulma/sass/form/shared';
@import 'bulma/sass/form/tools';
@import 'bulma/sass/form/input-textarea';
</style>

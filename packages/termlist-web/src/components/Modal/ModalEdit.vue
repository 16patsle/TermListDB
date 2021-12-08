<template>
  <form @submit.prevent>
    <AppModal ref="modal" :is-active="true" :title="ui.editterm" @close="close">
      <template #modal-body>
        Dirty: {{ dirty }}
        <div v-for="field in mutableFields" :key="field.name" class="field">
          <label class="label">{{ field.name !== '' && ui[field.name] }}</label>
          <div class="control">
            <input
              v-if="field.type === 'short'"
              :ref="field.name === 'term' ? 'firstInput' : undefined"
              v-model="currentTerm[field.name]"
              class="input"
              type="text"
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
          </div>
        </div>
      </template>
      <template #modal-footer>
        <AppButton
          primary
          :loading="loading"
          :disabled="currentTerm.term === ''"
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
import { computed, onMounted, ref } from 'vue'
import compare from 'just-compare'
import AppModal from '../Generic/AppModal.vue'
import AppButton from '../Generic/AppButton.vue'
import AppSelect from '../Generic/AppSelect.vue'
import { useTermsStore } from '../../stores/terms'
import { globalService } from '../../machines/globalService'
import { FieldType } from '../../types/FieldType'
import type { TermDefType, TermType } from '../../types/TermType'
import type { SelectOptionType } from '../../types/SelectOptionType'

import ui from '../../assets/ui'
import fields from '../../assets/fields'

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

const modal = ref<InstanceType<typeof AppModal>>()

const mutableFields = computed((): FieldType[] =>
  fields.filter(field => !field.immutable)
)

const firstInput = ref<HTMLInputElement>()

onMounted(() => {
  firstInput.value?.focus()
})

const saveTerm = async () => {
  let termObject: TermDefType
  if (props.term) {
    if (!props.term?._id) {
      return
    }
    termObject = {
      _id: props.term._id,
      date: props.term._id,
    }
  } else {
    termObject = {
      date: currentTerm.value.date,
      _id: currentTerm.value.date,
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
    await termsStore.save(termObject as TermType)
  } else {
    // Add new term
    await termsStore.add(termObject as TermType)
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

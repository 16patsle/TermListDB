<template>
  <form @submit.prevent>
    <AppModal ref="modal" :title="ui.addterm">
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
        <!--<AppButton :primary="true" @click="saveTerm">{{ ui.add }}</AppButton>-->
        <input
          :value="ui.add"
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

const ModalAddProps = Vue.extend({
  props: {
    ui: {
      type: Object,
      required: true,
    },
    fields: {
      type: Array,
      required: true,
    },
  },
})

@Component({
  components: {
    AppModal,
    AppButton,
    AppSelect,
  },
})
export default class ModalAdd extends ModalAddProps {
  $refs!: {
    modal: AppModal
  }
  fields!: FieldType[]

  get mutableFields(): FieldType[] {
    return this.fields.filter(field => {
      return !field.immutable
    })
  }

  toggleModal(bool: boolean): void {
    this.$refs.modal.toggleModal(bool)
  }

  addTerm(): void {
    this.toggleModal(true)
    this.$refs.modal.$el
      .querySelector('.field input, .field textarea, .field select')
      .focus()
  }

  saveTerm(): void {
    const date = new Date().toJSON()
    let termObject: TermType = {
      _id: date,
      date,
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
  }

  close(): void {
    this.toggleModal(false)
  }

  reduce(options: string[]): SelectOptionType[] {
    return options.reduce((allFields: SelectOptionType[], option) => {
      allFields.push({
        name: option,
        ui: this.ui.wordClasses[option],
      })
      return allFields
    }, [])
  }
}
</script>
<style></style>

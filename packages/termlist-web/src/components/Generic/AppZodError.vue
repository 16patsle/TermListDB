<template>
  <p v-for="error in errors.formErrors.fieldErrors[fieldName]" :key="error.toString()">{{ error }}</p>
</template>
<script lang="ts" setup>
import { TermDefType } from '@/types/TermType';
import { ZodError } from 'zod';

defineProps<{ errors: ZodError<TermDefType>, fieldName: keyof TermDefType }>()
</script>
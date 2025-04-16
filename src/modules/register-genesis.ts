import { addComponent, defineNuxtModule, addImports } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'cf-genesis',
    configKey: 'genesis',
  },
  setup() {
    /** Components */
    const components = new Set([
      'Button',
      'Card',
      'Center',
      'Clamp',
      'DataTable',
      'FieldCheckbox',
      'FieldCurrency',
      'FieldPercentage',
      'FieldSelect',
      'FieldText',
      'FieldWrapper',
      'Flex',
      'FlexSpace',
      'FormWithValidation',
      'Grid',
      'Notice',
      'Skeleton',
      'Tooltip',
    ])

    components.forEach((name) => {
      addComponent({ name, filePath: '@christfirst/genesis', export: name })
    })

    /** Utils */
    const utils = new Set(['formatCapitalize', 'formatCurrency', 'formatDate', 'formatPercentage'])

    utils.forEach((name) => {
      addImports({ name, from: '@christfirst/genesis/utils' })
    })

    /** Use */
    const use = new Set(['useBindableGap', 'useBreakpoint', 'useForm', 'useSteps'])

    use.forEach((name) => {
      addImports({ name, from: '@christfirst/genesis/use' })
    })

    /** Validation */
    const validation = new Set(['defineGlobalRules', 'defineRule'])

    validation.forEach((name) => {
      addImports({ name, from: '@christfirst/genesis/validation' })
    })
  },
})

<script setup lang="ts" generic="T">
  import * as yup from 'yup'
  import {
    CategoriesDocument,
    DisciplinesByTypeDocument,
    FestivalClassSearchDocument,
    InstrumentsDocument,
    LevelsDocument,
    SubdisciplinesByTypeDocument,
  } from '@/graphql/gql/graphql'
  import { logErrorMessages } from '@vue/apollo-util'
  import { useClasses } from '@/stores/userClasses'
  import { useAppStore } from '@/stores/appStore'
  import { usePerformers } from '@/stores/userPerformer'
  import type {
    FestivalClass,
    RegisteredClass,
    RegisteredClassInput,
  } from '@/graphql/gql/graphql'
  import type { Status } from '@/composables/types'
  import { StatusEnum } from '@/composables/types'
  import { TRUE } from 'sass'

  const props = defineProps<{
    modelValue: RegisteredClass
    classIndex: number
    classId: number
  }>()

  const emits = defineEmits<{ 'update:modelValue': [RegisteredClassInput] }>()

  const status = reactive<Status>({
    discipline: StatusEnum.null,
    subdiscipline: StatusEnum.null,
    level: StatusEnum.null,
    category: StatusEnum.null,
    schoolGroup: StatusEnum.null,
    instrument: StatusEnum.null,
  })

  const instrumentRequired = ref(false)
  const appStore = useAppStore()
  const performerStore = usePerformers()
  const classesStore = useClasses()
  const classSelection = ref(<FestivalClass>{}) // component variable
  const loadInfoFirstRun = ref(true)

  const selectedClasses = computed({
    // used to emit values back to parent
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  })

  onMounted(async () => {
    if (props.modelValue.subdiscipline) {
      loadSubdisciplines()
    }
    if (props.modelValue.level) {
      loadLevels()
    }
    if (props.modelValue.category) {
      loadCategories()
      selectedClasses.value.numberOfSelections =
        props.modelValue.numberOfSelections
      loadInfoFirstRun.value = true
      loadClassInformation()
    }
  })

  const { result: instrumentQuery, onError: instrumentsError } =
    useQuery(InstrumentsDocument)
  const instruments = computed(() => instrumentQuery.value.instruments ?? [])
  instrumentsError((error) => {
    console.log(error)
  })

  /**
   * Disciplines
   */
  const { result: disciplineQuery, onError: errorDisciplines } = useQuery(
    DisciplinesByTypeDocument,
    () => ({
      performerType: appStore.performerType,
    }),
    { fetchPolicy: 'network-only' }
  )
  errorDisciplines((error) => {
    console.log(error)
  })
  const disciplines = computed(() => disciplineQuery.value?.disciplines ?? [])
  const chosenDiscipline = computed(() => {
    return (
      disciplines.value.find((item: any) => {
        return item.name === selectedClasses.value.discipline
      }) ?? {}
    )
  })

  /**
   * Subdisciplines
   */
  const {
    result: subdisc,
    load: loadSubdisciplines,
    onError: errorSubdisciplines,
  } = useLazyQuery(
    SubdisciplinesByTypeDocument,
    () => ({
      disciplineId: chosenDiscipline.value.id,
      performerType: appStore.performerType,
    }),
    { fetchPolicy: 'network-only' }
  )
  errorSubdisciplines((error) => {
    console.log(error)
  })
  const subdisciplines = computed(() => subdisc.value?.subdisciplines ?? [])
  const chosenSubdiscipline = computed(() => {
    return (
      subdisciplines.value.find((item: any) => {
        return item.name === selectedClasses.value.subdiscipline
      }) ?? {}
    )
  })

  /**
   * Grades / Levels
   */
  const {
    result: gradeLevels,
    load: loadLevels,
    onError: errorLevel,
  } = useLazyQuery(
    LevelsDocument,
    () => ({
      subdisciplineId: chosenSubdiscipline.value.id,
    }),
    { fetchPolicy: 'network-only' }
  )
  errorLevel((error) => console.log(error))
  const levels = computed(() => gradeLevels.value?.levels ?? [])
  const chosenGradeLevel = computed(() => {
    return (
      levels.value.find((item: any) => {
        return item.name === selectedClasses.value.level
      }) ?? {}
    )
  })

  /**
   * Categories
   */
  const {
    result: cat,
    load: loadCategories,
    onError: errorCategories,
  } = useLazyQuery(
    CategoriesDocument,
    () => ({
      subdisciplineId: chosenSubdiscipline.value.id,
      levelId: chosenGradeLevel.value.id,
    }),
    { fetchPolicy: 'network-only' }
  )
  errorCategories((error) => console.log(error))
  const categories = computed(() => cat.value?.categories ?? [])
  const chosenCategory = computed(() => {
    return (
      categories.value.find((item: any) => {
        return item.name === selectedClasses.value.category
      }) ?? {}
    )
  })

  /**
   * ClassName
   */
  const className = computed(() => {
    if (
      selectedClasses.value.subdiscipline &&
      selectedClasses.value.level &&
      selectedClasses.value.category
    ) {
      return `${selectedClasses.value.subdiscipline} - ${selectedClasses.value.level} - ${selectedClasses.value.category}`
    } else {
      return ''
    }
  })

  /**
   * Class Search for details incl. Number
   * Full result it copied to classSelection.
   * Run after category is selected in festival class
   */
  const {
    load: loadClassInformation,
    onResult: onClassSearchResult,
    onError: errorClass,
  } = useLazyQuery(
    FestivalClassSearchDocument,
    () => ({
      festivalClassSearch: {
        subdisciplineID: chosenSubdiscipline.value.id,
        levelID: chosenGradeLevel.value.id,
        categoryID: chosenCategory.value.id,
      },
    }),
    { fetchPolicy: 'network-only' }
  )
  onClassSearchResult((result) => {
    classSelection.value = result.data.festivalClassSearch[0]
    selectedClasses.value.minSelections = classSelection.value.minSelections
    selectedClasses.value.maxSelections = classSelection.value.maxSelections

    if (
      loadInfoFirstRun.value === true &&
      !selectedClasses.value.numberOfSelections
    ) {
      selectedClasses.value.numberOfSelections =
        classSelection.value.minSelections
    } else if (loadInfoFirstRun.value === false) {
      selectedClasses.value.numberOfSelections =
        classSelection.value.minSelections
    }
    selectedClasses.value.classNumber = classSelection.value.classNumber
    instrumentRequired.value = classesStore.MOZART_CLASSES.includes(
      classSelection.value.classNumber
    )
    classesStore.updateClass(props.classId)
    loadInfoFirstRun.value = false
  })
  errorClass((error) => {
    logErrorMessages(error)
  })

  const notes = computed(() => {
    if (
      chosenSubdiscipline.value.description ||
      chosenGradeLevel.value.description ||
      chosenCategory.value.description ||
      (classSelection.value.trophies ?? []).length > 0
    ) {
      return true
    }
    return false
  })

  /**
   * Watchers for changes in discipline, subdiscipline
   * level and category.
   */
  watch(
    () => selectedClasses.value.discipline,
    async (newDiscipline, oldDiscipline) => {
      selectedClasses.value.subdiscipline = null
      if (newDiscipline !== oldDiscipline) {
        status.discipline = StatusEnum.saving
        await classesStore.updateClass(props.classId, 'discipline')
        newDiscipline !== null
          ? (status.discipline = StatusEnum.saved)
          : (status.discipline = StatusEnum.null)
      }
      loadSubdisciplines()
    }
  )

  watch(
    () => selectedClasses.value.subdiscipline,
    async (newSubdiscipline, oldSubdiscipline) => {
      selectedClasses.value.level = null
      if (newSubdiscipline !== oldSubdiscipline) {
        status.subdiscipline = StatusEnum.saving
        await classesStore.updateClass(props.classId, 'subdiscipline')
        newSubdiscipline !== null
          ? (status.subdiscipline = StatusEnum.saved)
          : (status.subdiscipline = StatusEnum.null)
      }
      if (selectedClasses.value.subdiscipline !== null) {
        loadLevels()
      }
    }
  )

  watch(
    () => selectedClasses.value.level,
    async (newLevel, oldLevel) => {
      selectedClasses.value.category = null
      if (newLevel !== oldLevel) {
        status.level = StatusEnum.saving
        await classesStore.updateClass(props.classId, 'level')
        newLevel !== null
          ? (status.level = StatusEnum.saved)
          : (status.level = StatusEnum.null)
      }
      if (selectedClasses.value.level !== null) {
        loadCategories()
      }
    }
  )

  watch(
    () => selectedClasses.value.category,
    async (newCategory, oldCategory) => {
      if (newCategory !== oldCategory) {
        status.category = StatusEnum.saving
        await classesStore.updateClass(props.classId, 'category')
        newCategory !== null
          ? (status.category = StatusEnum.saved)
          : (status.category = StatusEnum.null)
      }
      if (selectedClasses.value.category === null) {
        selectedClasses.value.classNumber = null
      } else {
        loadClassInformation()
      }
    }
  )

  /**
   * Number of Allowed Works in class to choose from
   */
  const numberOfAllowedWorks = computed(() => {
    let minWorks = classSelection.value.minSelections!
    let maxWorks = classSelection.value.maxSelections!
    if (minWorks === maxWorks) {
      selectedClasses.value.numberOfSelections = minWorks
    }
    const selectionOptions = []
    for (let i = minWorks; i <= maxWorks; i++) {
      selectionOptions.push({ value: i, label: `${i.toString()} Selections` })
    }
    return selectionOptions
  })

  /**
   * Updating number of selections to show based on what is chosen
   */
  watch(
    () => selectedClasses.value.numberOfSelections,
    async (newNumber) => {
      console.log('running watch')
      let oldNumber =
        classesStore.registeredClasses[props.classIndex].selections!.length
      if (oldNumber < newNumber!) {
        while (oldNumber < newNumber!) {
          await classesStore
            .createSelection(props.classId)
            .catch((error) => console.log(error))
          oldNumber += 1
        }
      } else if (oldNumber > newNumber!) {
        while (oldNumber > newNumber!) {
          const selectionLength =
            classesStore.registeredClasses[props.classIndex].selections!.length
          const selectionId =
            classesStore.registeredClasses[props.classIndex].selections![
              selectionLength - 1
            ].id
          await classesStore
            .deleteSelection(props.classId, selectionId)
            .catch((error) => console.log(error))
          oldNumber -= 1
        }
      }
      await classesStore.updateClass(props.classId, 'numberOfSelections')
    }
  )

  const validationSchema = toTypedSchema(
    yup.object({
      festivalClass: yup.array().of(
        yup.object({
          discipline: yup.string().required('Choose a discipline'),
          subdiscipline: yup.string().required('Choose a subdiscipline'),
          level: yup.string().required('Choose a grade/level'),
          category: yup.string().required('Choose a category'),
          instrument: yup.string().nullable(),
          selection: yup.array().of(
            yup.object({
              title: yup
                .string()
                .trim()
                .required('Enter the title of the selection'),
              composer: yup
                .string()
                .trim()
                .required('Enter the name of the composer'),
              largerWork: yup.string().trim().nullable(),
              movement: yup.string().trim().nullable(),
              duration: yup
                .string()
                .trim()
                .required('Indicate total duration of selection'),
            })
          ),
        })
      ),
    })
  )

  useForm({ validationSchema })
</script>

<template>
  <div>
    <div
      v-auto-animate
      class="grid grid-cols-12 gap-x-3 gap-y-5 items-end">
      <div class="col-span-6 lg:col-span-2">
        <BaseSelect
          id=""
          v-model="selectedClasses.discipline"
          :status="status.discipline"
          label="Discipline"
          :name="`festivalClass_${classId}.discipline`"
          :options="disciplines" />
      </div>
      <div class="col-span-6 lg:col-span-3">
        <BaseSelect
          v-model="selectedClasses.subdiscipline"
          :status="status.subdiscipline"
          :class="selectedClasses.discipline ? '' : 'off'"
          label="Subdiscipline"
          :name="`festivalClass_${classId}.subdiscipline`"
          :options="subdisciplines"
          :disabled="!selectedClasses.discipline" />
      </div>
      <div class="col-span-6 lg:col-span-3">
        <BaseSelect
          v-model="selectedClasses.level"
          :status="status.level"
          :class="selectedClasses.subdiscipline ? '' : 'off'"
          label="Grade/Level"
          :name="`festivalClass_${classId}.level`"
          :options="levels"
          :disabled="!selectedClasses.subdiscipline" />
      </div>
      <div class="col-span-6 lg:col-span-4">
        <BaseSelect
          v-model="selectedClasses.category"
          :status="status.category"
          :class="selectedClasses.level ? '' : 'off'"
          label="Category"
          :name="`festivalClass_${classId}.category`"
          :options="categories"
          :disabled="!selectedClasses.level" />
      </div>
    </div>
    <div v-if="className">
      <div class="col-span-12 md:col-span-12">
        <p class="text-2xl text-center font-bold">
          Class {{ classSelection.classNumber }} - {{ className }}
        </p>
      </div>
      <div
        v-if="instrumentRequired"
        class="col-span-12">
        <BaseSelect
          id="instrument"
          v-model="performerStore.performers[0].instrument"
          :status="status.instrument"
          :options="instruments"
          label="Instrument"
          :name="`festivalClass_${classId}.instrument`" />
      </div>

      <div
        v-if="(classSelection.trophies ?? []).length > 0"
        v-auto-animate>
        <h4>Trophy Eligibility</h4>
        <div
          v-for="trophy in classSelection.trophies"
          :key="trophy.id">
          <h6>{{ trophy.name }}:</h6>
          <p class="text-sm pb-2">
            {{ trophy.description }}
          </p>
        </div>
      </div>
      <div
        v-if="notes"
        class="col-span-12">
        <h4 class="pb-2">Notes</h4>
        <div
          v-if="chosenSubdiscipline.description"
          v-auto-animate>
          <h5>Subdiscipline</h5>
          <p class="text-sm pb-2">
            {{ chosenSubdiscipline.description }}
          </p>
        </div>
        <div
          v-if="chosenGradeLevel.description"
          v-auto-animate>
          <h5>Grade / Level</h5>
          <p class="text-sm pb-2">
            {{ chosenGradeLevel.description }}
          </p>
        </div>
        <div
          v-if="chosenCategory.description"
          v-auto-animate>
          <h5>Category</h5>
          <p class="text-sm pb-2">
            {{ chosenCategory.description }}
          </p>
        </div>
      </div>
      <div
        v-if="classSelection.minSelections !== classSelection.maxSelections"
        class="col-span-3 md:col-span-2">
        <BaseRadioGroup
          v-model="selectedClasses.numberOfSelections"
          :name="`${selectedClasses.classNumber} Selections`"
          :vertical="true"
          :options="numberOfAllowedWorks" />
      </div>
      <FormWorksSelection
        v-for="(selection, selectionIndex) in selectedClasses.selections"
        :key="selection.id"
        v-model="selectedClasses.selections![selectionIndex]"
        :selection-index="selectionIndex"
        :selection-id="selection.id"
        :class-id="classId"
        :class-index="classIndex" />
    </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts" generic="T">
  import {
    CategoriesDocument,
    DisciplinesByTypeDocument,
    FestivalClassSearchDocument,
    InstrumentsDocument,
    LevelsDocument,
    SubdisciplinesByTypeDocument,
  } from '@/graphql/gql/graphql'
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
  const selectedClasses = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
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
  const chosenSubdiscipline = computed({
    get: () => {
      return (
        subdisciplines.value.find((item: any) => {
          return item.name === selectedClasses.value.subdiscipline
        }) ?? {}
      )
    },
    set: (newValue) => newValue,
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
  const chosenGradeLevel = computed({
    get: () => {
      return (
        levels.value.find((item: any) => {
          return item.name === selectedClasses.value.level
        }) ?? {}
      )
    },
    set: (newValue) => newValue,
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
  const chosenCategory = computed({
    get: () => {
      return (
        categories.value.find((item: any) => {
          return item.name === selectedClasses.value.category
        }) ?? {}
      )
    },
    set: (newValue) => newValue,
  })

  /**
   * ClassName
   */
  const className = computed({
    get: () => {
      if (
        selectedClasses.value.subdiscipline &&
        selectedClasses.value.level &&
        selectedClasses.value.category
      ) {
        return `${selectedClasses.value.subdiscipline} - ${selectedClasses.value.level} - ${selectedClasses.value.category}`
      } else {
        return ''
      }
    },
    set: (newValue) => newValue,
  })

  /**
   * Class Search for details incl. Number
   */
  const {
    result: classSearch,
    load: loadClassNumber,
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
  errorClass((error) => console.log(error))
  const classSelection = computed<FestivalClass>({
    get: () => {
      if (
        chosenSubdiscipline.value.id &&
        chosenGradeLevel.value.id &&
        chosenCategory.value.id
      ) {
        return classSearch?.value?.festivalClassSearch[0] ?? []
      } else {
        return []
      }
    },
    set: (newValue) => newValue,
  })

  watch(
    () => selectedClasses.value.classNumber,
    (newClassNumber) => {
      instrumentRequired.value = classesStore.MOZART_CLASSES.includes(
        newClassNumber!
      )
    }
  )

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

  watch(
    () => classesStore.registeredClasses[props.classIndex].discipline,
    () => {
      selectedClasses.value.subdiscipline = null
      chosenSubdiscipline.value = { id: '', name: '' }
      loadSubdisciplines()
    }
  )

  watch(
    () => classesStore.registeredClasses[props.classIndex].subdiscipline,
    () => {
      selectedClasses.value.level = null
      chosenGradeLevel.value = { id: '', name: '' }
      if (selectedClasses.value.subdiscipline !== null) {
        loadLevels()
      }
    }
  )

  watch(
    () => classesStore.registeredClasses[props.classIndex].level,
    () => {
      selectedClasses.value.category = null
      chosenCategory.value = { id: '', name: '' }
      if (selectedClasses.value.level !== null) {
        loadCategories()
      }
    }
  )

  watch(
    () => classesStore.registeredClasses[props.classIndex].category,
    async (newValue, oldValue) => {
      if (newValue === null) {
        status.category = StatusEnum.null
        status.discipline = StatusEnum.null
        status.subdiscipline = StatusEnum.null
        status.level = StatusEnum.null
        await classesStore.updateClass(props.classId)
        selectedClasses.value.classNumber = null
      } else {
        selectedClasses.value.classNumber = null
        loadClassNumber()
      }
    }
  )

  /**
   * Number of Allowed Works
   */
  const numberOfAllowedWorks = computed(() => {
    const minWorks = selectedClasses.value.minSelections!
    const maxWorks = selectedClasses.value.maxSelections!
    const selectionOptions = []
    for (let i = minWorks; i <= maxWorks; i++) {
      selectionOptions.push({ value: i, label: `${i.toString()} Selections` })
    }
    return selectionOptions
  })

  /**
   * Updating number of selections
   */
  watch(
    () => classesStore.registeredClasses[props.classIndex].numberOfSelections,
    async (newNumber) => {
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

  watch(classSelection, async (newClassSelection) => {
    status.category = StatusEnum.saving
    status.discipline = StatusEnum.saving
    status.subdiscipline = StatusEnum.saving
    status.level = StatusEnum.saving

    classesStore.registeredClasses[props.classIndex].price =
      newClassSelection.price
    selectedClasses.value.classNumber = newClassSelection.classNumber
    selectedClasses.value.minSelections = newClassSelection.minSelections
    selectedClasses.value.maxSelections = newClassSelection.maxSelections
    selectedClasses.value.numberOfSelections = newClassSelection.minSelections

    await classesStore.updateClass(props.classId)

    status.category = StatusEnum.saved
    status.discipline = StatusEnum.saved
    status.subdiscipline = StatusEnum.saved
    status.level = StatusEnum.saved
  })

  onMounted(() => {
    loadSubdisciplines()
    loadLevels()
    loadCategories()
    loadClassNumber()
  })
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
          name="discipline"
          :options="disciplines" />
      </div>
      <div class="col-span-6 lg:col-span-3">
        <BaseSelect
          v-model="selectedClasses.subdiscipline"
          :status="status.subdiscipline"
          :class="selectedClasses.discipline ? '' : 'off'"
          label="Subdiscipline"
          name="subdiscipline"
          :options="subdisciplines"
          :disabled="!selectedClasses.discipline" />
      </div>
      <div class="col-span-6 lg:col-span-3">
        <BaseSelect
          v-model="selectedClasses.level"
          :status="status.level"
          :class="selectedClasses.subdiscipline ? '' : 'off'"
          label="Grade/Level"
          name="level"
          :options="levels"
          :disabled="!selectedClasses.subdiscipline" />
      </div>
      <div class="col-span-6 lg:col-span-4">
        <BaseSelect
          v-model="selectedClasses.category"
          :status="status.category"
          :class="selectedClasses.level ? '' : 'off'"
          label="Category"
          name="category"
          :options="categories"
          :disabled="!selectedClasses.level" />
      </div>
      <div
        v-if="className"
        class="col-span-12 md:col-span-12">
        <p class="text-2xl text-center font-bold">
          Class {{ selectedClasses.classNumber }} - {{ className }}
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
          name="instrument" />
      </div>
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
        :selectionIndex="selectionIndex"
        :selectionId="selection.id"
        :classId="classId"
        :classIndex="classIndex" />
    </div>
  </div>
</template>

<style scoped></style>

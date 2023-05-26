<script lang="ts" setup>
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

  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    classIndex: {
      type: Number,
      default: 0,
    },
  })

  const emits = defineEmits(['update:modelValue'])
  const instrumentRequired = ref(false)
  const appStore = useAppStore()
  const performerStore = usePerformers()
  const classesStore = useClasses()
  const selectedClasses = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  })

  const { result: instrumentQuery, error: instrumentsError } =
    useQuery(InstrumentsDocument)
  const instruments = computed(() => instrumentQuery.value.instruments ?? [])
  if (instrumentsError) {
    console.log(instrumentsError)
  }

  watch(
    () => selectedClasses.value.classNumber,
    (classNumber: string) => {
      instrumentRequired.value =
        classesStore.MOZART_CLASSES.includes(classNumber)
    }
  )

  /**
   * Disciplines
   */
  const { result: disc, error: discError } = useQuery(
    DisciplinesByTypeDocument,
    () => ({
      performerType: appStore.performerType,
    })
  )
  if (discError) {
    console.log(discError)
  }
  const disciplines = computed(() => disc.value?.disciplinesByType ?? [])
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
    load: subdiscLoad,
    error: subdiscError,
  } = useLazyQuery(
    SubdisciplinesByTypeDocument,
    () => ({
      disciplineId: chosenDiscipline.value.id,
      performerType: appStore.performerType,
    }),
    { fetchPolicy: 'network-only' }
  )
  if (subdiscError) {
    console.log(subdiscError)
  }
  const subdisciplines = computed(
    () => subdisc.value?.subdisciplinesByType ?? []
  )
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
    result: gradeLevel,
    load: gradeLevelLoad,
    error: levelError,
  } = useLazyQuery(
    LevelsDocument,
    () => ({
      subdisciplineId: chosenSubdiscipline.value.id,
    }),
    { fetchPolicy: 'network-only' }
  )
  if (levelError) {
    console.log(levelError)
  }
  const levels = computed(() => gradeLevel.value?.levels ?? [])
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
    load: catLoad,
    error: catError,
  } = useLazyQuery(
    CategoriesDocument,
    () => ({
      subdisciplineId: chosenSubdiscipline.value.id,
      levelId: chosenGradeLevel.value.id,
    }),
    { fetchPolicy: 'network-only' }
  )
  if (catError) {
    console.log(catError)
  }
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
    load: classNumberLoad,
    error: classError,
  } = useLazyQuery(
    FestivalClassSearchDocument,
    () => ({
      classSearchArgs: {
        subdisciplineID: chosenSubdiscipline.value.id,
        levelID: chosenGradeLevel.value.id,
        categoryID: chosenCategory.value.id,
      },
    }),
    { fetchPolicy: 'network-only' }
  )
  if (classError) {
    console.log(classError)
  }
  const classSelection = computed({
    get: () => {
      if (
        chosenSubdiscipline.value.id &&
        chosenGradeLevel.value.id &&
        chosenCategory.value.id
      )
        return classSearch?.value?.classSearch[0] ?? []
      else return []
    },
    set: (newValue) => newValue,
  })

  const notes = computed(() => {
    if (
      chosenSubdiscipline.value.description ||
      chosenGradeLevel.value.description ||
      chosenCategory.value.description ||
      (classSelection.value.trophies ?? []).length > 0
    )
      return true
    return false
  })

  /**
   * Number of Allowed Works
   */
  const minWorks = computed(() => {
    return classSearch.value?.classSearch[0].minSelection ?? null
  })
  const maxWorks = computed(() => {
    return classSearch.value?.classSearch[0].maxSelection ?? null
  })
  const numberOfAllowedWorks = computed(() => {
    if (minWorks.value === maxWorks.value) {
      return [{ id: minWorks.value, name: minWorks.value }]
    } else {
      const selectionOptions = []
      for (let i = minWorks.value; i <= maxWorks.value; i++)
        selectionOptions.push({ id: i, name: i })

      return selectionOptions
    }
  })

  watch(
    () => selectedClasses.value.discipline,
    () => {
      selectedClasses.value.subdiscipline = null
      chosenSubdiscipline.value = { id: '', name: '' }
      subdiscLoad()
    }
  )

  watch(
    () => selectedClasses.value.subdiscipline,
    () => {
      selectedClasses.value.level = null
      chosenGradeLevel.value = { id: '', name: '' }
      if (selectedClasses.value.subdiscipline !== null) {
        gradeLevelLoad()
      }
    }
  )

  watch(
    () => selectedClasses.value.level,
    () => {
      selectedClasses.value.category = null
      chosenCategory.value = { id: '', name: '' }
      if (selectedClasses.value.level !== null) {
        catLoad()
      }
    }
  )

  watch(
    () => selectedClasses.value.category,
    () => {
      selectedClasses.value.numberOfSelections = null
      selectedClasses.value.className = null
      selectedClasses.value.number = null
      className.value = ''
      classSelection.value = null
      if (selectedClasses.value.category !== null) {
        classNumberLoad()
      }
    }
  )

  /**
   * Updating number of selections
   */
  watch(
    () => selectedClasses.value.numberOfSelections,
    async (newNumber) => {
      let oldNumber =
        classesStore.registeredClasses[props.classIndex].selections!.length
      switch (oldNumber < newNumber) {
        case true:
          while (oldNumber < newNumber) {
            await classesStore
              .createSelection(props.classIndex)
              .catch((error) => console.log(`There was an error!${error}`))
            oldNumber += 1
          }
          break
        case false:
          while (oldNumber > newNumber) {
            await classesStore.deleteSelection(props.classIndex, oldNumber - 1)
            oldNumber -= 1
          }
          break
      }
      await classesStore.updateClass(props.classIndex)
    }
  )

  watch(classSelection, (newClassSelection) => {
    classesStore.registeredClasses[props.classIndex].price =
      newClassSelection.price
  })

  onMounted(() => {
    subdiscLoad()
    gradeLevelLoad()
    catLoad()
    classNumberLoad()
  })
</script>

<template>
  <div
    v-auto-animate
    class="grid grid-cols-12 gap-x-3 gap-y-5 items-end">
    <div class="col-span-6 lg:col-span-2">
      <BaseSelect
        id=""
        v-model="selectedClasses.discipline"
        label="Discipline"
        :options="disciplines" />
    </div>
    <div class="col-span-6 lg:col-span-3">
      <BaseSelect
        v-model="selectedClasses.subdiscipline"
        :class="selectedClasses.discipline ? '' : 'off'"
        label="Subdiscipline"
        :options="subdisciplines"
        :disabled="!selectedClasses.discipline" />
    </div>
    <div class="col-span-6 lg:col-span-3">
      <BaseSelect
        v-model="selectedClasses.level"
        :class="selectedClasses.subdiscipline ? '' : 'off'"
        label="Grade/Level"
        :options="levels"
        :disabled="!selectedClasses.subdiscipline" />
    </div>
    <div class="col-span-6 lg:col-span-4">
      <BaseSelect
        v-model="selectedClasses.category"
        :class="selectedClasses.level ? '' : 'off'"
        label="Category"
        :options="categories"
        :disabled="!selectedClasses.level" />
    </div>
    <div class="col-span-6 md:col-span-2">
      <BaseSelect
        v-model.number="selectedClasses.numberOfSelections"
        :class="selectedClasses.category ? '' : 'off'"
        label="Selections"
        :options="numberOfAllowedWorks"
        :disabled="!selectedClasses.category" />
    </div>
    <div class="col-span-6 md:col-span-2">
      <label for="classNumber">Class Number</label>
      <input
        id="classNumber"
        class="off"
        :value="(selectedClasses.classNumber = classSelection.classNumber)"
        label="Class Number"
        type="text"
        disabled
        aria-disabled="true" />
    </div>
    <div class="col-span-12 md:col-span-8">
      <label for="className">Class Name</label>
      <input
        id="className"
        class="off"
        :value="(selectedClasses.className = className)"
        label="Class Name"
        type="text"
        disabled />
    </div>
    <div
      v-if="instrumentRequired"
      class="col-span-12">
      <BaseSelect
        id="instrument"
        v-model="performerStore.performers[0].instrument"
        :options="instruments"
        label="Instrument" />
    </div>
    <div
      v-if="notes"
      class="col-span-12">
      <h4 class="pb-2">Notes</h4>
      <div
        v-if="chosenSubdiscipline.description"
        v-auto-animate>
        <div class="font-bold">Subdiscipline</div>
        <p class="text-sm pb-2">
          {{ chosenSubdiscipline.description }}
        </p>
      </div>
      <div
        v-if="chosenGradeLevel.description"
        v-auto-animate>
        <div class="font-bold">Grade / Level</div>
        <p class="text-sm pb-2">
          {{ chosenGradeLevel.description }}
        </p>
      </div>
      <div
        v-if="chosenCategory.description"
        v-auto-animate>
        <div class="font-bold">Category</div>
        <p class="text-sm pb-2">
          {{ chosenCategory.description }}
        </p>
      </div>
      <div
        v-if="(classSelection.trophies ?? []).length > 0"
        v-auto-animate>
        <div class="font-bold">Trophy Eligibility</div>
        <div
          v-for="trophy in classSelection.trophies"
          :key="trophy.id">
          <div class="font-semibold text-sm">{{ trophy.name }}:</div>
          <p class="text-sm pb-2">
            {{ trophy.description }}
          </p>
        </div>
      </div>
    </div>
    <div
      v-if="selectedClasses.category"
      v-auto-animate
      class="col-span-12">
      <div v-if="!selectedClasses.numberOfSelections">
        <h4>Please choose the number of selections above.</h4>
      </div>
      <div v-else>
        <FormWorksSelection
          v-for="(selection, selectionIndex) in selectedClasses.selections"
          :key="selectionIndex"
          v-model="selectedClasses.selections[selectionIndex]"
          v-auto-animate
          :work-number="selectionIndex" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
  import * as yup from 'yup'
  import {
    CategoriesDocument,
    DisciplinesByTypeDocument,
    FestivalClassSearchDocument,
    LevelsDocument,
    SubdisciplinesByTypeDocument,
  } from '~/graphql/gql/graphql'
  import { useClasses } from '~/stores/useClasses'
  import { useAppStore } from '~/stores/appStore'
  import { usePerformers } from '~/stores/usePerformer'
  import { useGroup } from '~/stores/useGroup'
  import { useToast } from 'vue-toastification'
  import type {
    Category,
    Discipline,
    DisciplinesByTypeQuery,
    FestivalClass,
    Level,
    RegisteredClass,
    RegisteredClassInput,
    Subdiscipline,
  } from '~/graphql/gql/graphql'

  const props = defineProps<{
    modelValue: RegisteredClass
    classIndex: number
    classId: number
  }>()

  const emits = defineEmits<{
    'update:modelValue': [value: RegisteredClassInput]
  }>()

  const appStore = useAppStore()
  const performerStore = usePerformers()
  const groupStore = useGroup()
  const classesStore = useClasses()
  const classSelection = ref<Partial<FestivalClass>>({}) // Used for Festival Class Search
  const loadInfoFirstRun = ref(true) // Flag to keep track of when to load extra information.
  const fieldConfigStore = useFieldConfig()
  const toast = useToast()

  /**
   * Registration first gets loaded form the 'Registration' page
   * if these values are present in useClasses.registeredClasses,
   * then the background data is loaded for the attributes
   * and used on the page.  It allows for filling the comboboxes with
   * pre-saved data from an existing registration.
   */
  onMounted(async () => {
    await loadDisciplines()
    nextTick()
    if (props.modelValue.subdiscipline) {
      await loadSubdisciplines()
      nextTick()
    }
    if (props.modelValue.level) {
      await loadLevels()
      nextTick()
    }
    if (props.modelValue.category) {
      await loadCategories()
      nextTick()
      selectedClasses.value.numberOfSelections =
        props.modelValue.numberOfSelections
      loadInfoFirstRun.value = true
      await loadClassInformation()
    }
  })

  const status = reactive<Status>({
    discipline: props.modelValue.discipline
      ? StatusEnum.saved
      : StatusEnum.null,
    subdiscipline: props.modelValue.subdiscipline
      ? StatusEnum.saved
      : StatusEnum.null,
    level: props.modelValue.level ? StatusEnum.saved : StatusEnum.null,
    category: props.modelValue.category ? StatusEnum.saved : StatusEnum.null,
    schoolGroupID: props.modelValue.schoolGroupID
      ? StatusEnum.saved
      : StatusEnum.null,
    communityGroupID: props.modelValue.communityGroupID
      ? StatusEnum.saved
      : StatusEnum.null,
  })

  // This is the Registered Class variable - sent to parent as modelValue
  // and then on to the classesStore.registeredClasses from there.
  const selectedClasses = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  })

  const classKeys = fieldConfigStore.performerTypeFields('FestivalClasses')
  watchEffect(() => {
    const index = classesStore.classErrors.findIndex(
      (item) => item.id === props.classId
    )
    let count = 0
    for (const key of classKeys) {
      if (
        key !== 'selections' &&
        key !== 'schoolGroupID' &&
        key !== 'communityGroupID'
      ) {
        if (status[key as keyof RegisteredClass] !== StatusEnum.saved) {
          count++
        }
      }
    }
    if (
      (appStore.performerType === 'SCHOOL' &&
        !classesStore.registeredClasses[props.classIndex]?.schoolGroupID) ||
      (appStore.performerType === 'COMMUNITY' &&
        !classesStore.registeredClasses[props.classIndex]?.communityGroupID)
    ) {
      count++
    }
    classesStore.classErrors[index]!.count = count
  })

  /**
   * Disciplines combobox data
   */
  const {
    result: disciplineResult,
    load: loadDisciplines,
    onError: onErrorDisciplines,
  } = useLazyQuery(
    DisciplinesByTypeDocument,
    () => ({
      performerType: appStore.performerType,
    }),
    { errorPolicy: 'all' }
  )
  const disciplineQuery = computed((): DisciplinesByTypeQuery | undefined => {
    return disciplineResult.value
  })
  onErrorDisciplines((error) => {
    console.error('Error loading disciplines: ', error)
    toast.error('Error loading disciplines')
  })

  /**
   * This computed function determines the variety of disciplines that
   * are displayed in the class page based on what instruments are chosen on
   * a solo performer page or the type of group on the group info page.
   */
  const disciplines = computed(() => {
    // if this is solo, then return only those instruments equialent to their instrument
    // and the Mozart class if instrument>mozart is true.
    if (
      appStore.performerType === 'SOLO' &&
      !!performerStore.performers[0]?.instrument &&
      disciplineQuery.value?.disciplines
    ) {
      const Mozart = disciplineQuery.value.disciplines.filter((item) => {
        return item.name.toLowerCase().includes('mozart')
      })
      let isMozart = false
      const discipline = disciplineQuery.value?.disciplines.filter((item) => {
        const disc = item.instruments?.find(
          (el) => el.name === performerStore.performers[0]?.instrument
        )
        if (!isMozart) {
          isMozart = !!disc?.mozart
        }
        return disc
      })
      if (isMozart && Mozart) {
        discipline?.push(Mozart[0]!)
      }
      return discipline ?? ''
    } else if (
      appStore.performerType === 'GROUP' &&
      disciplineQuery.value?.disciplines
    ) {
      if (groupStore.group.groupType === 'vocal') {
        return (
          disciplineQuery.value?.disciplines.filter((item) => {
            return item.name.toLowerCase().includes('vocal')
          }) ?? []
        )
      } else if (groupStore.group.groupType === 'musicalTheatre') {
        return (
          disciplineQuery.value?.disciplines.filter((item) => {
            return item.name.toLowerCase().includes('musical theatre')
          }) ?? []
        )
      } else if (groupStore.group.groupType === 'instrumental') {
        return (
          disciplineQuery.value?.disciplines.filter((item) => {
            return (
              item.name.toLowerCase().includes('brass') ||
              item.name.toLowerCase().includes('classical guitar') ||
              item.name.toLowerCase().includes('percussion') ||
              item.name.toLowerCase().includes('piano') ||
              item.name.toLowerCase().includes('strings') ||
              item.name.toLowerCase().includes('woodwinds')
            )
          }) ?? []
        )
      } else if (groupStore.group.groupType === 'mixed') {
        return (
          disciplineQuery.value?.disciplines.filter((item) => {
            return item.name.toLowerCase().includes('mixed group')
          }) ?? []
        )
      }
    } else {
      return disciplineQuery.value?.disciplines ?? []
    }
    return []
  })
  // chosenDiscipline is the discipline chosen from the template
  // through the vmodel on selectedClasses.discipline
  const chosenDiscipline = computed((): Discipline | undefined => {
    return disciplines.value?.find((item) => {
      return item.name === selectedClasses.value.discipline
    })
  })

  const isDisciplineDisabled = computed(() => {
    if (
      appStore.performerType === 'SOLO' &&
      !performerStore.performers[0]?.instrument
    ) {
      return true
    } else {
      return false
    }
  })

  /**
   * Subdisciplines combobox
   */
  const {
    result: subdisc,
    load: loadSubdisciplines,
    onError: errorSubdisciplines,
  } = useLazyQuery(
    SubdisciplinesByTypeDocument,
    () => ({
      disciplineId: chosenDiscipline.value?.id ?? 0,
      performerType: appStore.performerType,
    }),
    { errorPolicy: 'all' }
  )
  errorSubdisciplines((error) => {
    console.error('Error loading subdisciplines:', error, {
      operation: 'loadSubdisciplines',
      disciplineId: chosenDiscipline.value?.id,
      performerType: appStore.performerType,
    })
    toast.error('Error loading subdisciplines')
  })
  const subdisciplines = computed(() => {
    return subdisc.value?.subdisciplines ?? []
  })
  // chosenSubdiscipline is the subdiscipline chosen from the template
  // through the vmodel on selectedClasses.subdiscipline
  const chosenSubdiscipline = computed((): Subdiscipline | undefined => {
    return subdisciplines.value.find((item: Subdiscipline) => {
      return item.name === selectedClasses.value.subdiscipline
    })
  })

  /**
   * Grades / Levels combobox
   */
  const {
    result: gradeLevels,
    load: loadLevels,
    onError: errorLevel,
  } = useLazyQuery(
    LevelsDocument,
    () => ({
      subdisciplineId: chosenSubdiscipline.value?.id ?? 0,
    }),
    { errorPolicy: 'all' }
  )
  errorLevel((error) => {
    console.error('Error loading levels:', error, {
      operation: 'loadLevels',
      subdisciplineId: chosenSubdiscipline.value?.id,
    })
    toast.error('Error loading levels')
  })
  const levels = computed(() => gradeLevels.value?.levels ?? [])
  // chosenGradeLevel is the grade/level chosen from the template
  // through the vmodel on selectedClasses.level
  const chosenGradeLevel = computed((): Level | undefined => {
    return levels.value.find((item: Level) => {
      return item.name === selectedClasses.value.level
    })
  })

  /**
   * Categories combobox
   */
  const {
    result: cat,
    load: loadCategories,
    onError: errorCategories,
  } = useLazyQuery(
    CategoriesDocument,
    () => ({
      subdisciplineId: chosenSubdiscipline.value?.id ?? 0,
      levelId: chosenGradeLevel.value?.id ?? 0,
    }),
    { errorPolicy: 'all' }
  )
  errorCategories((error) => {
    console.error('Error loading categories:', error, {
      operation: 'loadCategories',
      subdisciplineId: chosenSubdiscipline.value?.id,
      levelId: chosenGradeLevel.value?.id,
    })
    toast.error('Error loading categories')
  })
  const categories = computed(() => cat.value?.categories ?? [])
  // chosenCategory is the category chosen from the template
  // through the vmodel on selectedClasses.category
  const chosenCategory = computed((): Category | undefined => {
    return categories.value.find((item: Category) => {
      return item.name === selectedClasses.value.category
    })
  })

  /**
   * Class Name
   * Once all three attributes are selected, the final
   * classname can be computed and showed on the page
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
   * Class Search for details from the Festival Class db table, incl. classNumber
   * Full result is copied to classSelection.
   */
  const {
    load: loadClassInformation,
    onResult: onClassSearchResult,
    onError: errorClass,
  } = useLazyQuery(
    FestivalClassSearchDocument,
    () => ({
      festivalClassSearch: {
        subdisciplineID: chosenSubdiscipline.value?.id ?? 0,
        levelID: chosenGradeLevel.value?.id ?? 0,
        categoryID: chosenCategory.value?.id ?? 0,
      },
    }),
    {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    }
  )
  /**
   * Once the specific class has been retrieved (classSelection), the details
   * then get emitted to the 'selectedClasses' modelValue and finally stored
   * in the registered class for updating.
   * selectedClasses <-- classSelection
   */
  onClassSearchResult((result) => {
    appStore.dataLoading = true

    // Safety check: ensure we got a valid result
    const festivalClass = result.data.festivalClassSearch?.[0]
    if (!festivalClass) {
      console.log('No class found for search criteria', {
        operation: 'onClassSearchResult',
        subdisciplineId: chosenSubdiscipline.value?.id,
        levelId: chosenGradeLevel.value?.id,
        categoryId: chosenCategory.value?.id,
      })
      appStore.dataLoading = false
      return
    }

    classSelection.value = festivalClass as FestivalClass
    selectedClasses.value.minSelections = classSelection.value.minSelections
    selectedClasses.value.maxSelections = classSelection.value.maxSelections
    selectedClasses.value.price = classSelection.value.price
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
    selectedClasses.value.classType = classSelection.value.classType?.name

    classesStore.updateClass(props.classId)
    loadInfoFirstRun.value = false
    appStore.dataLoading = false
  })
  errorClass((error) => {
    console.error('Error loading class information:', error, {
      operation: 'loadClassInformation',
      subdisciplineId: chosenSubdiscipline.value?.id,
      levelId: chosenGradeLevel.value?.id,
      categoryId: chosenCategory.value?.id,
    })
    toast.error('Error loading class information')
  })

  const notes = computed(() => {
    if (
      chosenSubdiscipline.value?.description ||
      chosenGradeLevel.value?.description ||
      chosenCategory.value?.description ||
      classSelection.value?.description ||
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
      try {
        // Only update if value actually changed (prevents initial load clearing)
        if (newDiscipline !== oldDiscipline) {
          // Clear dependent fields when parent changes
          selectedClasses.value.subdiscipline = null
          selectedClasses.value.level = null
          selectedClasses.value.category = null
          selectedClasses.value.classNumber = null

          status.discipline = StatusEnum.pending
          await classesStore.updateClass(props.classId, 'discipline')
          status.discipline =
            newDiscipline !== null ? StatusEnum.saved : StatusEnum.null
          // Only load subdisciplines if new discipline is selected (not when clearing)
          if (newDiscipline !== null && chosenDiscipline.value?.id) {
            await loadSubdisciplines()
          }
        }
      } catch (error) {
        console.error('Error in discipline watcher:', error, {
          operation: 'disciplineWatch',
          classId: props.classId,
          newDiscipline,
          oldDiscipline,
        })
        toast.error('Error updating discipline')
        status.discipline = StatusEnum.null
      }
    }
  )

  watch(
    () => selectedClasses.value.subdiscipline,
    async (newSubdiscipline, oldSubdiscipline) => {
      try {
        // Only update if value actually changed
        if (newSubdiscipline !== oldSubdiscipline) {
          // Clear dependent fields when parent changes
          selectedClasses.value.level = null
          selectedClasses.value.category = null
          selectedClasses.value.classNumber = null
          status.subdiscipline = StatusEnum.pending
          await classesStore.updateClass(props.classId, 'subdiscipline')
          status.subdiscipline =
            newSubdiscipline !== null ? StatusEnum.saved : StatusEnum.null
          // Only load levels if new subdiscipline is selected (not when clearing)
          if (newSubdiscipline !== null && chosenSubdiscipline.value?.id) {
            await loadLevels()
          }
        }
      } catch (error) {
        console.error('Error in subdiscipline watcher:', error, {
          operation: 'subdisciplineWatch',
          classId: props.classId,
          newSubdiscipline,
          oldSubdiscipline,
        })
        toast.error('Error updating subdiscipline')
        status.subdiscipline = StatusEnum.null
      }
    }
  )

  watch(
    () => selectedClasses.value.level,
    async (newLevel, oldLevel) => {
      try {
        // Only update if value actually changed
        if (newLevel !== oldLevel) {
          // Clear dependent fields when parent changes
          selectedClasses.value.category = null
          selectedClasses.value.classNumber = null

          status.level = StatusEnum.pending
          await classesStore.updateClass(props.classId, 'level')
          status.level = newLevel !== null ? StatusEnum.saved : StatusEnum.null
          // Only load categories if new level is selected (not when clearing)
          if (
            newLevel !== null &&
            chosenSubdiscipline.value?.id &&
            chosenGradeLevel.value?.id
          ) {
            await loadCategories()
          }
        }
      } catch (error) {
        console.error('Error in level watcher:', error, {
          operation: 'levelWatch',
          classId: props.classId,
          newLevel,
          oldLevel,
        })
        toast.error('Error updating level')
        status.level = StatusEnum.null
      }
    }
  )

  watch(
    () => selectedClasses.value.category,
    async (newCategory, oldCategory) => {
      try {
        // Only update if value actually changed
        if (newCategory !== oldCategory) {
          status.category = StatusEnum.pending
          await classesStore.updateClass(props.classId, 'category')
          status.category =
            newCategory !== null ? StatusEnum.saved : StatusEnum.null
          // Load class information for the new selection
          if (newCategory === null) {
            selectedClasses.value.classNumber = null
          } else if (
            chosenSubdiscipline.value?.id &&
            chosenGradeLevel.value?.id &&
            chosenCategory.value?.id
          ) {
            await loadClassInformation()
          }
        }
      } catch (error) {
        console.error('Error in category watcher:', error, {
          operation: 'categoryWatch',
          classId: props.classId,
          newCategory,
          oldCategory,
        })
        toast.error('Error updating category')
        status.category = StatusEnum.null
      }
    }
  )

  /**
   * Number of Allowed Works in class to choose from
   */
  const numberOfAllowedWorks = ref<Array<{ value: number; label: string }>>([])
  watchEffect(() => {
    const minWorks = classSelection.value?.minSelections
    const maxWorks = classSelection.value?.maxSelections
    // Guard clause: only proceed if we have valid min/max values
    if (!minWorks || !maxWorks) {
      numberOfAllowedWorks.value = []
      return
    }
    if (minWorks === maxWorks) {
      selectedClasses.value.numberOfSelections = minWorks
    }
    const selectionOptions = []
    for (let i = minWorks; i <= maxWorks; i++) {
      selectionOptions.push({ value: i, label: `${i.toString()} Selections` })
    }
    numberOfAllowedWorks.value = selectionOptions
  })

  /**
   * Updating number of selections to show based on what is chosen
   */
  watch(
    () => selectedClasses.value.numberOfSelections,
    async (newNumber) => {
      if (!newNumber) return
      const getCurrentSelectionCount = () =>
        classesStore.registeredClasses[props.classIndex]?.selections?.length ??
        0
      let currentCount = getCurrentSelectionCount()
      if (currentCount < newNumber) {
        while (currentCount < newNumber) {
          await classesStore.createSelection(props.classId)
          currentCount += 1
        }
      } else if (currentCount > newNumber) {
        while (currentCount > newNumber) {
          const selections =
            classesStore.registeredClasses[props.classIndex]?.selections
          if (!selections || selections.length === 0) {
            console.error('No selections available to delete', {
              operation: 'updateNumberOfSelections',
              classId: props.classId,
              classIndex: props.classIndex,
              expectedCount: newNumber,
              actualCount: currentCount,
            })
            break
          }

          const lastSelection = selections[selections.length - 1]
          if (!lastSelection) {
            console.warn('Invalid selection ID', {
              operation: 'updateNumberOfSelections',
              classId: props.classId,
              selectionIndex: selections.length - 1,
            })
            break
          }

          await classesStore
            .deleteSelection(props.classId, lastSelection.id)
            .catch((error) => {
              console.error('Failed to delete selection:', error, {
                operation: 'updateNumberOfSelections',
                classId: props.classId,
                selectionId: lastSelection.id,
              })
              toast.error('Error updating number of selections')
            })
          currentCount -= 1
        }
      }
      await classesStore.updateClass(props.classId, 'numberOfSelections')
    }
  )

  // Validation code
  const validationSchema = toTypedSchema(
    yup.object({
      discipline: yup.string().required('Required'),
      subdiscipline: yup.string().required('Required'),
      level: yup.string().required('Required'),
      category: yup.string().required('Required'),
    })
  )

  const { validate } = useForm({
    validationSchema,
    validateOnMount: true,
  })

  onActivated(async () => {
    await validate()
  })
</script>

<template>
  <div>
    <div
      v-auto-animate
      class="grid grid-cols-12 gap-x-3 gap-y-5 items-end">
      <div class="col-span-6 lg:col-span-2">
        <BaseSelect
          id="disciplines"
          :class="isDisciplineDisabled ? 'off' : ''"
          :disabled="isDisciplineDisabled"
          v-model="selectedClasses.discipline"
          :status="status.discipline"
          label="Discipline"
          name="discipline"
          :options="disciplines!" />
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
    </div>
    <div v-if="className">
      <div class="col-span-12 md:col-span-12">
        <p class="text-2xl text-center font-bold">
          {{ selectedClasses.classType }}
          {{ selectedClasses.classNumber }} -
          {{ className }}
        </p>
      </div>
      <div
        v-if="notes"
        class="col-span-12">
        <h4 class="pb-2">Notes</h4>
        <p v-if="classSelection?.classType?.description">
          {{ classSelection?.classType?.description }}
        </p>
        <div
          v-if="(classSelection?.trophies ?? []).length > 0"
          v-auto-animate>
          <h4>Trophy Eligibility</h4>
          <div
            v-for="trophy in classSelection?.trophies ?? []"
            :key="trophy.id">
            <h6>{{ trophy.name }}:</h6>
            <p class="text-sm pb-2">
              {{ trophy.description }}
            </p>
          </div>
        </div>

        <div
          v-if="chosenSubdiscipline?.description"
          v-auto-animate>
          <h4>Subdiscipline</h4>
          <p class="text-sm pb-2">
            {{ chosenSubdiscipline.description }}
          </p>
        </div>
        <div
          v-if="chosenGradeLevel?.description"
          v-auto-animate>
          <h4>Grade / Level</h4>
          <p class="text-sm pb-2">
            {{ chosenGradeLevel.description }}
          </p>
        </div>
        <div
          v-if="chosenCategory?.description"
          v-auto-animate>
          <h4>Category</h4>
          <p class="text-sm pb-2">
            {{ chosenCategory.description }}
          </p>
        </div>
        <div
          v-if="classSelection?.description"
          v-auto-animate>
          <h4>Class</h4>
          <p class="text-sm pb-2">
            {{ classSelection?.description }}
          </p>
        </div>
      </div>
      <div
        v-if="
          classSelection?.minSelections &&
          classSelection?.maxSelections &&
          classSelection.minSelections !== classSelection.maxSelections
        "
        class="col-span-3 md:col-span-2">
        <BaseRadioGroup
          v-model.number="selectedClasses.numberOfSelections"
          label="Choose number of selections"
          :name="`${selectedClasses.classNumber} Selections`"
          :vertical="true"
          :options="numberOfAllowedWorks" />
      </div>
      <FormWorksSelection
        v-for="(selection, selectionIndex) in selectedClasses.selections"
        :key="selection.id"
        v-model="selectedClasses.selections![selectionIndex]!"
        :selection-index="selectionIndex"
        :selection-id="selection.id"
        :class-id="classId"
        :class-index="classIndex" />
    </div>
  </div>
</template>

<style scoped></style>

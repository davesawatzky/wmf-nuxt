<script setup lang="ts">
  import * as yup from 'yup'
  import {
    CategoriesDocument,
    DisciplinesByTypeDocument,
    FestivalClassSearchDocument,
    FestivalClassesDocument,
    InstrumentsDocument,
    LevelsDocument,
    SubdisciplinesByTypeDocument,
  } from '@/graphql/gql/graphql'
  import { logErrorMessages } from '@vue/apollo-util'
  import { useClasses } from '@/stores/userClasses'
  import { useAppStore } from '@/stores/appStore'
  import { usePerformers } from '@/stores/userPerformer'
  import { useGroup } from '@/stores/userGroup'
  import type {
    Category,
    Discipline,
    DisciplineInput,
    DisciplinesByTypeQuery,
    FestivalClass,
    Level,
    RegisteredClass,
    RegisteredClassInput,
    Subdiscipline,
  } from '@/graphql/gql/graphql'

  const props = defineProps<{
    modelValue: RegisteredClass
    classIndex: number
    classId: number
  }>()

  const emits = defineEmits<{
    'update:modelValue': [value: RegisteredClassInput]
  }>()

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
  })

  const instrumentRequired = ref(false) // used to be for mozart classes.  Might not need this anymore.
  const appStore = useAppStore()
  const performerStore = usePerformers()
  const groupStore = useGroup()

  // TODO: Bug-prone - used for recording Registered Classes - but also for modelValue !!!!!!!
  const classesStore = useClasses()
  const classSelection = ref(<FestivalClass>{}) // Used for Festival Class Searchrd
  const loadInfoFirstRun = ref(true) // Flag to keep track of when to load extra information.

  // This is the Registered Class varialbe - sent to parent as modelValue
  // and then on to the classesStore.registeredClasses from there.
  const selectedClasses = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  })

  /**
   * Registration first gets loaded form the 'Registration' page
   * if these values are present in userClasses.registeredClasses,
   * then the background data is loaded for the attributes
   * and used on the page.  It allows for filling the comboboxes with
   * pre-saved data from an existing registration.
   */
  onMounted(async () => {
    await loadDisciplines()
    if (props.modelValue.subdiscipline) {
      await loadSubdisciplines()
    }
    if (props.modelValue.level) {
      await loadLevels()
    }
    if (props.modelValue.category) {
      await loadCategories()
      selectedClasses.value.numberOfSelections =
        props.modelValue.numberOfSelections
      loadInfoFirstRun.value = true
      await loadClassInformation()
    }
  })

  // Loading the instruments table.
  const { result: instrumentQuery, onError: instrumentsError } =
    useQuery(InstrumentsDocument)
  const instruments = computed(() => instrumentQuery.value?.instruments ?? [])
  instrumentsError((error) => {
    console.log(error)
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
    })
    // { fetchPolicy: 'network-only' }
  )
  const disciplineQuery = computed(
    () => disciplineResult.value ?? <DisciplinesByTypeQuery>{}
  )
  onErrorDisciplines((error) => {
    console.log('Stopping Here: ', error)
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
      !!performerStore.performers[0].instrument &&
      disciplineQuery.value.disciplines
    ) {
      const Mozart = disciplineQuery.value.disciplines.filter((item) => {
        return item.name.toLowerCase().includes('mozart')
      })
      if (performerStore.performers[0].instrument.toLowerCase() === 'voice') {
        return disciplineQuery.value.disciplines.filter((item) => {
          return (
            item.name.toLowerCase() === 'vocal' ||
            item.name.toLowerCase() === 'musical theatre' ||
            item.name.toLowerCase().includes('mozart')
          )
        })
      } else {
        // Adds Mozart Classes to all the other instruments
        let isMozart = false
        const discipline = disciplineQuery.value?.disciplines.filter((item) => {
          const disc = item.instruments?.find(
            (el) => el.name === performerStore.performers[0].instrument
          )
          if (!isMozart) {
            disc?.mozart === true ? (isMozart = true) : (isMozart = false)
          }
          return disc
        })
        if (isMozart && Mozart) {
          discipline?.push(Mozart[0])
        }
        return discipline
      }
    } else if (appStore.performerType === 'GROUP') {
      if (groupStore.group.groupType === 'vocal') {
        return disciplineQuery.value?.disciplines.filter((item) => {
          return (
            item.name.toLowerCase().includes('vocal') ||
            item.name.toLowerCase().includes('musical theatre')
          )
        })
      } else if (groupStore.group.groupType === 'instrumental') {
        return disciplineQuery.value?.disciplines.filter((item) => {
          return (
            item.name.toLowerCase().includes('brass') ||
            item.name.toLowerCase().includes('classical guitar') ||
            item.name.toLowerCase().includes('percussion') ||
            item.name.toLowerCase().includes('piano') ||
            item.name.toLowerCase().includes('strings') ||
            item.name.toLowerCase().includes('woodwinds')
          )
        })
      } else if (groupStore.group.groupType === 'mixed') {
        return disciplineQuery.value?.disciplines.filter((item) => {
          return item.name.toLowerCase().includes('mixed group')
        })
      }
    } else {
      return disciplineQuery.value?.disciplines ?? []
    }
  })
  // chosenDiscipline is the discipline chosen from the template
  // through the vmodel on selectedClasses.discipline
  const chosenDiscipline = computed(() => {
    return (
      disciplines.value?.find((item) => {
        return item.name === selectedClasses.value.discipline
      }) ?? <Discipline>{}
    )
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
      disciplineId: chosenDiscipline.value.id,
      performerType: appStore.performerType,
    })
    // { fetchPolicy: 'network-only' }
  )
  errorSubdisciplines((error) => {
    console.log(error)
  })
  const subdisciplines = computed(() => {
    return subdisc.value?.subdisciplines ?? []
  })
  // chosenSubdiscipline is the subdiscipline chosen from the template
  // through the vmodel on selectedClasses.subdiscipline
  const chosenSubdiscipline = computed(() => {
    return (
      subdisciplines.value.find((item: Subdiscipline) => {
        return item.name === selectedClasses.value.subdiscipline
      }) ?? <Subdiscipline>{}
    )
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
      subdisciplineId: chosenSubdiscipline.value.id,
    })
    // { fetchPolicy: 'network-only' }
  )
  errorLevel((error) => console.log(error))
  const levels = computed(() => gradeLevels.value?.levels ?? [])
  // chosenGradeLevel is the grade/level chosen from the template
  // through the vmodel on selectedClasses.level
  const chosenGradeLevel = computed(() => {
    return (
      levels.value.find((item: Level) => {
        return item.name === selectedClasses.value.level
      }) ?? <Level>{}
    )
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
      subdisciplineId: chosenSubdiscipline.value.id,
      levelId: chosenGradeLevel.value.id,
    })
    // { fetchPolicy: 'network-only' }
  )
  errorCategories((error) => console.log(error))
  const categories = computed(() => cat.value?.categories ?? [])
  // chosenCategory is the category chosen from the template
  // through the vmodel on selectedClasses.category
  const chosenCategory = computed(() => {
    return (
      categories.value.find((item: Category) => {
        return item.name === selectedClasses.value.category
      }) ?? <Category>{}
    )
  })

  /**
   * Class Name
   * Once all three attributes are selected, the the final
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
        subdisciplineID: chosenSubdiscipline.value.id,
        levelID: chosenGradeLevel.value.id,
        categoryID: chosenCategory.value.id,
      },
    }),
    { fetchPolicy: 'network-only' }
  )
  /**
   * Once the specific class has been retrieved (classSelection), the details
   * then get emitted to the 'selectedClasses' modelValue and finally stored
   * in the registered class for updating.
   * selectedClasses <-- classSelection
   */
  onClassSearchResult((result) => {
    classSelection.value = <FestivalClass>result.data.festivalClassSearch[0]
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
    selectedClasses.value.classType = classSelection.value.classType.name

    classesStore.updateClass(props.classId)
    loadInfoFirstRun.value = false
  })
  errorClass((error) => {
    logErrorMessages(error)
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
      selectedClasses.value.subdiscipline = null
      if (newDiscipline !== oldDiscipline) {
        status.discipline = StatusEnum.pending
        await classesStore.updateClass(props.classId, 'discipline')
        newDiscipline !== null
          ? (status.discipline = StatusEnum.saved)
          : (status.discipline = StatusEnum.null)
      }
      if (!!chosenDiscipline.value.id) {
        loadSubdisciplines()
      }
    }
  )

  watch(
    () => selectedClasses.value.subdiscipline,
    async (newSubdiscipline, oldSubdiscipline) => {
      selectedClasses.value.level = null
      if (newSubdiscipline !== oldSubdiscipline) {
        status.subdiscipline = StatusEnum.pending
        await classesStore.updateClass(props.classId, 'subdiscipline')
        newSubdiscipline !== null
          ? (status.subdiscipline = StatusEnum.saved)
          : (status.subdiscipline = StatusEnum.null)
      }
      if (!!chosenSubdiscipline.value.id) {
        loadLevels()
      }
    }
  )

  watch(
    () => selectedClasses.value.level,
    async (newLevel, oldLevel) => {
      selectedClasses.value.category = null
      if (newLevel !== oldLevel) {
        status.level = StatusEnum.pending
        await classesStore.updateClass(props.classId, 'level')
        newLevel !== null
          ? (status.level = StatusEnum.saved)
          : (status.level = StatusEnum.null)
      }
      if (!!chosenSubdiscipline.value.id && !!chosenGradeLevel.value.id) {
        loadCategories()
      }
    }
  )

  watch(
    () => selectedClasses.value.category,
    async (newCategory, oldCategory) => {
      if (newCategory !== oldCategory) {
        status.category = StatusEnum.pending
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
      let oldNumber =
        classesStore.registeredClasses[props.classIndex].selections!.length
      if (oldNumber < newNumber!) {
        console.log('newNumber bigger than oldNumber')
        while (oldNumber < newNumber!) {
          console.log(props.classId)
          await classesStore.createSelection(props.classId)
          oldNumber += 1
        }
      } else if (oldNumber > newNumber!) {
        console.log('oldNumber bigger than new number')
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
      console.log('Watcher Fired')
      await classesStore.updateClass(props.classId, 'numberOfSelections')
    }
  )

  // Validation code

  const validationSchema = toTypedSchema(
    yup.object({
      discipline: yup.string().required('Choose a discipline'),
      subdiscipline: yup.string().required('Choose a subdiscipline'),
      level: yup.string().required('Choose a grade/level'),
      category: yup.string().required('Choose a category'),
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
          id=""
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
        v-if="classSelection.minSelections !== classSelection.maxSelections"
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
        v-model="selectedClasses.selections![selectionIndex]"
        :selection-index="selectionIndex"
        :selection-id="selection.id"
        :class-id="classId"
        :class-index="classIndex" />
    </div>
  </div>
</template>

<style scoped></style>

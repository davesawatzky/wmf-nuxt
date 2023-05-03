import { defineStore } from 'pinia'

import {
  ClassCreateDocument,
  ClassDeleteDocument,
  ClassUpdateDocument,
  RegisteredClassesDocument,
  SelectionCreateDocument,
  SelectionDeleteDocument,
  SelectionUpdateDocument,
} from '~/graphql/gql/graphql'

import type { RegisteredClass, RegisteredClassInput, Selection, SelectionInput } from '~/graphql/gql/graphql'

// export interface Selections {
//   id?: number
//   title: string
//   largerWork: string
//   movement: string
//   composer: string
//   duration: string
//   __typename?: string
// }

// export interface RegisteredClass {
//   id?: number
//   classNumber: string
//   className?: string
//   discipline: string
//   subdiscipline: string
//   level: string
//   category: string
//   numberOfSelections: number
//   price: number
//   schoolGroupID: number | null
//   __typename?: string
//   selections?: Selections[]
// }

export const useClasses = defineStore(
  'registeredClasses',
  () => {
    const registeredClasses = ref([] as RegisteredClass[])
    const MOZART_CLASSES = ['7700', '7701', '7702', '7703', '7704']

    function $reset() {
      registeredClasses.value = <RegisteredClass[]>[]
    }

    /**
     * Add empty class variables to store. Used when requiring a new
     * class entry existing classes
     */
    function addClassToStore(registeredClass: RegisteredClass | null) {
      registeredClasses.value.push({
        id: 0,
        classNumber: '',
        discipline: '',
        subdiscipline: '',
        level: '',
        category: '',
        numberOfSelections: 0,
        price: 0,
        schoolGroupID: null,
        __typename: 'RegisteredClass',
        selections: [],
      })
      if (registeredClass) {
        Object.assign(registeredClasses.value[registeredClasses.value.length - 1], registeredClass)
      }
    }

    /**
     * Add empty works variables to specific class in store. Used
     * when loading existing works to existing classes
     *
     * @param index Index of specific class in array
     */
    function addSelectionToStore(classSelection: Selection | null, classIndex: number) {
      registeredClasses.value[classIndex].selections!.push({
        id: 0,
        title: '',
        largerWork: '',
        movement: '',
        composer: '',
        duration: '0:00',
        __typename: 'Selection',
      })
      if (classSelection) {
        Object.assign(
          registeredClasses.value[classIndex].selections![registeredClasses.value[classIndex].selections!.length - 1],
          classSelection
        )
      }
    }

    async function createClass(registrationId: number) {
      const {
        mutate: classCreate,
        onDone: doneClassCreate,
        onError: errorClassCreate,
      } = useMutation(ClassCreateDocument, { fetchPolicy: 'no-cache' })
      addClassToStore(null)
      const classLastIndex = registeredClasses.value.length - 1
      const clone = Object.assign({}, <RegisteredClassInput>registeredClasses.value[classLastIndex])
      // delete clone.id
      // delete clone.selections
      await classCreate({ registrationId, registeredClassInput: clone })
      doneClassCreate((result) => {
        const lastIndex = registeredClasses.value.length - 1
        const returnedId: number = result.data.registeredClassCreate.registeredClass.id
        registeredClasses.value[lastIndex].id = returnedId
      })
      errorClassCreate((error) => {
        console.log(error)
      })
    }

    function loadClasses(registrationId: number) {
      const {
        result: resultClasses,
        load: loadClasses,
        onResult: resultLoadClasses,
        onError: classError,
      } = useLazyQuery(RegisteredClassesDocument, { registrationId }, { fetchPolicy: 'no-cache' })
      resultLoadClasses((result) => {
        if (!result.data.registration.registeredClasses || result.data.registration.registeredClasses.length === 0) {
          createClass(registrationId).catch((error) => console.log(error))
          return
        }
        registeredClasses.value = structuredClone(result.data.registration.registeredClasses)
        checkForExistingSelections()
      })
      classError((error) => {
        console.log(error)
      })
      return {
        resultClasses,
        loadClasses,
      }
    }

    function checkForExistingSelections() {
      let classIndex = 0
      // TODO: must change forEach code.  This is a bug!
      // foreach skips empty values
      registeredClasses.value.forEach((item) => {
        if (item.selections.length === 0 || item.selections.length !== item.numberOfSelections) {
          if (item.selections.length === 0) {
            for (let i = 0; i < item.numberOfSelections; i++) {
              createSelection(classIndex).catch((error) => console.log(error))
            }
          } else if (item.selections!.length > 0 && item.selections!.length < item.numberOfSelections) {
            for (let i = 1; i < 2; i++) {
              createSelection(classIndex).catch((error) => console.log(error))
            }
          } else if (item.selections!.length > item.numberOfSelections) {
            for (let i = item.selections!.length; i > item.numberOfSelections; i--) {
              deleteSelection(classIndex, i).catch((error) => console.log(error))
            }
          }
        }
        classIndex++
      })
    }

    async function updateClass(classIndex: number) {
      const { mutate: classUpdate, onError } = useMutation(ClassUpdateDocument, { fetchPolicy: 'no-cache' })
      const classId = registeredClasses.value[classIndex].id
      const clone = Object.assign({}, <RegisteredClassInput>registeredClasses.value[classIndex])
      // delete clone.id
      // delete clone.selections
      // delete clone.__typename
      await classUpdate({
        registeredClassId: classId,
        registeredClass: clone,
      })
      onError((error) => console.log(error))
    }

    async function updateAllClasses() {
      let classIndex = 0
      while (classIndex < registeredClasses.value.length) {
        await updateClass(classIndex)
        if (registeredClasses.value[classIndex].selections![0]) {
          await updateAllSelections(classIndex)
        }
        classIndex += 1
      }
    }

    async function deleteClass(classIndex: number, registeredClassId: number) {
      const { mutate: classDelete, onDone: doneClassDelete, onError } = useMutation(ClassDeleteDocument)
      await classDelete({ registeredClassId })
      doneClassDelete(() => {
        registeredClasses.value.splice(classIndex, 1)
      })
      onError((error) => {
        console.log(error)
      })
    }

    async function createSelection(classIndex: number) {
      const {
        mutate: selectionCreate,
        onDone: doneSelectionCreate,
        onError: errorSelectionCreate,
      } = useMutation(SelectionCreateDocument, { fetchPolicy: 'no-cache' })
      addSelectionToStore(null, classIndex)
      const classId: number = registeredClasses.value[classIndex].id
      const selectionsLastIndex = registeredClasses.value[classIndex].selections!.length - 1
      const clone = Object.assign(
        {},
        <SelectionInput>registeredClasses.value[classIndex].selections![selectionsLastIndex]
      )
      // delete clone.id
      await selectionCreate({ registeredClassId: classId, selection: clone })
      doneSelectionCreate((result) => {
        const lastIndex = registeredClasses.value[classIndex].selections!.length - 1
        const returnedId: number = result.data.selectionCreate.selection.id
        registeredClasses.value[classIndex].selections![lastIndex].id = returnedId
      })
      errorSelectionCreate((error) => {
        console.log(error)
      })
    }

    async function updateSelection(classIndex: number, selectionIndex: number, selectionId: number) {
      const { mutate: selectionUpdate, onError } = useMutation(SelectionUpdateDocument, { fetchPolicy: 'no-cache' })
      const clone = Object.assign({}, <SelectionInput>registeredClasses.value[classIndex].selections![selectionIndex])
      // delete clone.id
      // delete clone.__typename
      await selectionUpdate({ selectionId, selection: clone })
      onError((error) => {
        console.log(error)
      })
    }

    async function updateAllSelections(classIndex: number) {
      let selectionIndex = 0
      for (const selection of registeredClasses.value[classIndex].selections!) {
        await updateSelection(classIndex, selectionIndex, selection.id)
        selectionIndex += 1
      }
    }

    async function deleteSelection(classIndex: number, selectionIndex: number) {
      const { mutate: selectionDelete, onDone: doneSelectionDelete, onError } = useMutation(SelectionDeleteDocument)
      const selectionNum = registeredClasses.value[classIndex].selections![selectionIndex].id
      await selectionDelete({ selectionId: selectionNum })
      doneSelectionDelete(() => {
        registeredClasses.value[classIndex].selections?.splice(selectionIndex, 1)
      })
      onError((error) => {
        console.log(error)
      })
    }
    return {
      registeredClasses,
      $reset,
      MOZART_CLASSES,
      addClassToStore,
      addSelectionToStore,
      createClass,
      loadClasses,
      updateClass,
      updateAllClasses,
      deleteClass,
      createSelection,
      updateSelection,
      updateAllSelections,
      deleteSelection,
    }
  },
  {
    persist: true,
  }
)

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

import type {
  RegisteredClass,
  RegisteredClassInput,
  Selection,
  SelectionInput,
} from '~/graphql/gql/graphql'

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
    function addClassToStore(classId: RegisteredClass['id']) {
      try {
        registeredClasses.value.push(<RegisteredClass>{
          id: classId,
          classNumber: '',
          discipline: '',
          subdiscipline: '',
          level: '',
          category: '',
          numberOfSelections: 1,
          price: 0,
          schoolGroupID: null,
          selections: <Selection[]>[],
          __typename: 'RegisteredClass',
        })
      } catch (err) {
        console.log(err)
      }
    }

    /**
     * Add empty works variables to specific class in store. Used
     * when loading existing works to existing classes
     *
     * @param index Index of specific class in array
     */
    function addSelectionToStore(
      selectionId: Selection['id'],
      classId: number
    ) {
      try {
        const classIndex = registeredClasses.value.findIndex(
          (item) => item.id === classId
        )
        registeredClasses.value[classIndex].selections?.push({
          id: selectionId,
          title: '',
          largerWork: '',
          movement: '',
          composer: '',
          duration: '0:00',
          __typename: 'Selection',
        })
      } catch (err) {
        console.log(err)
      }
    }

    async function createClass(registrationId: number) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: classCreate,
          onDone,
          onError,
        } = useMutation(ClassCreateDocument, { fetchPolicy: 'no-cache' })
        classCreate({ registrationId }).catch((error) => console.log(error))
        onDone((result) => {
          const classId: number =
            result.data.registeredClassCreate.registeredClass.id
          addClassToStore(classId)
          createSelection(classId).catch((err) => console.log(err))
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    function loadClasses(registrationId: number) {
      const {
        result: resultClasses,
        load: loadClasses,
        onResult: resultLoadClasses,
        onError: classError,
      } = useLazyQuery(
        RegisteredClassesDocument,
        { registrationId },
        { fetchPolicy: 'no-cache' }
      )
      resultLoadClasses((result) => {
        if (
          !result.data.registration.registeredClasses ||
          result.data.registration.registeredClasses.length === 0
        ) {
          createClass(registrationId).catch((error) => console.log(error))
          return
        }
        registeredClasses.value = structuredClone(
          result.data.registration.registeredClasses
        )
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
      if (registeredClasses.value.selections.length > 0)
        for (const item of registeredClasses.value) {
          if (
            item.selections.length === 0 ||
            item.selections.length !== item.numberOfSelections
          ) {
            if (item.selections.length === 0) {
              for (let i = 0; i < item.numberOfSelections; i++) {
                createSelection(classIndex).catch((error) => console.log(error))
              }
            } else if (
              item.selections!.length > 0 &&
              item.selections!.length < item.numberOfSelections
            ) {
              for (let i = 1; i < 2; i++) {
                createSelection(classIndex).catch((error) => console.log(error))
              }
            } else if (item.selections!.length > item.numberOfSelections) {
              for (
                let i = item.selections!.length;
                i > item.numberOfSelections;
                i--
              ) {
                deleteSelection(classIndex, i).catch((error) =>
                  console.log(error)
                )
              }
            }
          }
          classIndex++
        }
    }

    async function updateClass(classIndex: number) {
      const { mutate: classUpdate, onError } = useMutation(
        ClassUpdateDocument,
        { fetchPolicy: 'no-cache' }
      )
      const classId = registeredClasses.value[classIndex].id
      const clone = Object.assign(
        {},
        <RegisteredClassInput>registeredClasses.value[classIndex]
      )
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
      const {
        mutate: classDelete,
        onDone,
        onError,
      } = useMutation(ClassDeleteDocument)
      await classDelete({ registeredClassId })
      onDone(() => {
        registeredClasses.value.splice(classIndex, 1)
      })
      onError((error) => {
        console.log(error)
      })
    }

    async function createSelection(classId: number) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: selectionCreate,
          onDone,
          onError,
        } = useMutation(SelectionCreateDocument, { fetchPolicy: 'no-cache' })
        selectionCreate({ registeredClassId: classId }).catch((error) =>
          console.log(error)
        )
        onDone((result) => {
          const selectionId: number = result.data.selectionCreate.selection.id
          addSelectionToStore(selectionId, classId)
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    async function updateSelection(
      classIndex: number,
      selectionIndex: number,
      selectionId: number
    ) {
      const { mutate: selectionUpdate, onError } = useMutation(
        SelectionUpdateDocument,
        { fetchPolicy: 'no-cache' }
      )
      const clone = Object.assign(
        {},
        <SelectionInput>(
          registeredClasses.value[classIndex].selections![selectionIndex]
        )
      )
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
      const {
        mutate: selectionDelete,
        onDone: doneSelectionDelete,
        onError,
      } = useMutation(SelectionDeleteDocument)
      const selectionNum =
        registeredClasses.value[classIndex].selections![selectionIndex].id
      await selectionDelete({ selectionId: selectionNum })
      doneSelectionDelete(() => {
        registeredClasses.value[classIndex].selections?.splice(
          selectionIndex,
          1
        )
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

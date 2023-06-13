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
     * class entry existing classes.
     *
     * @param regClass A Registred Class Object must include an id property value
     */
    function addClassToStore(regClass: RegisteredClass) {
      try {
        registeredClasses.value.push(<RegisteredClass>{
          id: regClass.id,
          classNumber: regClass.classNumber || '',
          discipline: regClass.discipline || '',
          subdiscipline: regClass.subdiscipline || '',
          level: regClass.level || '',
          category: regClass.category || '',
          minSelections: regClass.minSelections || 1,
          maxSelections: regClass.maxSelections || 1,
          numberOfSelections: regClass.numberOfSelections || 1,
          price: regClass.price || 0.0,
          schoolGroupID: regClass.schoolGroupID || null,
          selections: regClass.selections || <Selection[]>[],
          __typename: regClass.__typename || 'RegisteredClass',
        })
      } catch (err) {
        console.log(err)
      }
    }

    /**
     * Add empty works variables to specific class in store. Used
     * when loading existing works to existing classes.
     *
     * @param selection Class Selection object must include an id property value
     * @param classId ID of the Registered Class
     */
    function addSelectionToStore(selection: Selection, classId: number) {
      try {
        const classIndex = registeredClasses.value.findIndex(
          (item) => item.id === classId
        )
        registeredClasses.value[classIndex].selections!.push({
          id: selection.id,
          title: selection.title || '',
          largerWork: selection.largerWork || '',
          movement: selection.movement || '',
          composer: selection.composer || '',
          duration: selection.duration || '0:00',
          __typename: selection.__typename || 'Selection',
        })
      } catch (err) {
        console.log(err)
      }
    }

    /**
     * Creates an empty class and selection record for the
     * Registration in the store and the db.
     *
     * @param registrationId Registered Class ID
     * @returns Promise
     */
    function createClass(registrationId: number) {
      return new Promise((resolve, reject) => {
        const {
          mutate: classCreate,
          onDone,
          onError,
        } = useMutation(ClassCreateDocument, { fetchPolicy: 'no-cache' })
        classCreate({
          registrationId,
          registeredClass: {
            minSelections: 1,
            maxSelections: 1,
            numberOfSelections: 1,
            price: 0.0,
          },
        }).catch((error) => console.log(error))
        onDone((result) => {
          const regClass: RegisteredClass =
            result.data.registeredClassCreate.registeredClass
          addClassToStore(regClass)
          createSelection(regClass.id).catch((err) => console.log(err))
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Loads classes from the db for the requested registration.
     * Populates the store with class and selection info.
     *
     * @param registrationId Registered Class ID
     * @returns Promise
     */
    function loadClasses(registrationId: number) {
      return new Promise((resolve, reject) => {
        const {
          result: resultClasses,
          load,
          onResult,
          onError,
        } = useLazyQuery(
          RegisteredClassesDocument,
          { registrationId },
          { fetchPolicy: 'no-cache' }
        )
        load()
        onResult((result) => {
          const returnedClasses: RegisteredClass[] =
            result.data.registration.registeredClasses
          const length = returnedClasses.length
          for (let i = 0; i < length; i++) {
            addClassToStore(returnedClasses[i])
          }
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Writes Registered Class field info for the specified class
     * into the db.
     *
     * @param classId ID of the Registered Class
     * @param field class field
     * @returns Promise
     */
    function updateClass(classId: number, field?: string): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: classUpdate,
          onDone,
          onError,
        } = useMutation(ClassUpdateDocument, { fetchPolicy: 'no-cache' })
        const regClass = registeredClasses.value.find(
          (item) => item.id === classId
        )
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, __typename, selections, ...classProps } = regClass
        let classField = null
        if (field && Object.keys(classProps).includes(field)) {
          classField = Object.fromEntries(
            Array(Object.entries(classProps).find((item) => item[0] === field))
          )
        }
        classUpdate({
          registeredClassId: classId,
          registeredClass: <RegisteredClassInput>(classField || classProps),
        }).catch((error) => console.log(error))
        onDone(() => {
          resolve('Success')
        })
        onError((error) => reject(console.log(error)))
      })
    }

    /**
     * Writes all Registered Class information into the db
     */
    async function updateAllClasses() {
      for (let i = 0; i < registeredClasses.value.length; i++) {
        await updateClass(registeredClasses.value[i].id)
        await updateAllSelections(registeredClasses.value[i].id)
      }
    }

    /**
     * Deletes a Registered Class.  Removes it from the store
     * and deletes it from the db, including all details.
     *
     * @param registeredClassId ID of Registered Class
     * @returns classIndex number
     */
    function deleteClass(registeredClassId: number): Promise<number> {
      return new Promise((resolve, reject) => {
        const {
          mutate: classDelete,
          onDone,
          onError,
        } = useMutation(ClassDeleteDocument)
        classDelete({ registeredClassId }).catch((error) => console.log(error))
        onDone(() => {
          const classIndex = registeredClasses.value.findIndex(
            (item) => item.id === registeredClassId
          )
          registeredClasses.value.splice(classIndex, 1)
          resolve(classIndex)
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Creates a selection in the store and db for the specfied class.
     *
     * @param classId ID of Registered Class
     * @returns Promise
     */
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
          const selection: Selection = result.data.selectionCreate.selection
          addSelectionToStore(selection, classId)
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Updates the specified selection in the store and db.
     *
     * @param classId ID of Registered Class
     * @param selectionId ID of selection
     * @param field selection field
     * @returns
     */
    function updateSelection(
      classId: number,
      selectionId: number,
      field?: string
    ) {
      return new Promise((resolve, reject) => {
        const {
          mutate: selectionUpdate,
          onDone,
          onError,
        } = useMutation(SelectionUpdateDocument, { fetchPolicy: 'no-cache' })
        const selection = registeredClasses.value
          .find((reg) => reg.id === classId)
          ?.selections?.find((sel) => sel.id === selectionId)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, __typename, ...selectionProps } = selection
        let selectionField = null
        if (field && Object.keys(selectionProps).includes(field)) {
          selectionField = Object.fromEntries(
            Array(
              Object.entries(selectionProps).find((item) => item[0] === field)
            )
          )
        }
        selectionUpdate({
          selectionId,
          selection: <SelectionInput>(selectionField || selectionProps),
        }).catch((error) => console.log(error))
        onDone(() => {
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Updates all selections for a specified Registered Class.
     *
     * @param classId ID of Registered Class
     */
    async function updateAllSelections(classId: number) {
      const classIndex = registeredClasses.value.findIndex(
        (item) => item.id === classId
      )
      if (registeredClasses.value[classIndex].selections!.length > 0) {
        for (
          let i = 0;
          i < registeredClasses.value[classIndex].selections!.length;
          i++
        ) {
          const selectionId =
            registeredClasses.value[classIndex].selections![i].id
          await updateSelection(classId, selectionId)
        }
      }
    }

    /**
     * Deletes a selection from a Registered Class.
     *
     * @param classId ID of Registered Class
     * @param selectionId ID of Selection item
     * @returns
     */
    function deleteSelection(classId: number, selectionId: number) {
      return new Promise((resolve, reject) => {
        const {
          mutate: selectionDelete,
          onDone,
          onError,
        } = useMutation(SelectionDeleteDocument)
        selectionDelete({ selectionId }).catch((error) => console.log(error))
        onDone(() => {
          const classIndex = registeredClasses.value.findIndex(
            (item) => item.id === classId
          )
          console.log('ClassIndex-----: ', classIndex)
          const selectionIndex = registeredClasses.value[
            classIndex
          ].selections!.findIndex((item) => item.id === selectionId)
          console.log('SelectionIndex-----: ', selectionIndex)
          registeredClasses.value[classIndex].selections?.splice(
            selectionIndex,
            1
          )
          console.log(
            'Sel Length after del-----: ',
            registeredClasses.value[classIndex].selections!.length
          )

          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
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

import { defineStore } from 'pinia'
import { useFieldConfig } from '@/stores/useFieldConfig'
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
    const registeredClasses = ref<RegisteredClass[]>([])
    const selectionId = ref(0)
    const MOZART_CLASSES = ['7700', '7701', '7702', '7703', '7704', '7705']
    const fieldConfigStore = useFieldConfig()
    const registrationStore = useRegistration()
    function $reset() {
      registeredClasses.value.splice(0, registeredClasses.value.length)
    }

    const classErrors = computed(() => {
      let classKeys = fieldConfigStore.performerTypeFields('FestivalClasses')
      let selectionKeys = fieldConfigStore.performerTypeFields('Selection')
      let count = 0
      for (let festclass of registeredClasses.value) {
        for (let key of classKeys) {
          if (key !== 'selections') {
            if (!!festclass[key as keyof RegisteredClass] === false) {
              count++
            }
          } else {
            for (let select of festclass.selections!) {
              for (let key2 of selectionKeys) {
                if (!!select[key2 as keyof Selection] === false) {
                  count++
                }
              }
            }
          }
        }
      }
      return count
    })

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
          classType: regClass.classType || 'CLASS',
          classNumber: regClass.classNumber || '',
          discipline: regClass.discipline || '',
          subdiscipline: regClass.subdiscipline || '',
          level: regClass.level || '',
          category: regClass.category || '',
          minSelections: regClass.minSelections || undefined,
          maxSelections: regClass.maxSelections || undefined,
          numberOfSelections: regClass.numberOfSelections || undefined,
          price: (regClass.price as number) || 0.0,
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
          duration: selection.duration || '',
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
    const {
      mutate: classCreate,
      loading: createClassLoading,
      onDone: onCreateClassDone,
      onError: onCreateClassError,
    } = useMutation(ClassCreateDocument, { fetchPolicy: 'no-cache' })
    function createClass(registrationId: number) {
      classCreate({ registrationId })
    }
    onCreateClassDone(async (result) => {
      if (result.data?.registeredClassCreate.registeredClass) {
        const regClass = result.data.registeredClassCreate.registeredClass
        addClassToStore(regClass)
        // await createSelection(regClass.id)
      } else if (result.data?.registeredClassCreate.userErrors) {
        console.log(result.data.registeredClassCreate.userErrors)
      }
    })
    onCreateClassError((error) => {
      console.log(error)
    })

    /**
     * Loads classes from the db for the requested registration.
     * Populates the store with class and selection info.
     *
     * @param registrationId Registered Class ID
     */
    const {
      result: resultClasses,
      load: classesLoad,
      refetch: refetchClasses,
      onResult: onLoadClassesResult,
      onError: onLoadClassesError,
    } = useLazyQuery(RegisteredClassesDocument, undefined, {
      fetchPolicy: 'no-cache',
    })
    async function loadClasses(registrationId: number) {
      ;(await classesLoad(null, { registrationId })) || (await refetchClasses())
    }
    watch(resultClasses, (newResult) => {
      if (newResult?.registration.registeredClasses) {
        const returnedClasses: RegisteredClass[] =
          newResult.registration.registeredClasses
        const length = returnedClasses.length
        for (let i = 0; i < length; i++) addClassToStore(returnedClasses[i])
      }
    })
    onLoadClassesError((error) => {
      console.log(error)
    })

    /**
     * Writes Registered Class field info for the specified class
     * into the db.
     *
     * @param classId ID of the Registered Class
     * @param field class field
     */
    const {
      mutate: classUpdate,
      loading: classUpdateLoading,
      onDone: onClassUpdateDone,
      onError: onClassUpdateError,
    } = useMutation(ClassUpdateDocument, { fetchPolicy: 'no-cache' })
    async function updateClass(classId: number, field?: string) {
      const regClass = registeredClasses.value.find(
        (item) => item.id === classId
      )
      const { id, __typename, selections, ...classProps } = <RegisteredClass>(
        regClass
      )
      let classField = null
      if (field && Object.keys(classProps).includes(field)) {
        classField = Object.fromEntries(
          Array(Object.entries(classProps).find((item) => item[0] === field)!)
        )
      }
      await classUpdate({
        registeredClassId: classId,
        registeredClass: <RegisteredClassInput>(classField || classProps),
      })
    }
    onClassUpdateError((error) => console.log(error))

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
     * @param registeredClassId ID of Registered Class
     * @returns classIndex number
     */
    const {
      mutate: classDelete,
      loading: classDeleteLoading,
      onDone: onClassDeleteDone,
      onError: onClassDeleteError,
    } = useMutation(ClassDeleteDocument)
    function deleteClass(registeredClassId: number): number {
      classDelete({ registeredClassId })
      let classIndex = 0
      classIndex = registeredClasses.value.findIndex(
        (item) => item.id === registeredClassId
      )
      registeredClasses.value.splice(classIndex, 1)
      return classIndex
    }
    onClassDeleteError((error) => {
      console.log(error)
    })

    /**
     * Creates a selection in the store and db for the specfied class.
     * @param classId ID of Registered Class
     */
    let registeredClassSelectionId = 0
    const {
      mutate: selectionCreate,
      loading: createSelectionLoading,
      onDone: onCreateSelectionDone,
      onError: onCreateSelectionError,
    } = useMutation(SelectionCreateDocument, { fetchPolicy: 'no-cache' })
    async function createSelection(registeredClassId: number) {
      await selectionCreate({ registeredClassId })
    }
    onCreateSelectionDone((result) => {
      console.log('Result: ', result)
      if (result.data?.selectionCreate.selection) {
        const selection: Selection = result.data.selectionCreate.selection
        addSelectionToStore(selection, registeredClassSelectionId)
      } else if (result.data?.selectionCreate.userErrors) {
        console.log(result.data.selectionCreate.userErrors)
      }
    })
    onCreateSelectionError((error) => {
      console.log(error)
    })

    /**
     * Updates the specified selection in the store and db.
     * @param classId ID of Registered Class
     * @param selectionId ID of selection
     * @param field selection field
     */
    const {
      mutate: selectionUpdate,
      loading: selectionUpdateLoading,
      onDone: onSelectionUpdateDone,
      onError: onSelectionUpdateError,
    } = useMutation(SelectionUpdateDocument, {
      fetchPolicy: 'no-cache',
    })
    async function updateSelection(
      classId: number,
      selectionId: number,
      field?: string
    ) {
      const selection = registeredClasses.value
        .find((reg) => reg.id === classId)
        ?.selections?.find((sel) => sel.id === selectionId)
      const { id, __typename, ...selectionProps } = <Selection>selection
      let selectionField = null
      if (field && Object.keys(selectionProps).includes(field)) {
        selectionField = Object.fromEntries(
          Array(
            Object.entries(selectionProps).find((item) => item[0] === field)!
          )
        )
      }
      await selectionUpdate({
        selectionId,
        selection: <SelectionInput>(selectionField || selectionProps),
      })
    }
    onSelectionUpdateError((error) => {
      console.log(error)
    })

    /**
     * Updates all selections for a specified Registered Class.
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
     * @param classId ID of Registered Class
     * @param selectionId ID of Selection item
     * @returns Promise
     */
    const {
      mutate: selectionDelete,
      loading: selectionDeleteLoading,
      onDone: onSelectionDeleteDone,
      onError: onSelectionDeleteError,
    } = useMutation(SelectionDeleteDocument)
    async function deleteSelection(classId: number, selectionId: number) {
      await selectionDelete({ selectionId })
      const classIndex = registeredClasses.value.findIndex(
        (item) => item.id === classId
      )
      const selectionIndex = registeredClasses.value[
        classIndex
      ].selections!.findIndex((item) => item.id === selectionId)
      registeredClasses.value[classIndex].selections?.splice(selectionIndex, 1)
    }
    onSelectionDeleteError((error) => {
      console.log(error)
    })

    return {
      registeredClasses,
      $reset,
      classErrors,
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

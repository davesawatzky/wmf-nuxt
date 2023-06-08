import {
  SchoolGroupCreateDocument,
  SchoolGroupDeleteDocument,
  SchoolGroupInfoDocument,
  SchoolGroupUpdateDocument,
} from '~/graphql/gql/graphql'
import type { SchoolGroup, SchoolGroupInput } from '~/graphql/gql/graphql'

export const useSchoolGroup = defineStore(
  'schoolGroup',
  () => {
    const schoolGroup = ref([] as SchoolGroup[])

    function $reset() {
      schoolGroup.value = <SchoolGroup[]>[]
    }

    /**
     * Adds School Group store array
     * @param schoolGrp School Group Object must have valid id property value
     */
    function addToStore(schoolGrp: SchoolGroup): void {
      schoolGroup.value.push({
        id: schoolGrp.id,
        name: schoolGrp.name || '',
        groupSize: schoolGrp.groupSize || null,
        chaperones: schoolGrp.chaperones || null,
        wheelchairs: schoolGrp.wheelchairs || null,
        earliestTime: schoolGrp.earliestTime || '',
        latestTime: schoolGrp.latestTime || '',
        unavailable: schoolGrp.unavailable || '',
        conflictPerformers: schoolGrp.conflictPerformers || '',
        __typename: schoolGrp.__typename || 'SchoolGroup',
      })
    }

    /**
     * Creates a school group record on the db and store
     * @param schoolId ID of School
     * @returns Promise
     */
    function createSchoolGroup(schoolId: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: schoolGroupCreate,
          onDone,
          onError,
        } = useMutation(SchoolGroupCreateDocument, {
          fetchPolicy: 'no-cache',
        })
        schoolGroupCreate({ schoolId }).catch((error) => console.log(error))
        onDone((result) => {
          const schoolGroup: SchoolGroup =
            result.data.registration.school.school_group
          addToStore(schoolGroup)
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Loads SchoolGroups from db into store.
     * @param registrationId ID of Registration Form
     * @returns
     */
    function loadSchoolGroups(registrationId: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          result: resultSchoolGroups,
          load,
          onResult,
          onError,
        } = useLazyQuery(
          SchoolGroupInfoDocument,
          { registrationId },
          { fetchPolicy: 'no-cache' }
        )
        load()
        onResult((result) => {
          const schoolGroups = <SchoolGroup[]>(
            result.data.registration.school.school_group
          )
          for (let i = 0; i < schoolGroups.length; i++) {
            addToStore(schoolGroups[i])
          }
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    /**
     * Updates individual school group information from store to db
     * @param schoolGroupId ID of registered School Group
     * @returns Promise
     */
    function updateSchoolGroup(schoolGroupId: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: schoolGroupUpdate,
          onDone,
          onError,
        } = useMutation(SchoolGroupUpdateDocument, {
          fetchPolicy: 'no-cache',
        })
        const schoolGrp = schoolGroup.value.find(
          (item) => item.id === schoolGroupId
        )
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, __typename, ...schlgrp } = schoolGrp
        schoolGroupUpdate({
          schoolGroupId,
          schoolGroup: <SchoolGroupInput>schlgrp,
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
     * Updates all School Group info to the db
     */
    async function updateAllSchoolGroups(): Promise<void> {
      for (let i = 0; i < schoolGroup.value.length; i++) {
        await updateSchoolGroup(schoolGroup.value[i].id)
      }
    }

    /**
     * Removes selected school group from the db and the school registration form
     * @param schoolGroupId ID of School Group
     * @returns Promise
     */
    function deleteSchoolGroup(schoolGroupId: number): Promise<unknown> {
      return new Promise((resolve, reject) => {
        const {
          mutate: schoolGroupDelete,
          onDone,
          onError,
        } = useMutation(SchoolGroupDeleteDocument)
        schoolGroupDelete({ schoolGroupId }).catch((error) =>
          console.log(error)
        )
        onDone(() => {
          const index = schoolGroup.value.findIndex(
            (e) => e.id === schoolGroupId
          )
          schoolGroup.value.splice(index, 1)
          resolve('Success')
        })
        onError((error) => {
          reject(console.log(error))
        })
      })
    }

    return {
      $reset,
      deleteSchoolGroup,
      updateSchoolGroup,
      schoolGroup,
      updateAllSchoolGroups,
      addToStore,
      createSchoolGroup,
      loadSchoolGroups,
    }
  },
  {
    persist: true,
  }
)

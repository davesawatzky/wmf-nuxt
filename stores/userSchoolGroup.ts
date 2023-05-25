import {
  SchoolGroupCreateDocument,
  SchoolGroupDeleteDocument,
  SchoolGroupInfoDocument,
  SchoolGroupUpdateDocument,
} from '~/graphql/gql/graphql'
import type { SchoolGroup } from '~/graphql/gql/graphql'

export const useSchoolGroup = defineStore(
  'schoolGroup',
  () => {
    const schoolGroup = ref([] as SchoolGroup[])

    function $reset() {
      schoolGroup.value = <SchoolGroup[]>[]
    }

    function addToStore(schoolGrp: SchoolGroup) {
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

    function createSchoolGroup(schoolId: number) {
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

    function loadSchoolGroups(registrationId: number) {
      const {
        result: resultSchoolGroups,
        load: loadSchoolGroups,
        onResult: resultLoadSchoolGroup,
        onError,
      } = useLazyQuery(
        SchoolGroupInfoDocument,
        { registrationId },
        { fetchPolicy: 'no-cache' }
      )
      resultLoadSchoolGroup((result) => {
        const clone = structuredClone(
          <SchoolGroup[]>result.data.registration.school.school_group.id
        )
        for (let i = 0; i < clone.length; i++) {
          addToStore(clone[i])
        }
      })
      onError((error) => {
        console.log(error)
      })
      return {
        resultSchoolGroups,
        loadSchoolGroups,
      }
    }

    async function updateSchoolGroup(
      schoolGroupIndex: number,
      schoolGroupId: number
    ) {
      const { mutate: schoolGroupUpdate, onError } = useMutation(
        SchoolGroupUpdateDocument,
        {
          fetchPolicy: 'no-cache',
        }
      )
      const clone = Object.assign({}, schoolGroup.value[schoolGroupIndex])
      delete clone.id
      await schoolGroupUpdate({
        schoolGroupId,
        schoolGroup: clone,
      })
      onError((error) => {
        console.log(error)
      })
    }

    async function updateAllSchoolGroups() {
      let schoolGroupIndex = 0
      for (const eachSchoolGroup of schoolGroup.value) {
        await updateSchoolGroup(schoolGroupIndex, eachSchoolGroup.id)
        schoolGroupIndex++
      }
    }

    function deleteSchoolGroup(schoolGroupId: number) {
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

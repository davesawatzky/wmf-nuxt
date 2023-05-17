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
    const schoolGroupInfo = ref([] as SchoolGroup[])

    function $reset() {
      schoolGroupInfo.value = <SchoolGroup[]>[]
    }

    function addToStore(schoolGroupData: SchoolGroup | null) {
      schoolGroupInfo.value.push({
        id: 0,
        name: '',
        groupSize: 10,
        chaperones: 0,
        wheelchairs: 0,
        earliestTime: '',
        latestTime: '',
        unavailable: '',
        conflictPerformers: '',
        __typename: 'SchoolGroup',
      })

      if (schoolGroupData) {
        Object.assign(
          schoolGroupInfo.value[schoolGroupInfo.value.length - 1],
          schoolGroupData
        )
      }
    }

    async function createSchoolGroup(schoolId: number) {
      const {
        mutate: schoolGroupCreate,
        onDone: doneSchoolGroupCreate,
        onError,
      } = useMutation(SchoolGroupCreateDocument, {
        fetchPolicy: 'no-cache',
      })
      addToStore(null)
      const clone = Object.assign(
        {},
        schoolGroupInfo.value[schoolGroupInfo.value.length - 1]
      )
      delete clone.id
      await schoolGroupCreate({
        schoolId,
        schoolGroup: clone,
      })
      doneSchoolGroupCreate((result) => {
        schoolGroupInfo.value[schoolGroupInfo.value.length - 1].id =
          result.data.registration.school.school_group.id
      })
      onError((error) => {
        console.log(error)
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
      const clone = Object.assign({}, schoolGroupInfo.value[schoolGroupIndex])
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
      for (const eachSchoolGroup of schoolGroupInfo.value) {
        await updateSchoolGroup(schoolGroupIndex, eachSchoolGroup.id)
        schoolGroupIndex++
      }
    }

    async function deleteSchoolGroup(schoolGroupId: number) {
      const {
        mutate: schoolGroupDelete,
        onDone: doneSchoolGroupDelete,
        onError,
      } = useMutation(SchoolGroupDeleteDocument)
      await schoolGroupDelete({ schoolGroupId })
      doneSchoolGroupDelete(() => {
        const index = schoolGroupInfo.value
          .map((e) => e.id)
          .indexOf(schoolGroupId)
        schoolGroupInfo.value.splice(index, 1)
      })
      onError((error) => {
        console.log(error)
      })
    }

    return {
      $reset,
      deleteSchoolGroup,
      updateSchoolGroup,
      schoolGroupInfo,
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

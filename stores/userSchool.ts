import { provideApolloClient } from '@vue/apollo-composable'
import apolloClient from '@/utilities/apolloClient'
import {
  SchoolCreateDocument,
  SchoolDeleteDocument,
  SchoolInfoDocument,
  SchoolUpdateDocument,
} from '~/graphql/gql/graphql'

interface SchoolInfo {
  id?: number
  name: string
  division: string
  streetNumber: string
  streetName: string
  city: string
  province: string
  postalCode: string
  phone: string
  __typename?: string
}

provideApolloClient(apolloClient)

export const useSchool = defineStore(
  'school',
  () => {
    const schoolInfo = ref({
      id: undefined,
      name: '',
      division: '',
      streetNumber: '',
      streetName: '',
      city: 'Winnipeg',
      province: 'MB',
      postalCode: '',
      phone: '',
    } as SchoolInfo)

    function $reset() {
      schoolInfo.value = <SchoolInfo>{
        id: undefined,
        name: '',
        division: '',
        streetNumber: '',
        streetName: '',
        city: 'Winnipeg',
        province: 'MB',
        postalCode: '',
        phone: '',
      }
    }

    function addToStore(school: SchoolInfo) {
      Object.assign(schoolInfo.value, school)
    }

    async function createSchool(registrationId: number) {
      const { mutate: schoolCreate, onDone: doneSchoolCreate, onError } = useMutation(SchoolCreateDocument)
      const clone = Object.assign({}, schoolInfo.value)
      delete clone.id
      await schoolCreate({
        registrationId,
        schoolInput: clone,
      })
      doneSchoolCreate((result) => {
        schoolInfo.value.id = result.data.schoolCreate.school.id
      })
      onError((error) => {
        console.log(error)
      })
    }

    function loadSchool(registrationId: number) {
      const {
        result: resultSchool,
        load: loadSchool,
        onResult: resultLoadSchool,
        onError,
      } = useLazyQuery(SchoolInfoDocument, { registrationId }, { fetchPolicy: 'network-only' })
      resultLoadSchool((result) => {
        addToStore(<SchoolInfo>result.data.registration.school)
      })
      onError((error) => {
        console.log(error)
      })
      return {
        resultSchool,
        loadSchool,
      }
    }

    async function updateSchool() {
      const { mutate: schoolUpdate, onError } = useMutation(SchoolUpdateDocument, {
        fetchPolicy: 'network-only',
      })
      const clone = Object.assign({}, schoolInfo.value)
      delete clone.id
      delete clone.__typename
      await schoolUpdate({
        schoolId: schoolInfo.value.id,
        school: clone,
      })
      onError((error) => {
        console.log(error)
      })
    }

    async function deleteSchool(schoolId: number) {
      const { mutate: schoolDelete, onError } = useMutation(SchoolDeleteDocument)
      await schoolDelete({ schoolId })
      onError((error) => {
        console.log(error)
      })
    }

    return {
      deleteSchool,
      $reset,
      updateSchool,
      loadSchool,
      createSchool,
      schoolInfo,
      addToStore,
    }
  },
  {
    persist: true,
  }
)

import { UserUpdateDocument } from '~/graphql/gql/graphql'
import type { User, UserInput } from '~/graphql/gql/graphql'

export const useUser = defineStore('user', () => {
  const user = ref(<User>{})

  function $reset() {
    user.value = <User>{}
  }

  function addToStore(userDetails: Partial<User>): void {
    user.value.id = userDetails.id!
    user.value.firstName = userDetails.firstName || ''
    user.value.lastName = userDetails.lastName || ''
    user.value.email = userDetails.email || ''
    user.value.emailConfirmed = userDetails.emailConfirmed || false
    user.value.admin = userDetails.admin || false
    user.value.staff = userDetails.staff || false
    user.value.privateTeacher = userDetails.privateTeacher || false
    user.value.schoolTeacher = userDetails.schoolTeacher || false
    user.value.apartment = userDetails.apartment || ''
    user.value.streetNumber = userDetails.streetNumber || ''
    user.value.streetName = userDetails.streetName || ''
    user.value.city = userDetails.city || ''
    user.value.province = userDetails.province || ''
    user.value.postalCode = userDetails.postalCode || ''
    user.value.phone = userDetails.phone || ''
    user.value.instrument = userDetails.instrument || ''
  }

  /**
   * Updates the User record from the store to the db.
   * But does not change names, password, or email.
   * @returns Promise
   */
  function updateUser(field?: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const {
        mutate: userUpdate,
        onDone,
        onError,
      } = useMutation(UserUpdateDocument, {
        fetchPolicy: 'network-only',
      })
      const { id, __typename, firstName, lastName, email, ...userProps } =
        user.value
      let userField = null
      if (field && Object.keys(userProps).includes(field)) {
        userField = Object.fromEntries(
          Array(Object.entries(userProps).find((item) => item[0] === field)!)
        )
      }
      userUpdate({
        userId: user.value.id,
        user: <UserInput>(userField || userProps),
      }).catch((error) => console.log(error))
      onDone(() => {
        resolve('Success')
      })
      onError((error) => {
        reject(console.log(error))
      })
    })
  }

  async function hasPassword(userID: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const { result, loading, onResult, onError } = useQuery(
        gql`
          query HasPassword($checkIfPasswordExistsId: Int!) {
            checkIfPasswordExists(id: $checkIfPasswordExistsId) {
              id
              pass
            }
          }
        `,
        { checkIfPasswordExistsId: userID },
        { fetchPolicy: 'network-only' }
      )
      onResult((result) => {
        resolve(result.data.checkIfPasswordExists.pass)
      })
      onError((error) => {
        console.log(error)
        reject(error)
      })
    })
  }

  return {
    $reset,
    user,
    updateUser,
    addToStore,
    hasPassword,
  }
})

import { UserUpdateDocument } from '~/graphql/gql/graphql'
import type { User, UserInput } from '~/graphql/gql/graphql'

export const useUser = defineStore(
  'user',
  () => {
    const user = ref(<User>{})
    const checkPasswordId = ref(0)

    function $reset() {
      user.value = <User>{}
    }

    function addToStore(userDetails: Partial<User>): void {
      user.value.id = userDetails.id!
      user.value.firstName = userDetails.firstName || ''
      user.value.lastName = userDetails.lastName || ''
      user.value.hasSignedIn = userDetails.hasSignedIn || false
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
    const {
      mutate: userUpdate,
      loading: userUpdateLoading,
      onDone: onUserUpdateDone,
      onError: onUserUpdateError,
    } = useMutation(UserUpdateDocument, {
      fetchPolicy: 'network-only',
    })
    async function updateUser(field?: string) {
      const { id, __typename, firstName, lastName, email, ...userProps } =
        user.value
      let userField = null
      if (field && Object.keys(userProps).includes(field)) {
        userField = Object.fromEntries(
          Array(Object.entries(userProps).find((item) => item[0] === field)!)
        )
      }
      await userUpdate({
        userId: user.value.id,
        user: <UserInput>(userField || userProps),
      }).catch((error) => console.log(error))
    }
    onUserUpdateError((error) => {
      console.log(error)
    })

    /**
     * Password Check
     */
    const {
      result: resultHasPassword,
      load: loadHasPassword,
      onResult: onHasPasswordResult,
      onError: onHasPasswordError,
    } = useLazyQuery(
      gql`
        query HasPassword($checkIfPasswordExistsId: Int!) {
          checkIfPasswordExists(id: $checkIfPasswordExistsId) {
            id
            pass
          }
        }
      `,
      { checkIfPasswordExistsId: checkPasswordId.value },
      { fetchPolicy: 'network-only' }
    )
    const checkPassword = computed(() => resultHasPassword.value.pass ?? null)
    onHasPasswordError((error) => {
      console.log(error)
    })

    return {
      $reset,
      checkPasswordId,
      checkPassword,
      user,
      updateUser,
      addToStore,
      loadHasPassword,
    }
  },
  { persist: true }
)

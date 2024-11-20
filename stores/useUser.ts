import { UserUpdateDocument } from '~/graphql/gql/graphql'
import type { User, UserInput } from '~/graphql/gql/graphql'

export const useUser = defineStore(
  'user',
  () => {
    const user = ref(<User>{})

    function $reset() {
      user.value = <User>{}
    }

    function addToStore(userDetails: Partial<User>): void {
      user.value.id = userDetails.id!
      user.value.firstName = userDetails.firstName || null
      user.value.lastName = userDetails.lastName || null
      user.value.hasSignedIn = userDetails.hasSignedIn || false
      user.value.email = userDetails.email || null
      user.value.emailConfirmed = userDetails.emailConfirmed || false
      user.value.admin = userDetails.admin || false
      user.value.staff = userDetails.staff || false
      user.value.privateTeacher = userDetails.privateTeacher || false
      user.value.schoolTeacher = userDetails.schoolTeacher || false
      user.value.address = userDetails.address || null
      user.value.city = userDetails.city || null
      user.value.province = userDetails.province || null
      user.value.postalCode = userDetails.postalCode || null
      user.value.phone = userDetails.phone || null
      user.value.instrument = userDetails.instrument || null
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
      try {
        await userUpdate({
          userId: user.value.id,
          user: <UserInput>(userField || userProps),
        })
        return 'complete'
      } catch (error) {
        console.log(error)
        return 'error'
      }
    }
    onUserUpdateError((error) => {
      console.log(error)
    })

    /**
     * Password Check
     */
    const {
      result: resultHasPassword,
      load: hasPasswordLoad,
      refetch: refetchHasPassword,
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
      undefined,
      { fetchPolicy: 'network-only' }
    )
    async function loadHasPassword(id: number) {
      ;(await hasPasswordLoad(null, { checkIfPasswordExistsId: id })) ||
        refetchHasPassword({ checkIfPasswordExistsId: id })
    }
    const checkPassword = computed(() => resultHasPassword.value.pass ?? null)
    onHasPasswordError((error) => {
      console.log(error)
    })

    return {
      $reset,
      checkPassword,
      user,
      updateUser,
      addToStore,
      loadHasPassword,
    }
  },
  { persist: true }
)

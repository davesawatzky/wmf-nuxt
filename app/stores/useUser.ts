import { UserUpdateDocument } from '~/graphql/gql/graphql'
import type { User, UserInput } from '~/graphql/gql/graphql'

export const useUser = defineStore(
  'user',
  () => {
    /**
     * Factory function to create an empty user object with default values
     */
    function createEmptyUser(): Partial<User> {
      return {
        id: 0,
        firstName: null,
        lastName: null,
        isActive: false,
        email: null,
        emailConfirmed: false,
        privateTeacher: false,
        schoolTeacher: false,
        address: null,
        city: null,
        province: null,
        postalCode: null,
        phone: null,
        instrument: null,
        __typename: 'User',
      }
    }

    const user = ref<Partial<User>>(createEmptyUser())

    function $reset() {
      user.value = createEmptyUser()
    }

    /**
     * Adds User object to store from db
     * @param userDetails Partial User object with data to store
     */
    function addToStore(userDetails: Partial<User>): void {
      user.value = {
        id: userDetails.id ?? 0,
        firstName: userDetails.firstName ?? null,
        lastName: userDetails.lastName ?? null,
        isActive: userDetails.isActive ?? false,
        email: userDetails.email ?? null,
        emailConfirmed: userDetails.emailConfirmed ?? false,
        privateTeacher: userDetails.privateTeacher ?? false,
        schoolTeacher: userDetails.schoolTeacher ?? false,
        address: userDetails.address ?? null,
        city: userDetails.city ?? null,
        province: userDetails.province ?? null,
        postalCode: userDetails.postalCode ?? null,
        phone: userDetails.phone ?? null,
        instrument: userDetails.instrument ?? null,
        __typename: userDetails.__typename ?? 'User',
      }
    }

    /**
     * Updates the User record from the store to the db.
     * But does not change names, password, or email.
     * @param field Optional specific field to update
     * @returns Promise resolving to 'complete' or 'error'
     */
    const { mutate: userUpdate, onError: onUserUpdateError } = useMutation(
      UserUpdateDocument,
      {
        fetchPolicy: 'network-only',
      }
    )
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
          userId: user.value.id!,
          user: userField || (userProps as UserInput),
        })
        return 'complete'
      } catch (error) {
        console.error('Failed to update user:', error, {
          operation: 'updateUser',
          field,
          userId: user.value.id,
        })
        return 'error'
      }
    }
    onUserUpdateError((error) => {
      console.error('User update error:', error, {
        operation: 'updateUser',
      })
    })

    /**
     * Password Check - verifies if user has a password set
     * @param id User ID to check
     */
    const {
      result: resultHasPassword,
      load: hasPasswordLoad,
      refetch: refetchHasPassword,
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
      const loaded = await hasPasswordLoad(null, {
        checkIfPasswordExistsId: id,
      })
      if (!loaded) {
        await refetchHasPassword({ checkIfPasswordExistsId: id })
      }
    }
    const checkPassword = computed(() => resultHasPassword.value?.pass ?? null)
    onHasPasswordError((error) => {
      console.error('Password check failed:', error, {
        operation: 'loadHasPassword',
      })
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

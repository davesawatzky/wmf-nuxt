import {
  ItemCreateDocument,
  ItemsDocument,
  type Item,
  type ItemInput,
} from '~/graphql/gql/graphql'

export const useItemStore = defineStore('itemStore', () => {
  const items = ref([] as Item[])

  function $reset() {
    items.value.splice(0, items.value.length)
  }

  function addToStore(item: Partial<Item>) {
    items.value.push(item as Item)
  }

  const {
    mutate: itemCreate,
    loading: itemCreateLoading,
    onDone: onItemCreateDone,
    onError: onItemCreateError,
  } = useMutation(ItemCreateDocument)
  async function createItem(itemInput: ItemInput) {
    await itemCreate({
      itemInput,
    })
  }

  const {
    result: resultItems,
    load: itemsLoad,
    refetch: itemsRefetch,
    onError: onItemsError,
  } = useLazyQuery(ItemsDocument, undefined, { fetchPolicy: 'no-cache' })
  async function loadItems() {
    ;(await itemsLoad()) || (await itemsRefetch())
  }
  watch(resultItems, (newResult) => {
    if (newResult?.items) {
      const items: Item[] = newResult.items
      for (let i = 0; i < items.length; i++) addToStore(items[i])
    }
  })
  onItemsError((error) => {
    console.log('Items loading error. ', error)
  })

  return { items, createItem, loadItems, $reset }
})

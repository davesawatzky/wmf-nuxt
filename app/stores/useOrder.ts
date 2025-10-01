import {
  OrderCreateDocument,
  OrdersDocument,
  type Order,
  type OrderCreateMutation,
  type OrderInput,
} from '~/graphql/gql/graphql'

export const useOrders = defineStore('orderStore', () => {
  const orders = ref([] as Order[])

  function $reset() {
    orders.value.splice(0, orders.value.length)
  }

  function addToStore(order: Partial<Order>) {
    orders.value.push(order as Order)
  }

  const {
    mutate: orderCreate,
    loading: orderCreateLoading,
    onDone: onOrderCreateDone,
    onError: onOrderCreateError,
  } = useMutation(OrderCreateDocument)
  async function createOrder(orderInput: OrderInput) {
    await orderCreate({
      orderInput,
    })
  }

  onOrderCreateDone((result) => {
    if (result.data?.orderCreate.order) {
      const order: OrderCreateMutation['orderCreate']['order'] =
        result.data.orderCreate.order
      addToStore(order)
    } else if (result.data?.orderCreate.userErrors) {
      console.log(result.data.orderCreate.userErrors)
    }
  })
  onOrderCreateError((error) => {
    console.error(error)
  })

  const {
    result: resultOrders,
    load: ordersLoad,
    refetch: ordersRefetch,
    onResult: onOrdersResult,
    onError: onOrdersError,
  } = useLazyQuery(OrdersDocument, undefined, { fetchPolicy: 'no-cache' })

  watch(resultOrders, (newResult) => {
    if (newResult?.orders) {
      // const orders: Order[] = newResult.orders
      // for (let i = 0; i < orders.length; i++) addToStore(orders[i])
    }
  })

  return {
    orders,
    $reset,
    createOrder,
  }
})

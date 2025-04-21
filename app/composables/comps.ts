export function formattedDate(value?: Date | string | null) {
  if (value) {
    return useDateFormat(value, 'ddd, MMM DD, YYYY')
  }
  return
}

export function formattedTime(value?: string | null) {
  if (value) {
    return useDateFormat(value, 'h:mm a')
  }
  return
}

export function formattedCurrency(value: number | null) {
  if (value === null) {
    return ''
  }
  const newAmount = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  })
  return newAmount.format(value)
}

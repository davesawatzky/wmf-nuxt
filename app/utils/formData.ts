import _ from 'lodash'
export const provinces = [
  { id: '1', name: 'BC' },
  { id: '2', name: 'AB' },
  { id: '3', name: 'SK' },
  { id: '4', name: 'MB' },
  { id: '5', name: 'ON' },
  { id: '6', name: 'QC' },
  { id: '7', name: 'NB' },
  { id: '8', name: 'NS' },
  { id: '9', name: 'PEI' },
  { id: '10', name: 'NL' },
  { id: '11', name: 'YT' },
  { id: '12', name: 'NWT' },
  { id: '13', name: 'NVT' },
]

export const prefixes = [
  { id: '1', name: 'Mr.' },
  { id: '2', name: 'Mrs.' },
  { id: '3', name: 'Ms.' },
  { id: '4', name: 'Dr.' },
]

export const textAreaLabel =
  'To avoid scheduling conflicts, please list all other Festival classes entered but not included on this form.  Use only class numbers separated by commas.'

export function WMFNumber(id: number) {
  return `WMF-${id}-${_.random(1000, 9999)}`
}

export const lateDatesAndCosts = {
  SOLO: {
    lateDate: new Date(2024, 11 - 1, 1, 23, 59, 59),
    amount: 20.0,
    cutOffDate: new Date(2024, 11 - 1, 10, 23, 59, 59),
  },
  GROUP: {
    lateDate: new Date(2024, 12 - 1, 1, 23, 59, 59),
    amount: 20.0,
    cutOffDate: new Date(2024, 12 - 1, 4, 23, 59, 59),
  },
  SCHOOL: {
    lateDate: new Date(2024, 12 - 1, 1, 23, 59, 59),
    amount: 20.0,
    cutOffDate: new Date(2024, 12 - 1, 4, 23, 59, 59),
  },
  COMMUNITY: {
    lateDate: new Date(2024, 12 - 1, 1, 23, 59, 59),
    amount: 20.0,
    cutOffDate: new Date(2024, 12 - 1, 4, 23, 59, 59),
  },
}

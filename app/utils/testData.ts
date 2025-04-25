import type { Performer, Teacher } from '~/graphql/gql/graphql'

export const testFullTeacher: Teacher = {
  id: 25,
  firstName: 'David',
  lastName: 'Sawatzky',
  privateTeacher: true,
  schoolTeacher: true,
  address: '34G5 - 37 Waterford Bay',
  city: 'Toronto',
  province: 'ON',
  postalCode: 'R3T 1H6',
  email: 'david@diatonic.io',
  phone: '(204) 599-3521',
  instrument: 'piano',
  __typename: 'Teacher',
}

export const testPartialTeacher: Partial<Teacher> = {
  firstName: 'David',
  address: '37 Waterford Bay',
  province: 'ON',
  email: 'david@diatonic.io',
}

export const testFullPerformer1: Omit<Performer, 'selections'> = {
  id: 30,
  firstName: 'Mikayla',
  lastName: 'Sawatzky',
  address: '34G5 - 37 Waterford Bay',
  city: 'Toronto',
  province: 'ON',
  postalCode: 'R3T 1H6',
  email: 'david@diatonic.io',
  phone: '(204) 599-3521',
  instrument: 'piano',
  age: 18,
  level: 'Grade 9',
  otherClasses: '',
  __typename: 'Performer',
}

export const testFullPerformer2: Omit<Performer, 'selections'> = {
  id: 30,
  firstName: 'Madelaine',
  lastName: 'Thiessen',
  address: '19 Field Rd.',
  city: 'Virgil',
  province: 'ON',
  postalCode: 'L0S 1T0',
  email: 'david@diatonic.io',
  phone: '(204) 599-3521',
  instrument: 'piano',
  age: 22,
  level: 'Grade 9',
  otherClasses: '',
  __typename: 'Performer',
}

export const testPartialPerformer: Partial<Performer> = {
  id: 30,
  firstName: 'Mikayla',
  lastName: 'Sawatzky',
  address: '37 Waterford Bay',
  phone: '(204) 599-3529',
  instrument: 'piano',
  age: 18,
  level: 'Grade 9',
  otherClasses: '',
  __typename: 'Performer',
}

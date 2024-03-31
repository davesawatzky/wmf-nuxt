import type { Performer, Teacher } from '~/graphql/gql/graphql'

export const testFullTeacher: Teacher = {
  id: 25,
  firstName: 'David',
  lastName: 'Sawatzky',
  privateTeacher: true,
  schoolTeacher: true,
  apartment: '34G5',
  streetNumber: '37',
  streetName: 'Waterford Bay',
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
  streetNumber: '37',
  province: 'ON',
  email: 'david@diatonic.io',
}

export const testFullPerformer1: Performer = {
  id: 30,
  firstName: 'Mikayla',
  lastName: 'Sawatzky',
  apartment: '34G5',
  streetNumber: '37',
  streetName: 'Waterford Bay',
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

export const testFullPerformer2: Performer = {
  id: 30,
  firstName: 'Madelaine',
  lastName: 'Thiessen',
  apartment: '',
  streetNumber: '19',
  streetName: 'Field Rd.',
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
  streetNumber: '37',
  streetName: 'Waterford Bay',
  phone: '(204) 599-3529',
  instrument: 'piano',
  age: 18,
  level: 'Grade 9',
  otherClasses: '',
  __typename: 'Performer',
}

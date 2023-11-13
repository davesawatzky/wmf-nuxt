import { setActivePinia, createPinia } from 'pinia'
import { testFullTeacher, testPartialTeacher } from './testData'
import { useTeacher } from '@/stores/userTeacher'
import { expect } from 'vitest'

let teacherStore: any

describe('Teacher Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    teacherStore = useTeacher()
  })

  describe('addToStore', () => {
    it('Adds a teacher object to the store', () => {
      teacherStore.addToStore(testFullTeacher)
      expect(teacherStore.teacher).toMatchObject(testFullTeacher)
    })
    it('Also accepts a particial teacher', () => {
      teacherStore.addToStore(testPartialTeacher)
      expect(teacherStore.teacher.lastName).toBe('')
    })
    it('adds the id as a number', () => {
      teacherStore.addToStore(testFullTeacher)
      expect(teacherStore.teacher.id).toBeTypeOf('number')
    })
    it('typeof privateTeacher and schoolTeacher is booelean', () => {
      teacherStore.addToStore(testFullTeacher)
      expect(teacherStore.teacher.privateTeacher).toBeTypeOf('boolean')
      expect(teacherStore.teacher.schoolTeacher).toBeTypeOf('boolean')
    })
  })

  it('Resets the teacher ref to empty', () => {
    teacherStore.addToStore(testFullTeacher)
    teacherStore.$resetTeacher()
    expect(teacherStore.teacher).is.empty
  })

  it('Gets the full name of the teacher', () => {
    teacherStore.addToStore(testFullTeacher)
    const fullname = teacherStore.fullName
    expect(fullname).toBe('David Sawatzky')
  })
})

import { createPinia, setActivePinia } from 'pinia'
import { expect } from 'vitest'
import { testFullTeacher, testPartialTeacher } from '../utils/testData'
import { useTeacher } from '@/stores/useTeacher'

let teacherStore: any

describe('teacher Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    teacherStore = useTeacher()
  })

  describe('addToStore', () => {
    it('adds a teacher object to the store', () => {
      teacherStore.addToStore(testFullTeacher)
      expect(teacherStore.teacher).toMatchObject(testFullTeacher)
    })
    it('also accepts a particial teacher', () => {
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

  it('resets the teacher ref to empty', () => {
    teacherStore.addToStore(testFullTeacher)
    teacherStore.$resetTeacher()
    expect(teacherStore.teacher).is.empty
  })

  it('gets the full name of the teacher', () => {
    teacherStore.addToStore(testFullTeacher)
    const fullname = teacherStore.fullName
    expect(fullname).toBe('David Sawatzky')
  })
})

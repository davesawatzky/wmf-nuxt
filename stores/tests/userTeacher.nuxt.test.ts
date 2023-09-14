import { setActivePinia, createPinia } from 'pinia'
import { useTeacher } from '../userTeacher'

describe('Teacher Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('Resets the teacher ref'),
    () => {
      const teacherStore = useTeacher()
    }
})

import { setActivePinia, createPinia } from 'pinia'
import { useTeacher } from '@/stores/userTeacher'

describe('Teacher Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('Resets the teacher ref'),
    () => {
      const teacherStore = useTeacher()
    }
})

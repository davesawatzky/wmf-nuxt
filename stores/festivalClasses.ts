import { defineStore } from 'pinia'

interface TrophyDescriptions {
  name: string
  description: string
}

interface Descriptions {
  classDescription: string
  subdisciplineDescription: string
  categoryDescription: string
  levelDescription: string
  trophyDescriptions: TrophyDescriptions[]
  requiredSelection: string
}

export const festivalClasses = defineStore(
  'festivalClasses',
  () => {
    const descriptions = ref([
      {
        classDescription: '',
        subdisciplineDescription: '',
        categoryDescription: '',
        levelDescription: '',
        trophyDescriptions: [{ name: '', description: '' }],
        requiredSelection: '',
      },
    ] as Descriptions[])

    function $reset() {
      descriptions.value = [
        {
          classDescription: '',
          subdisciplineDescription: '',
          categoryDescription: '',
          levelDescription: '',
          trophyDescriptions: [{ name: '', description: '' }],
          requiredSelection: '',
        },
      ]
    }

    function addDescriptions() {
      descriptions.value.push({} as Descriptions)
    }

    function removeDescription(index: number) {
      descriptions.value.splice(index, 1)
    }

    return { descriptions, $reset, addDescriptions, removeDescription }
  },
  {
    persist: true,
  }
)

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
    const descriptions = ref<Descriptions[]>([createEmptyDescription()])

    /**
     * Factory function to create an empty description object
     */
    function createEmptyDescription(): Descriptions {
      return {
        classDescription: '',
        subdisciplineDescription: '',
        categoryDescription: '',
        levelDescription: '',
        trophyDescriptions: [{ name: '', description: '' }],
        requiredSelection: '',
      }
    }

    /**
     * Resets the descriptions store to initial state
     */
    function $reset() {
      descriptions.value = [createEmptyDescription()]
    }

    /**
     * Adds a new empty description object to the array
     */
    function addDescriptions() {
      descriptions.value.push(createEmptyDescription())
    }

    /**
     * Removes a description at the specified index
     * @param index The index of the description to remove
     */
    function removeDescription(index: number) {
      if (index >= 0 && index < descriptions.value.length) {
        descriptions.value.splice(index, 1)
      } else {
        console.error('Invalid index for removeDescription:', {
          operation: 'removeDescription',
          index,
          arrayLength: descriptions.value.length,
        })
      }
    }

    return { descriptions, $reset, addDescriptions, removeDescription }
  },
  {
    persist: true,
  }
)

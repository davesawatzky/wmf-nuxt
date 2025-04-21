/**
 * Update a nested value in an object or array based on a condition.
 *
 * @param data - The object or array to update.
 * @param keyToUpdate - The key to update.
 * @param newValue - The new value to set.
 * @param conditionKey - The key to check for a condition.
 * @param conditionValue - The value to match the condition key against.
 * @param targetKey - The key to target for updating (optional).
 * @returns The updated object or array.
 */
export function updateNestedValue<T>(
  data: T,
  keyToUpdate: string,
  newValue: unknown,
  conditionKey: string,
  conditionValue: unknown,
  targetKey?: string
): T {
  if (isRef(data)) {
    data.value = updateNestedValue(
      data.value,
      keyToUpdate,
      newValue,
      conditionKey,
      conditionValue,
      targetKey
    )
    return data
  }

  // If it's an array, map over it.
  if (Array.isArray(data)) {
    return data.map((item) =>
      updateNestedValue(
        item,
        keyToUpdate,
        newValue,
        conditionKey,
        conditionValue,
        targetKey
      )
    ) as unknown as T
  }
  // If it's an object, iterate over its keys.
  else if (data !== null && typeof data === 'object') {
    // Create a copy of the original object to maintain its type
    const updated = { ...data } as Record<string, unknown>

    // If targetKey provided and exists in data, handle that specific property
    if (targetKey && Object.prototype.hasOwnProperty.call(updated, targetKey)) {
      const targetValue = updated[targetKey]
      // Check if targetKey points to an array or object and process accordingly
      if (Array.isArray(targetValue)) {
        // Process each item in the array
        updated[targetKey] = targetValue.map((item) =>
          updateNestedValue(
            item,
            keyToUpdate,
            newValue,
            conditionKey,
            conditionValue,
            undefined // Don't pass targetKey further as we're already inside it
          )
        )
      } else {
        // Process as before for objects or other values
        updated[targetKey] = updateNestedValue(
          targetValue,
          keyToUpdate,
          newValue,
          conditionKey,
          conditionValue,
          undefined // Don't pass targetKey further as we're already inside it
        )
      }
    }
    // Check if this object has the condition key and if it matches the condition value
    const shouldUpdate =
      Object.prototype.hasOwnProperty.call(data, conditionKey) &&
      (data as Record<string, unknown>)[conditionKey] === conditionValue

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        // Update the matching key only if the condition is met
        if (key === keyToUpdate && shouldUpdate) {
          updated[key] = newValue
          console.log(`Changed ${keyToUpdate} value to ${newValue}`)
        } else if (!(targetKey && key === targetKey)) {
          // Otherwise, recurse into the property (skip if it was already handled by targetKey above)
          const value = (data as Record<string, unknown>)[key]
          updated[key] = updateNestedValue(
            value,
            keyToUpdate,
            newValue,
            conditionKey,
            conditionValue,
            targetKey
          )
        }
      }
    }
    return updated as unknown as T
  }
  // Otherwise, return the data as-is.
  return data
}

/**
 * Extract all values of a specific property from a deeply nested object/array structure,
 * targeting collections with a specific key.
 *
 * @param data - The object or array to search through.
 * @param keyToExtract - The key name whose values we want to extract.
 * @param targetContainerKey - Optional. A key name that identifies the collection/object containing the properties.
 * @param searchPath - Optional. A path to a specific property where to search for the key.
 * @returns A Set containing all found values for the specified key.
 */
export function extractNestedValues<T>(
  data: unknown,
  keyToExtract: string,
  targetContainerKey?: string,
  searchPath?: string | string[]
): Set<T> {
  // Handle Vue refs at the top level
  if (isRef(data)) {
    return extractNestedValues<T>(
      data.value,
      keyToExtract,
      targetContainerKey,
      searchPath
    )
  }

  // Use the search path functionality if provided
  if (searchPath) {
    // Convert string path to array if needed (e.g., 'users.addresses' -> ['users', 'addresses'])
    const pathParts =
      typeof searchPath === 'string' ? searchPath.split('.') : searchPath

    // Navigate to the specified path
    let currentData = data
    for (const part of pathParts) {
      if (currentData === null || typeof currentData !== 'object') {
        return new Set<T>() // Path doesn't exist, return empty set
      }

      // Unwrap ref if the current part points to a ref
      const nextData = (currentData as Record<string, unknown>)[part]
      currentData = isRef(nextData) ? nextData.value : nextData

      // If we hit undefined or null while traversing the path, return empty set
      if (currentData === undefined || currentData === null) {
        return new Set<T>()
      }
    }

    // If we have both a searchPath and targetContainerKey, use the targetContainerKey
    // to further narrow down our search within the path
    if (targetContainerKey) {
      return findAndExtractFromTargetKey(
        currentData,
        keyToExtract,
        targetContainerKey
      )
    }

    // Otherwise just extract from this nested location
    return extractNestedValuesInternal(currentData, keyToExtract)
  }

  // If no search path but we have a targetContainerKey, search the entire structure
  // for the target container key and extract values from there
  if (targetContainerKey) {
    return findAndExtractFromTargetKey(data, keyToExtract, targetContainerKey)
  }

  // If no specific target is provided, use the original behavior
  return extractNestedValuesInternal(data, keyToExtract)
}

/**
 * Find all instances of a target container key and extract values from it
 */
function findAndExtractFromTargetKey<T>(
  data: unknown,
  keyToExtract: string,
  targetContainerKey: string
): Set<T> {
  const result = new Set<T>()

  // Handle refs
  if (isRef(data)) {
    return findAndExtractFromTargetKey(
      data.value,
      keyToExtract,
      targetContainerKey
    )
  }

  // Base case: not an object or array
  if (data === null || typeof data !== 'object') {
    return result
  }

  // If this object has the target container key, extract values from it
  if (Object.prototype.hasOwnProperty.call(data, targetContainerKey)) {
    const containerValue = (data as Record<string, unknown>)[targetContainerKey]
    const containerUnwrapped = isRef(containerValue)
      ? containerValue.value
      : containerValue

    // Extract values from this container
    if (containerUnwrapped !== null && typeof containerUnwrapped === 'object') {
      // If the container is an array, search each item for the key
      if (Array.isArray(containerUnwrapped)) {
        containerUnwrapped.forEach((item) => {
          if (
            item &&
            typeof item === 'object' &&
            Object.prototype.hasOwnProperty.call(item, keyToExtract)
          ) {
            const extractedValue = (item as Record<string, unknown>)[
              keyToExtract
            ]
            result.add(
              isRef(extractedValue)
                ? (extractedValue.value as T)
                : (extractedValue as T)
            )
          }
        })
      }
      // If the container is an object, check if it has the key
      else if (
        Object.prototype.hasOwnProperty.call(containerUnwrapped, keyToExtract)
      ) {
        const extractedValue = (containerUnwrapped as Record<string, unknown>)[
          keyToExtract
        ]
        result.add(
          isRef(extractedValue)
            ? (extractedValue.value as T)
            : (extractedValue as T)
        )
      }
    }
  }

  // Continue searching deeper in the structure
  if (Array.isArray(data)) {
    data.forEach((item) => {
      const itemValues = findAndExtractFromTargetKey<T>(
        item,
        keyToExtract,
        targetContainerKey
      )
      itemValues.forEach((value) => result.add(value))
    })
  } else {
    Object.values(data).forEach((value) => {
      if (value !== null && typeof value === 'object') {
        const nestedValues = findAndExtractFromTargetKey<T>(
          value,
          keyToExtract,
          targetContainerKey
        )
        nestedValues.forEach((value) => result.add(value))
      }
    })
  }

  return result
}

/**
 * Internal helper function that does the actual extraction
 */
function extractNestedValuesInternal<T>(
  data: unknown,
  keyToExtract: string
): Set<T> {
  // Create a Set to store the extracted values
  const result = new Set<T>()
  // Create a Set to track JSON strings for value-based uniqueness
  const seenJsonValues = new Set<string>()

  // Helper to add an item ensuring value-based uniqueness
  const addUniqueItem = (item: unknown) => {
    // Skip undefined and null values
    if (item === undefined || item === null) return

    // Handle objects (including arrays) using JSON stringification for uniqueness
    if (typeof item === 'object') {
      try {
        const itemJson = JSON.stringify(item)
        if (!seenJsonValues.has(itemJson)) {
          seenJsonValues.add(itemJson)
          result.add(item as T)
        }
      } catch (e) {
        console.error(e)
        // If item cannot be stringified (circular refs, etc.), fall back to reference equality
        result.add(item as T)
      }
    } else {
      // Primitives can use the Set's built-in uniqueness
      result.add(item as T)
    }
  }

  // Handle refs
  if (isRef(data)) {
    return extractNestedValuesInternal(data.value, keyToExtract)
  }

  // Base case: not an object or array
  if (data === null || typeof data !== 'object') {
    return result
  }

  // Check if current object has the key we're looking for
  if (Object.prototype.hasOwnProperty.call(data, keyToExtract)) {
    // Handle if the extracted value itself is a ref
    const extractedValue = (data as Record<string, unknown>)[keyToExtract]
    const unwrappedValue = isRef(extractedValue)
      ? extractedValue.value
      : extractedValue

    // Handle different types of extracted values
    if (Array.isArray(unwrappedValue)) {
      // If it's an array, add each item to the result set
      unwrappedValue.forEach((item) => {
        addUniqueItem(item)
      })
    } else {
      // Add the value as is, whether it's a primitive or object
      addUniqueItem(unwrappedValue)
    }
  }

  // Handle arrays and objects
  if (Array.isArray(data)) {
    // For each item in array, extract values and add to result set
    data.forEach((item) => {
      const itemValues = extractNestedValuesInternal<T>(item, keyToExtract)
      itemValues.forEach((value) => addUniqueItem(value))
    })
  } else {
    // For objects, recursively process each property
    Object.values(data).forEach((value) => {
      if (value !== null && typeof value === 'object') {
        const nestedValues = extractNestedValuesInternal<T>(value, keyToExtract)
        nestedValues.forEach((value) => addUniqueItem(value))
      }
    })
  }

  return result
}

/**
 * Updates the given key-value pairs in the URL search parameters while preserving existing ones.
 * @param existingParams Current URLSearchParams object.
 * @param newParams Object containing key-value pairs to be updated or added.
 * @returns Updated search parameters as a string.
 */
export const updateSearchParams = (
  existingParams: URLSearchParams,
  newParams: object
): string => {
  const params = new URLSearchParams(existingParams);

  Object.entries(newParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Remove old values first
      params.delete(key);
      // For arrays, append each value separately as a key-value pair
      value.forEach((val) => {
        params.append(key, val);
      });
    } else if (value) {
      params.set(key, value); // Update or add new key-value pair
    } else {
      params.delete(key); // Remove the key if the value is empty or null
    }
  });

  return params.toString();
};

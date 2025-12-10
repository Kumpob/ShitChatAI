  function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

  function helperGetLocalStorageUsage() {
  let total = 0;

  for (let key in localStorage) {
    if (!localStorage.hasOwnProperty(key)) continue;

    const value = localStorage.getItem(key);
    if (value) {
      // length in UTF-16, convert to bytes
      total += key.length + value.length;
    }
  }

  return total; // bytes
}

  function getLocalStorageUsage() {
  return formatBytes(helperGetLocalStorageUsage()); // bytes
}

async function estimateLocalStorageMaxSize() {
  let testKey = "__storage_test__";
  let testData = "x".repeat(1024); // 1 KB block
  let count = 0;

  try {
    while (true) {
      localStorage.setItem(testKey + count, testData);
      count++;
    }
  } catch (e) {
    // cleanup test keys
    for (let i = 0; i < count; i++) {
      localStorage.removeItem(testKey + i);
    }

    if (e instanceof DOMException && (
        e.name === "QuotaExceededError" ||
        e.name === "NS_ERROR_DOM_QUOTA_REACHED"
    )) {
      return formatBytes((count * 1024)+helperGetLocalStorageUsage()); // bytes
    }

    throw e; // unexpected error
  }
}

export { formatBytes, getLocalStorageUsage, estimateLocalStorageMaxSize };
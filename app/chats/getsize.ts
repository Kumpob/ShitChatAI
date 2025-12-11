function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function helperGetLocalStorageUsage() {
  // ❗ Guard for server-side (no window / localStorage)
  if (typeof window === "undefined" || !("localStorage" in window)) {
    return 0;
  }

  let total = 0;

  for (const key in localStorage) {
    if (!Object.prototype.hasOwnProperty.call(localStorage, key)) continue;

    const value = localStorage.getItem(key);
    if (value) {
      total += key.length + value.length;
    }
  }

  return total; // bytes
}

function getLocalStorageUsage() {
  // returns already formatted
  return formatBytes(helperGetLocalStorageUsage());
}

async function estimateLocalStorageMaxSize() {
  // ❗ Guard for server-side
  if (typeof window === "undefined" || !("localStorage" in window)) {
    return formatBytes(0);
  }

  const testKey = "__storage_test__";
  const testData = "x".repeat(1024); // 1 KB block
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

    if (
      e instanceof DOMException &&
      (e.name === "QuotaExceededError" ||
        e.name === "NS_ERROR_DOM_QUOTA_REACHED")
    ) {
      const used = helperGetLocalStorageUsage();
      const total = count * 1024 + used;
      return formatBytes(total);
    }

    throw e; // unexpected error
  }
}

export { formatBytes, getLocalStorageUsage, estimateLocalStorageMaxSize };


export const getUniqueObjectValues = (array, key) => {
  return array
    .map((item) => item[key])
    .filter((value, index, arr) => arr.indexOf(value) === index);
}

// Sorts array of objects by object key in descending order
export const sortObjectValuesAsc = (array, key) => {
  const clone = JSON.parse(JSON.stringify(array));

  return clone.sort((a, b) => {
    const nameA = a[key].toLowerCase();
    const nameB = b[key].toLowerCase();
    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  });
}

// Input "1.7.5.0"
// Output 1.750
const convertVersionIntoDecimal = (version) => {
  const decimal = version
    .replace(".", "-")
    .replaceAll(".", "")
    .replace("-", ".");

  return decimal;
}

// Sorts versions in descending order
const sortVersions = (array) => {
  const clone = JSON.parse(JSON.stringify(array));

  clone.sort((a, b) => {
    const decimalA = convertVersionIntoDecimal(a);
    const decimalB = convertVersionIntoDecimal(b);
    return decimalB - decimalA
  })

  return clone;
}

// Sorts countries by devices in descending order
const sortCountries = (array, devices) => {
  const clone = JSON.parse(JSON.stringify(array));

  clone.sort((a, b) => {
    return devices[a] > devices[b] ? -1 : devices[a] < devices[b] ? 1 : 0;
  })

  return clone;
}

// Group by object key
const groupBy = (array, key) => {
  const grouped = array.reduce((acc, curr) => {
    const keyName = curr[key];
    (acc[keyName] = acc[keyName] || []).push(curr);
    return acc;
  }, {});

  return grouped;
}

export const calculateDevices = (array, key) => {
  const grouped = groupBy(array, key);

  for (const keyName in grouped) {
    grouped[keyName] = grouped[keyName]
      .map(item => item.days[0])
      .reduce((acc, curr) => acc + curr)
  }

  return grouped;
}

const convertToSelectOptions = (array) => {
  return array.map(item => {
    return {
      value: item,
      name: item
    }
  })
}

export const getVersionOptions = (filteredRetention) => {
  const uniqueVersions = getUniqueObjectValues(filteredRetention, 'app_ver');
  const sortedVersions = sortVersions(uniqueVersions);
  const options = convertToSelectOptions(sortedVersions);
  return options;
}

export const getCountryOptions = (filteredRetention, devices) => {
  const uniqueCountries = getUniqueObjectValues(filteredRetention, 'country');
  const sortedCountries = sortCountries(uniqueCountries, devices);
  const options = convertToSelectOptions(sortedCountries);
  return options;
}
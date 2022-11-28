
const URL = 'https://restcountries.com/v3.1/name/';
const FIELDS = '?fields=name,capital,population,flags,languages';
export const fetchCountries = name =>
  fetch(URL + name + FIELDS).then(res => {
    if (!res.ok)
      throw new Error(
        JSON.stringify({
          type: 'failure',
          message: 'Oops, there is no country with that name',
        })
      );
    return res.json();
  });
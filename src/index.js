import './css/styles.css';

import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchBox = document.querySelector('#search-box');
const counrtyList = document.querySelector('.country-list');
const counrtyInfo = document.querySelector('.country-info');


const DEBOUNCE_DELAY = 300;

const parseResponse = res => {
  return res.reduce((acc, country) => {
    delete country.altSpellings;
    acc.push({
      ...country,
      name: country.name.common,
      flags: country.flags.svg,
      languages: Object.values(country.languages).join(', '),
    });
    return acc;
  }, []);
};

const onKeyDown = () => {
  clearMarkup();
  const inputFieldvalue = searchBox.value.trim();
  if (!inputFieldvalue) return;
  fetchCountries(inputFieldvalue)
    .then(parseResponse)
    .then(countries => {
      if (countries.length > 10) {
        throw new Error(
          JSON.stringify({
            type: 'info',
            message:
              'Too many matches found. Please enter a more specific name.',
          })
        );
      }
      return countries;
    })
    .then(countries => {
      if (countries.length === 1) {
        counrtyInfo.innerHTML = oneCounrtyMarkup(countries[0]);
      } else {
        counrtyList.innerHTML = manyCounrtisListMarkup(countries);
      }
    })
    .catch(err => {
      const { type, message } = JSON.parse(err.message);
      Notify[type](message, {
        fontSize: '16px',
      });
    });
};

searchBox.addEventListener('input', debounce(onKeyDown, DEBOUNCE_DELAY));




const manyCounrtisListMarkup = countries =>
  countries
    .map(({ name, flags }) => {
      return `    
    <li>
      <img width="20" height="20"
      src="${flags}">
      </img>
      <p>
      ${name}</p>
    </li>`;
    })
    .join('');

    const oneCounrtyMarkup = ({
  name,
  flags,
  capital,
  population,
  languages,
}) => `<h2><img width="20" height="20"
      src="${flags}">
      </img>${name}</h2>
    <p><strong>Capital:</strong> ${capital}</p>
    <p><strong>Population:</strong> ${population}</p>
    <p><strong>Languages:</strong> ${languages}</p>`;

 const clearMarkup = () => {
  counrtyList.innerHTML = '';
  counrtyInfo.innerHTML = '';
};
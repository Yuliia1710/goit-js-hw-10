import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(searchInput) {
  let inputText = searchInput.target.value.trim();

  if (inputText === '') {
    clearList();
    clearInfo();
    return;
  }

  fetchCountries(inputText).then(countries => {
    clearInfo();
    clearList();
    showAllMessage(countries);
  });
}

function showAllMessage(countries) {
  if (countries.length === 0) {
    showErrorMessage();
  }
  if (countries.length > 10) {
    showInfoMessage();
  }
  if (countries.length === 1) {
    showCountryInfo(countries[0]);
  }
  if (countries.length > 1 && countries.length <= 10) {
    showCountriesList(countries);
  }
}

function clearList() {
  list.innerHTML = '';
}
function clearInfo() {
  info.innerHTML = '';
}

function showErrorMessage() {
  Notify.failure('Oops, there is no country with that name', { timeout: 1200 });
}

function showInfoMessage() {
  Notify.info('Too many matches found. Please enter a more specific name.', {
    timeout: 1200,
  });
}

function showCountryInfo({
  name: { official },
  capital,
  population,
  flags: { png, alt },
  languages,
}) {
  let language = Object.values(languages);
  let countryInfo = `<div class="container">
    <img class="i-flag" src="${png}" alt="${alt}" />
    <h2 class="i-title">${official}</h2>
    </div>
    <p><strong>Capital: </strong>${capital}</p>
    <p><strong>Population: </strong>${population}</p>
    <p><strong>Languages: </strong>${language}</p>`;
  info.innerHTML = countryInfo;
}

function showCountriesList(countries) {
  let listItems = countries
    .map(country => {
      const {
        name: { official },
        flags: { png, alt },
      } = country;
      return `<li class = "list">
        <img class="l-flag" src="${png}" alt="${alt}" />
        <h2 class="l-title">${official}</h2>
                </li>`;
    })
    .join('');

  list.innerHTML = listItems;
}

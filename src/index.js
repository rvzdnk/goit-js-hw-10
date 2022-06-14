// Import CSS styles
import './css/styles.css';

// Import js function
import './js/fetchCountries.js';

import {fetchCountries} from './js/fetchCountries';

// Import debounce form lodash 
import debounce from 'lodash.debounce';

// Import of Notiflix library
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';


//QS
const searchBox = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");

const DEBOUNCE_DELAY = 300;

//Event handler for search box
searchBox.addEventListener("input",debounce(searchBoxValue, DEBOUNCE_DELAY));

//Function which search result 

function searchBoxValue() {
    fetchCountries(searchBox.value.trim())
      .then(data => countriesData(data))
      .catch((error) => {
        if (searchBox.value !== "") {
          Notiflix.Notify.failure("Oops, there is no country with that name");
        }
        clearData(countryList, countryInfo);
        console.log(`Error: ${error.message}`);
    });
  };

function countriesData (data){
    if (data.length > 10){
        clearData(countryList, countryInfo);
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
    } 
    else if (data.length >=2 && data.length <=10){
        clearData(countryList, countryInfo);
        countryList.innerHTML = data
        .map
            (({name, flags}) => 
            `<li class="country-item">
              <img class="country-flag--mini" src="${flags.svg}" alt="The flag of ${name.common}">
              <p class="country-name">${name.common}</p>
            </li>`
          )
          .join("");
    }
    else if (data.length === 1) {
        clearData(countryList, countryInfo);
        countryList.innerHTML = data
        .map(({name, capital, population, flags, languages}) => 
        `<h2 class="country-info__name"><img class="country-flag--big" src="${flags.svg}" alt="The flag of ${name.common}">${name.common}</h2>
        <p class="country-info__item"><span class="country-info__label">Capital:</span> ${capital}</p>
        <p class="country-info__item"><span class="country-info__label">Population:</span> ${population}</p>
        <p class="country-info__item"><span class="country-info__label">Languages:</span> ${Object.values(languages).join(", ")}</p>`
      );
      }
    else if (data.length <1){
        clearData(countryList, countryInfo);
    }
}

function clearData(...outputs) {
    outputs.forEach(output => output.innerHTML = "");  }
  
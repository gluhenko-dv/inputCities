const dropdownListsDefault = document.querySelector(
    '.dropdown-lists__list--default'
  ),
  dropdownListsComplete = document.querySelector(
    ".dropdown-lists__list--autocomplete"
  ),
  dropdownListsSelect = document.querySelector(".dropdown-lists__list--select"),
  selectCities = document.getElementById("select-cities"),
  closeButton = document.querySelector(".close-button"),
  dropdown = document.querySelector(".dropdown");
let dataBase,
  setLocal = "";

const start = () => {

  const locale = {
    'RU': 'Россия',
    'EN': 'United Kingdom',
    'DE': 'Deutschland'
  };

  const cookie = document.cookie.match(
    "(^|;) ?" + "setLocal" + "=([^;]*)(;|$)"
  );
  if (!cookie) {
    setLocal = prompt("Введите локаль (RU, EN или DE)");
    document.cookie = `setLocal=${setLocal}`;
    localStorage.dataBase = [];
    start();
    return;
  }
  setLocal = cookie[2];

  if (localStorage.dataBase) {
    dataBase = JSON.parse(localStorage.dataBase);
    dataBase.sort((item) =>{
      if(item.country === locale[setLocal]){
        return 1;
      } else {
        return -1;
      }
    });
    dataBase.reverse();
  } else {
    const dbCities = () => fetch("db_cities.json");

    dbCities()
      .then((response) => response.json())
      .then((data) => {
        let json = JSON.stringify(data[setLocal]);
        localStorage.dataBase = json;
        start();
      })
      .catch((error) => console.error(error));
  }

  dropdown.style.display = "none";
  selectCities.addEventListener("click", () => {
    renderDefault();
  });
  selectCities.addEventListener("input", (e) => {
    if (e.target.value) {
      renderComplete(e.target.value);
    } else {
      renderDefault();
    }
  });
};

const countryBlock = (data) =>
  `
  <div class='dropdown-lists__countryBlock'>
  <div class='dropdown-lists__total-line' onclick="(${renderSelect})('${data.country}')">
    <div class='dropdown-lists__country'>${data.country}</div>
    <div class='dropdown-lists__count'>${data.count}</div>
  </div>
  </div>`;

const countrySelectBlock = (data) =>
  `
  <div class='dropdown-lists__countryBlock'>
  <div class='dropdown-lists__total-line' onclick="(${renderDefault})()">
    <div class='dropdown-lists__country'>${data.country}</div>
    <div class='dropdown-lists__count'>${data.count}</div>
  </div>
  </div>`;

const cityBlock = (data) =>
  `  <div class='dropdown-lists__line'>
    <div class='dropdown-lists__city'>${data.name}</div>
    <div class='dropdown-lists__count'>${data.count}</div>
  </div>`;

const renderDefault = () => {
  const dropdownListsCol = dropdownListsDefault.querySelector(
    '.dropdown-lists__col'
  );
  dropdownListsCol.textContent = '';
  dropdownListsDefault.style.display = 'block';
  dropdownListsSelect.style.display = 'none';
  dropdown.style.display = 'none';
  closeButton.style.display = 'block';
  dropdown.style.display = 'block';
  dropdownListsComplete.style.display = 'none';

  closeButton.addEventListener('click', () => {
    closeButton.style.display = 'none';
    dropdown.style.display = 'none';
    dropdownListsSelect.style.display = 'none';
    selectCities.value = '';
  });
  dataBase.forEach((elem) => {
    dropdownListsCol.innerHTML += countryBlock(elem);
    let countCityItem = 0;
    elem.cities.forEach((city) => {
      if (countCityItem >= 3) return;
      dropdownListsCol.innerHTML += cityBlock(city);
      countCityItem++;
    });
  });
};

const renderSelect = (selectedCountry) => {
  const select = dropdownListsSelect.querySelector('.dropdown-lists__col');
  select.textContent = '';

  dropdownListsDefault.style.display = 'none';
  dropdownListsComplete.style.display = 'none';
  dropdownListsSelect.style.display = 'block';

  const selectBase = dataBase.filter(
    (item) => item.country === selectedCountry
  );
  selectBase.forEach((country) => {
    select.innerHTML += countrySelectBlock(country);
    country.cities.forEach((city) => {
      select.innerHTML += cityBlock(city);
    });
  });
};

const renderComplete = (target) => {
  const dropdownListsCol = dropdownListsComplete.querySelector(
    '.dropdown-lists__col'
  );

  dropdownListsCol.textContent = '';

  dropdownListsDefault.style.display = 'none';
  dropdownListsSelect.style.display = 'none';
  dropdownListsComplete.style.display = 'block';

  const search = new RegExp(target.toLocaleLowerCase());
  let result = [];
  dataBase.forEach((country) => {
    country.cities.forEach((city) => {
      if (search.test(String(city.name.toLocaleLowerCase()))) {
        result.push(city);
        dropdownListsCol.innerHTML += cityBlock(city);
      }
    });
  });
};

start();

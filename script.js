import API_KEY from './apiKey.js';

// format Date
const formatDate = (date) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Date(date).toLocaleDateString(undefined, options);
};

// format Section
const formatSection = (section) => {
  switch (section) {
    case 'us':
      return 'U.S.';
    case 'nyregion':
      return 'N.Y.';
    case 't-magazine':
      return 'magazine';
    case 'realestate':
      return 'real estate';
    default:
      return section;
  }
};

// Show section title
function showSection(section) {
  const sectionTitle = section === 'home' ? '' : `<p class="fw-bold pt-5 border-bottom fs-2">${formatSection(section)} News</p>`;
  return sectionTitle;
}

// show navbar section
const section = ['home', 'world', 'politics', 'nyregion', 'technology', 'opinion', 'science', 'arts', 'books', 'style', 'food', 'travel', 'magazine', 'movies'];

const sectionList = document.querySelector('.section-list');

function showSectionList() {
  section.forEach((m) => {
    sectionList.innerHTML += `<li class="list-group-item">
      <a class="text-decoration-none text-capitalize btn btn-light text-black" id="${m}">${formatSection(m)}</a>
    </li>`;
  });
}

showSectionList();

// show footer section
function showFooterList() {
  const footerSection = document.querySelector('.footer-column');

  section.forEach((m) => {
    footerSection.innerHTML += `<li class="list-group-item"> 
    <a class="text-decoration-none text-capitalize btn btn-light text-black" id="${m}" >${formatSection(m)}</a>
    </li>`;
  });

  // Add event listener to each footer link
  const footerLinks = document.querySelectorAll('.footer-column a');
  footerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    });
  });
}

showFooterList();

// Get News By Section
const navLink = document.querySelectorAll('.btn-light');

navLink.forEach((m) => {
  const sectionContainer = document.querySelector('.section-container');
  m.addEventListener('click', () => {
    const section = m.id;
    console.log('🚀 ~ file: script.js:16 ~ m.addEventListener ~ section:', section);
    getNewsBySection(section);
    showSection(section);
    sectionContainer.innerHTML = showSection(section);
  });
});

const loading = document.querySelector('.loading');
function showLoading() {
  loading.classList.remove('hide');
}
function hideLoading() {
  loading.classList.add('show');
}

// Home Section News
async function getHomeNews() {
  const response = await fetch(`https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${API_KEY}`);
  const homeNews = await response.json();
  let cards = '';
  homeNews.results.forEach((m) => (cards += showHomeNews(m)));
  container.innerHTML = cards;
}

async function getNewsBySection(section) {
  showLoading();
  try {
    const response = await fetch(`https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${API_KEY}`);
    if (!response.ok) {
      const message = 'Something went wrong';
      container.innerHTML = message;
      throw new Error('Something went wrong');
    } else {
      const news = await response.json();
      let cards = '';
      news.results.forEach((m) => (cards += showHomeNews(m)));
      container.innerHTML = cards;
    }
  } catch (error) {
    console.log(error);
  } finally {
    hideLoading();
  }
}

getHomeNews();

// Search News
const searchButton = document.querySelector('.search-button');
const container = document.querySelector('.news-container');

searchButton.addEventListener('click', () => {
  showLoading();
  const sectionContainer = document.querySelector('.section-container');
  const inputKeyword = document.querySelector('.input-keyword').value;
  const search = searchNews(inputKeyword);
  sectionContainer.innerHTML = `<div class="pt-2">Showing results for:</div>
    <div class="fw-bold fs-3 text-capitalize border-bottom pb-2">${inputKeyword}</div>`;
  showSearchNews(search);
});

async function searchNews(keyword) {
  const response = await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${keyword}&api-key=${API_KEY}`);
  const searchList = await response.json();
  let cards = '';
  searchList.response.docs.forEach((m) => (cards += showSearchNews(m)));
  container.innerHTML = cards;
  hideLoading();
}

// button search toggle
const searchToggle = document.querySelector('.button-toggle');
console.log('🚀 ~ file: script.js:155 ~ searchToggle:', searchToggle);
searchToggle.addEventListener('click', () => {
  const searchContainer = document.querySelector('.search-container');
  searchContainer.classList.toggle('active');
});

// Get Date
const dateContainer = document.querySelector('.current-date');

const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
};
const currentDate = new Date().toLocaleDateString('en-US', options);
dateContainer.innerHTML = currentDate;

// Show Home Section News
function showHomeNews(news) {
  return `
  ${
    news.title && news.multimedia && news.abstract && news.byline && news.section
      ? ` 
      <div class="news pb-4 border-bottom">
          <div class="main-content">
            <div class="d-flex flex-row justify-content-between">
              <div class="section bg-dark-subtle p-2">${formatSection(news.section)}</div>
              <div class="date text-black-50 p-2">${formatDate(news.published_date)}</div>
            </div>
            <div class="desc-image">
              <div class="description">
                <div class="title fw-bold">
                  <a class="text-decoration-none text-black" href="${news.url}">${news.title}</a>
                </div>
                <div class="byline text-black-50"><p class="p-0 m-0">${news.byline}</p> </div>
                <div class="abstract">
                  <p>${news.abstract}</p>
                </div>
              </div>
              <div class="image">
                <img src="${news.multimedia[1].url}" class="img-fluid" alt="" loading="lazy"/>
              </div>
              <div class="abstract-mobile">
                <p>${news.abstract}</p>
              </div>
            </div>
          </div>
        </div>`
      : ''
  }`;
}

// Show search news
function showSearchNews(search) {
  return `
  <div class="search-news d-block w-100 border-bottom">
    <div class="search-content">
      <div class="d-flex flex-row justify-content-between">
        <div class="search-section bg-dark-subtle p-2">${formatSection(search.section_name)}</div>
        <div class="search-text text-black-50 p-2">${formatDate(search.pub_date)}</div>
      </div>
        <div class="description-search">
          <div class="search-title fw-bold">
            <a class="text-decoration-none text-black fs-3" href="${search.web_url}">${search.headline.main}</a>
          </div>
          <div class="search-byline text-black-50"><p class="p-0 m-0">${search.byline ? search.byline.original : ''}</p></div>
          <div class="search-abstract">
            <p>${search.abstract}</p>
          </div>
      </div>
    </div>
  </div>`;
}

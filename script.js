import API_KEY from './apiKey.js';

const searchButton = document.querySelector('.search-button');
const container = document.querySelector('.news-container');
const loading = document.querySelector('.loading');
console.log(loading);

searchButton.addEventListener('click', () => {
  const inputKeyword = document.querySelector('.input-keyword').value;
  const search = searchNews(inputKeyword);
  showSearchNews(search);
  console.log(inputKeyword);
  console.log(searchButton);
});

const navLink = document.querySelectorAll('.btn-light');
navLink.forEach((m) => {
  m.addEventListener('click', () => {
    const section = m.id;
    getNewsBySection(section);
  });
});
// Home Section News
async function getHomeNews() {
  const response = await fetch(`https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${API_KEY}`);
  const homeNews = await response.json();
  let cards = '';
  homeNews.results.forEach((m) => (cards += showHomeNews(m)));
  container.innerHTML = cards;
  console.log(homeNews.results);
}

async function getNewsBySection(section) {
  loading.style.display = 'block';
  console.log('🚀 ~ file: script.js:35 ~ getNewsBySection ~ loading:', loading);
  try {
    const response = await fetch(`https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${API_KEY}`);
    if (!response.ok) {
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
    loading.style.display = 'none';
  }
}

getHomeNews();

// Search News
async function searchNews(keyword) {
  const response = await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${keyword}&api-key=${API_KEY}`);
  const searchList = await response.json();
  let cards = '';
  searchList.response.docs.forEach((m) => (cards += showSearchNews(m)));
  container.innerHTML = cards;
}

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

// Show Home Section News
function showHomeNews(news) {
  return `
  ${
    news.title && news.multimedia && news.abstract && news.byline && news.section
      ? ` <div class="news pb-4 border-bottom">
  <div class="main-content">
    <div class="d-flex flex-row justify-content-between">
      <div class="section bg-dark-subtle p-2">${formatSection(news.section)}</div>
      <div class="date text-black-50 p-2">${formatDate(news.published_date)}</div>
    </div>
    <div class="desc-image">
      <div class="description">
        <div class="title  fw-bold">
          <a class="text-decoration-none text-black" href="${news.url}">${news.title}</a>
        </div>
        <div class="byline text-black-50"><p class="p-0 m-0">${news.byline}</p> </div>
        <div class="abstract">
          <p>${news.abstract}</p>
        </div>
      </div>
      <div class="image">
        <img src="${news.multimedia[1].url}" class="img-fluid" alt="" />
      </div>
      <div class="abstract-mobile">
         <p>${news.abstract}</p>
      </div>
    </div>
  </div>
</div>`
      : ''
  }
  
  `;
}

// Show search news
function showSearchNews(search) {
  return `
    <div class="col-xl-4">
        <div class="card p-4 mb-5">
            <div class="card-body">
                <h5 class="card-title">${search.headline.main}</h5>
                <p class="card-text">
                ${
                  search.pub_date
                    ? new Date(search.pub_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : ''
                }</p>
                <p class="card-text">${search.byline.original ? search.byline.original : ''}</p>
                <div class="badge bg-primary d-block mb-2" style="width: 40%;">${search.news_desk ? search.news_desk : 'none'}</div>
                <a href="${search.web_url}" class="btn btn-primary">Read More</a>
            </div>
        </div>
    </div>`;
}
// ${search.keywords
//   .slice(0, 5)
//   .map((m) => `<span class="badge bg-primary">${m.value}</span>`)
//   .join('')}

import API_KEY from './apiKey.js';

const searchButton = document.querySelector('.search-button');
const container = document.querySelector('.news-container');

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

searchButton.addEventListener('click', () => {
  const inputKeyword = document.querySelector('.input-keyword ').value;
  const search = searchNews(inputKeyword);
  showSearchNews(search);
  console.log(inputKeyword);
  console.log(searchButton);
});

// Most Popular News
async function homeSection() {
  const response = await fetch(`https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${API_KEY}`);
  const homeNews = await response.json();
  let cards = '';
  homeNews.results.forEach((m) => (cards += showHomeNews(m)));

  container.innerHTML = cards;
  console.log(homeNews.results);
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

const formatDate = (date) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Date(date).toLocaleDateString(undefined, options);
};

// search news
async function searchNews(keyword) {
  const response = await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${keyword}&api-key=${API_KEY}`);
  const searchList = await response.json();
  let cards = '';
  searchList.response.docs.forEach((m) => (cards += showSearchNews(m)));
  container.innerHTML = cards;
  console.log(searchList.response.docs);
}

homeSection();

// Show Most Popular News
function showHomeNews(home) {
  return `
  <div class="news pb-4 border-bottom">
    <div class="main-content">
      <div class="d-flex flex-row justify-content-between">
        <div class="section bg-dark-subtle p-2">${formatSection(home.section)}</div>
        <div class="date text-black-50 p-2">${formatDate(home.published_date)}</div>
      </div>
      <div class="desc-image">
        <div class="description">
          <div class="title">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, tenetur.</div>
          <div class="byline">Lorem ipsum dolor sit.</div>
          <div class="abstract">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut expedita rerum distinctio et blanditiis perspiciatis, mollitia quas fuga sequi odio exercitationem, qui nisi veniam incidunt rem delectus iste, eos quasi.
          </div>
        </div>
        <div class="image">
          <img src="https://placeholder.pics/svg/500x300" alt="" />
        </div>
        <div class="abstract-mobile">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut expedita rerum distinctio et blanditiis perspiciatis, mollitia quas fuga sequi odio exercitationem, qui nisi veniam incidunt rem delectus iste, eos quasi.
          </div>
      </div>
    </div>
  </div>
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

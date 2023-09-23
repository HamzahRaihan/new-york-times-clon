const searchButton = document.querySelector('.search-button');
const container = document.querySelector('.news-container');

searchButton.addEventListener('click', () => {
  const inputKeyword = document.querySelector('.input-keyword ').value;
  const search = searchNews(inputKeyword);
  showSearchNews(search);
  console.log(inputKeyword);
  console.log(searchButton);
});

const API_KEY = 'MDX5HeGIeE4rBuEBpSq1xAakAJvZkZw3';

// Most Popular News
async function popularNews() {
  const response = await fetch(`https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=${API_KEY}`);
  const popularList = await response.json();
  const popularListLimited = popularList.results.slice(0, 5);
  let cards = '';
  popularListLimited.forEach((m) => (cards += showPopularNews(m)));
  console.log(popularList.results);
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

// search news
async function searchNews(keyword) {
  const response = await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${keyword}&api-key=${API_KEY}`);
  const searchList = await response.json();
  let cards = '';
  searchList.response.docs.forEach((m) => (cards += showSearchNews(m)));
  container.innerHTML = cards;
  console.log(searchList.response.docs);
}

popularNews();

// Show Most Popular News
function showPopularNews(popular) {
  return `
    <div class="col-xl-4">
        <div class="card p-4 mb-5">
            <img src=" 
            ${popular.media.length > 0 ? popular.media[0]['media-metadata'][2].url : 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg'}" class="img-fluid" alt="" loading="lazy">

            <div class="card-body">
                <h5 class="card-title">${popular.title}</h5>
                <p class="card-text">${popular.abstract}</p>
                <a href="${popular.url}" class="btn btn-primary">Read More</a>
            </div>
        </div>
    </div>`;
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

import './css/styles.css';

const BASE_URL = 'http://localhost:3000';

function reqServer(url) {
  return fetch(BASE_URL + url).then(res => res.json());
}

// reqServer('/posts').then(console.log);

const refs = {
  listNode: document.querySelector('.post-list'),
};

function renderPostList() {
  reqServer('/posts').then(res => {
    const markUp = res
      .map(
        post => 
        `<li data-id="${post.id}">
        <h3>${post.title}</h3>
         <p> ${post.text} </p>
        <small>${post.author}</small>
        </li>
        `,
      )
      .join('');
    refs.listNode.innerHTML = markUp;
  });
}
renderPostList();

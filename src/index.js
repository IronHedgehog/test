import './styles/styles.scss';

const BASE_URL = 'http://localhost:3000';

function reqServer(url, method = 'GET', data = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  };

  if (method !== 'GET' && method !== 'delete') {
    options.body = JSON.stringify(data);
  }

  return fetch(BASE_URL + url, options).then(res => res.json());
}

// reqServer('/posts').then(console.log);

const refs = {
  listNode: document.querySelector('.post-list'),
  form: document.querySelector('#create-post'),
};

function renderPostList() {
  reqServer('/posts').then(res => {
    const markUp = res
      .map(
        post =>
          `<li data-id="${post.id}">
        <h3>${post.title}</h3>
         <p> ${post.text} </p>
        <small><button>edit</button> ${post.author}</small>
        </li>
        `,
      )
      .join('');
    refs.listNode.innerHTML = markUp;
  });
}

renderPostList();

refs.form.addEventListener('keydown', e => {
  if (e.code === 'Enter' && e.shiftKey) {
    const data = {
      text: refs.form.elements.text.value,
      author: refs.form.elements.author.value,
      title: refs.form.elements.title.value,
    };
    reqServer('/posts', 'POST', data).then(data => {
      refs.form.reset();
      renderPostList();
    });
  }
});

refs.listNode.addEventListener('click', editPost);

function editPost(e) {
  if (e.target.nodeName !== 'BUTTON') return;
  const ID = e.target.closest('li').dataset.id;
  reqServer('/posts/' + ID).then(data => {
    refs.form.elements.text.value = data.text;
    refs.form.elements.author.value = data.author;
    refs.form.elements.title.value = data.title;
    refs.form.elements.id.value = data.id;
  });
}

refs.form.addEventListener('keydown', e => {
  if (e.code == 'Enter' && e.shiftKey) {
    const data = {
      text: refs.form.elements.text.value,
      author: refs.form.elements.author.value,
      title: refs.form.elements.title.value,
    };

    const updateForm = data => {
      refs.form.reset();
      refs.form.elements.id.value = '';
      renderPostList();
    };

    console.log(data);

    const id = refs.form.elements.id.value;
    if (id === '') {
      reqServer('/posts', 'POST', data).then(updateForm);
    } else {
      reqServer(`/posts/${id}`, 'PATCH', data).then(updateForm);
    }
  }
});
// function createPost(data) {
//   const options = {
//     method: 'POST',
//     body: JSON.stringify(data),
//     headers: {
//       'Content-Type': 'application/json; charset=UTF-8',
//     },
//   };
//   fetch(`${BASE_URL}/posts`, options);
// }

// function deletePost(PostId) {
//   const options = {
//     method: 'DELETE',
//   };
//   fetch(`${BASE_URL}/posts/${PostId}`, options);
// }

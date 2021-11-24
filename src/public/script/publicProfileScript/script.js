const connectForm = document.querySelector('.connect-form');
const id = connectForm.action.split('/')[5];
const $container = document.getElementById("post-container");

fetch(`/post/user`, {
  method: "post",
  headers: {
    "Content-type": "application/json",
  },
  body: JSON.stringify({id}),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data.posts.content);
    data.posts.forEach((post) => {
      const postData = `<div class="col portfolio-item">
      <div class="card portfolio-wrap profile-post">
          <div class="card-image">
              <figure class="image is-4by3">
                      <img src="${post.image}" class="img-fluid" alt="user post">
              </figure>
          </div>
          <div class="portfolio-links">
              <a><i class="fas fa-heart"></i></a>
              <a><i class="fas fa-comment"></i></a>
          </div>
      </div>
  </div>`;
      $container.insertAdjacentHTML("beforeend", postData);
    });
  });


  // <a href="${post.image}" data-gall="portfolioGallery" class="venobox"
  //                     title="${post.content}"></a>
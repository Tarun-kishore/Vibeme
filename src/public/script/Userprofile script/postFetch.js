const $container = document.getElementById("post-container");
fetch(`/post/my`, {
  method: "post",
  headers: {
    "Content-type": "application/json",
  },
  body: JSON.stringify({}),
})
  .then((response) => response.json())
  .then((data) => {
    data.posts.forEach((post) => {
      const postData = `<div class="col portfolio-item">
              <div class="card portfolio-wrap profile-post">
                <div class="card-image">
                  <figure class="image is-4by3">
                      <img
                        src="${post.image}"
                        class="img-fluid"
                        alt="user post"
                      />
                  </figure>
                </div>
                <div class="portfolio-links">
                  <a><i class="fas fa-heart"></i></a>
                  <a href='/post/view/${post.id}'><i class="fas fa-comment"></i></a>
                </div>
              </div>`;
      $container.insertAdjacentHTML("beforeend", postData);
    });
  });

//   const postData = `<div class="col portfolio-item filter-app">
//               <div class="card portfolio-wrap profile-post">
//                 <div class="card-image">
//                   <figure class="image is-4by3">
//                     <a
//                       href="${post.image}"
//                       data-gall="portfolioGallery"
//                       class="venobox"
//                       title="${post.content}"
//                     >
//                       <img
//                         src="${post.image}"
//                         class="img-fluid"
//                         alt="user post"
//                       />
//                     </a>
//                   </figure>
//                 </div>
//                 <div class="portfolio-links">
//                   <a><i class="fas fa-heart"></i></a>
//                   <a><i class="fas fa-comment"></i></a>
//                 </div>
//               </div>`;

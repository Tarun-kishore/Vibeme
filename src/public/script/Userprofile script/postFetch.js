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
    console.log(data.posts.content);
    data.posts.forEach((post) => {
      const postData = `<div class="col portfolio-item filter-app">
              <div class="card portfolio-wrap profile-post">
                <div class="card-image">
                  <figure class="image is-4by3">
                    <a
                      href="${post.image}"
                      data-gall="portfolioGallery"
                      class="venobox"
                      title="${post.content}"
                    >
                      <img
                        src="${post.image}"
                        class="img-fluid"
                        alt="user post"
                      />
                    </a>
                  </figure>
                </div>
                <div class="portfolio-links">
                  <a><i class="fas fa-heart"></i></a>
                  <a><i class="fas fa-comment"></i></a>
                </div>
              </div>`;
      // console.log(postData);

      $container.insertAdjacentHTML("beforeend", postData);
      reloadJs('/css/vendor userbase/owl.carousel/owl.carousel.min.js');
      reloadJs('/css/vendor userbase/aos/aos.js');
      reloadJs('/css/vendor userbase/venobox/venobox.min.js');
      reloadJs('/css/vendor userbase/isotope-layout/isotope.pkgd.min.js');
      reloadJs('/css/vendor userbase/waypoints/jquery.waypoints.min.js');

    });
  });


Vue.component('navbar', {
  /*html*/
  template: `
      <nav class="card-panel  nav-extended" style="padding: 0; margin-top: 0; margin-bottom: 0;">

        <!-- TITEL - LOGO -->
        <div class="nav-wrapper">
          <a href="index.html">
            <img src="../resources/logoSVG.png" class="logo" title="Kübelliste Logo" alt="Logo: To-Do List in Bucket">
          </a>

          <!-- SIGN UP - LOGIN -->
          <ul class="right hide-on-med-and-down" style="padding-top: 10px; padding-right: 25px;">
            <li class="highlight"><a class="waves-effect waves-light btn cyan darken-3" href="register.html">Sign up</a>
            </li>
            <li class="highlight"><a class="waves-effect waves-light btn cyan darken-3" href="login.html">Login</a></li>
          </ul>
          <div class="clear"></div>
        </div>

        <!-- MENU SECTIONS -->
        <div class="nav-content" style="border-top: 1px solid black; border-bottom: 1px solid black; padding-left: 40px; padding-right: 40px;" role="navigation">
          <ul class="tabs tabs-transparent navSections" style="height: 38px;">
            <li class="tab section"><a class="btn cyan darken-3 secHeader"
                href="#test1">Anime</a></li>
            <li class="tab section"><a class="btn cyan darken-3 secHeader"
                 href="#test2">Manga</a></li>
            <li class="tab section"><a class="btn cyan darken-3 secHeader"
                 href="#test3">Restaurants</a>
            </li>
            <li class="tab section"><a class="btn cyan darken-3 secHeader"
                href="#test4">ESO Dungeons</a>
            </li>
            <li class="search hide-on-med-and-down">
              <button type="submit">
                <i class="material-icons left center searchIcon valign-wrapper">search</i>
              </button>
              <form role ="search" action="/" method="get" class="searchHeader">
                <label for="search">
                  <input type="text" id="search" placeholder="Search Anime, Manga, and more ...">
                </label>
            </li>
          </ul>
        </div>
      </nav>`
});

Vue.component('kuebelfooter', {
  /*html*/
  template: `
  <footer class="page-footer cyan darken-3 noPadding">
    <div class="container" style="width: 50vw; height: 50px;">
      <div class="row center" style="margin-bottom:0px; height: 0px; padding-top: 15px;">
        <div class="col s12 m6 l3 noPadding hover">Home</div>
        <div class="col s12 m6 l3 noPadding hover">About</div>
        <div class="col s12 m6 l3 noPadding hover">FAQ</div>
        <div class="col s12 m6 l3 noPadding hover">Cookie</div>
        <div class="col s12 m6 l3 noPadding hover">Sign up</div>
        <div class="col s12 m6 l3 noPadding hover">Login</div>
        <!-- This content will be:
          9-columns-wide on large screens,
          8-columns-wide on medium screens,
          12-columns-wide on small screens  -->
      </div>
    </div>
    <div class="footer-copyright noPadding" style="height: 40px">
      <div class="container center" style="height: 40px; padding-top: 10px;">
        © 2024 Kübelliste
      </div>
    </div>
  </footer>`
});
Vue.component('navbar', {
  /*html*/
  template: `
      <nav class="card-panel  nav-extended" style="padding: 0; margin-top: 0; margin-bottom: 0;">

        <!-- TITEL - LOGO -->
        <div class="nav-wrapper">
          <a href="index.html">
            <img src="resources/logoSVG.png" class="logo" title="Kübelliste Logo" alt="Logo: To-Do List in Bucket">
          </a>

          <!-- SIGN UP - LOGIN -->
          <ul v-if="!hasAccessToken()" class="right hide-on-med-and-down" style="padding-top: 10px; margin-right: 1.5%;">
            <li class="highlight"><a class="waves-effect waves-light btn cyan darken-3" href="register.html">Sign up</a>
            </li>
            <li class="highlight"><a class="waves-effect waves-light btn cyan darken-3" href="login.html" style="margin-right: 0;">Log in</a></li>
          </ul>
          
          <div v-else>
            <ul class="right hide-on-med-and-down" style="padding-top: 10px; margin-right: 1.5%;">
            <li><i class="material-icons right hide-on-med-and-down" 
            style="padding-top: 10px; margin-right: 2.5%; color: grey; font-size: 36px;">account_circle</i></li>
            <li class="highlight"><a class="waves-effect waves-light btn cyan darken-3" v-on:click=deleteAllCookies() href="index.html" style="margin-right: 0;">Log out</a></li>
          </ul>
            </div>
          <div class="clear"></div>
        </div>

        <!-- MENU SECTIONS -->
        <div class="nav-content" style="border-top: 1px solid black; border-bottom: 1px solid black; padding-left: 1.5%; padding-right: 1.5%;" role="navigation">
          <ul class="tabs tabs-transparent navSections" style="height: 38px;">
            <li class="tab section"><a class="btn cyan darken-3 secHeader"
                href="https://myanimelist.net/topanime.php" title="MyAnimeList Top Animes" target="_blank">Anime</a></li>
            <li class="tab section"><a class="btn cyan darken-3 secHeader"
                 href="https://myanimelist.net/topmanga.php" title="MyAnimeList Top Mangas" target="_blank">Manga</a></li>
            <li class="tab section"><a class="btn cyan darken-3 secHeader"
                href="https://elderscrollsonline.wiki.fextralife.com/Dungeons" title="The Elder Scrolls Online Wiki Dungeons" target="_blank">ESO Dungeons</a>
            </li>
            <li class="tab section"><a class="btn cyan darken-3 secHeader"
                 href="index.html">My Lists</a>
            </li>
            <li class="search hide-on-med-and-down">
              <button type="submit">
                <i class="material-icons left center searchIcon valign-wrapper">search</i>
              </button>
              <form role ="search" action="/" method="get" class="searchHeader">
                <label for="search">
                  <input type="text" id="search" placeholder="Search Anime, Manga, and more ..." :inputText="inputText" @input="updateValue($event.target.value)">
                </label>
              </form>
            </li>
          </ul>
        </div>
      </nav>`,
  props: ['inputText'],
  methods: {
    hasAccessToken() {
      // Get the value of the accessToken cookie
      let value = "; " + document.cookie;
      let parts = value.split("; accessToken=");
      if (parts.length === 2) {
        let accessToken = parts.pop().split(";").shift();
        return accessToken !== "";
      }
      return false;
    },
    deleteAllCookies() {
      const cookies = document.cookie.split(";");
  
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
  
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
  }
  ,
    updateValue(newValue) {
      this.$emit('input', newValue);
    }
  }

});

Vue.component('kuebelfooter', {
  /*html*/
  template: `
  <footer class="page-footer cyan darken-3 noPadding">
    <div class="container" style="width: 50vw; height: 50px;">
      <div class="row center" style="margin-bottom:0px; height: 0px; padding-top: 15px;">
        <div class="col s12 m6 l3 noPadding"><a href="index.html">Home</a></div>
        <div class="col s12 m6 l3 noPadding"><a href="#">About</a></div>
        <div class="col s12 m6 l3 noPadding"><a href="#">FAQ</a></div>
        <div class="col s12 m6 l3 noPadding"><a href="#">Cookie</a></div>
        <div class="col s12 m6 l3 noPadding"><a href="register.html">Sign up</a></div>
        <div class="col s12 m6 l3 noPadding"><a href="login.html">Log in</a></div>
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
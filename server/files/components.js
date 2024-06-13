Vue.component('list-card', {
  props: ['name', 'imgsrc'],
  template: `<a href="listview.html">
                  <div class="card hoverable" style="width: 170px; height: 220px;">
                    <div class="card-image">
                      <img :src=imgsrc style="width:170px; height:150px;">
                    </div>
                    <div class="card-content">
                      <span class="card-title center"
                        style="font-size: 18.5px !important; color: black !important;"><b>{{ name }}</b></span>
                    </div>
                  </div>
                </a>`
});
window.onload = function () {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    /*const bodyElement = document.querySelector("body");
    if (xhr.status == 200) {

    } else {
      bodyElement.append(
        "Daten konnten nicht geladen werden, Status " +
        xhr.status +
        " - " +
        xhr.statusText
      );
    }
    */
  };
  xhr.open("GET", "/movies");
  xhr.send();
};

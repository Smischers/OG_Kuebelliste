function createList(lists) {
    var listContainer = document.getElementById('listContainer');

    listContainer.innerHTML = '';

    lists.forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item.name;

        // Creating a delete button for each <li> element
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function () {
            deleteItem(item.name);
        };

        // Appending the delete button to the <li>
        li.appendChild(deleteButton);

        // Appending the <li> to the <ul> container
        listContainer.appendChild(li);
    });
}
function getData() {
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "http://localhost:3000/list", true);

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                var lists = JSON.parse(this.responseText);

                createList(lists);
            } catch (e) {
                console.error("Error parsing JSON!", e);
            }
        }
    };

    xhttp.send();
}

function login() {
    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", "http://localhost:3000/login", true);
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                var response = JSON.parse(this.responseText);
                var token = response.accessToken;

                document.cookie = "accessToken=" + token + "; path=/";
                getData();
            } catch (e) {
                console.error("Error parsing JSON or setting cookie!", e);
            }
        }
    };

    var body = JSON.stringify({
        uname: "test",
        psw: "123"
    });

    xhttp.send(body);
}

function addToList() {
    var inputField = document.getElementById('nameInput');
    var name = inputField.value;

    // Check if the input is not empty
    if (name.trim() !== "") {
        fetch("http://localhost:3000/list", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                picture: "",
                weather: "clear"
            })
        })
            .then(data => {
                getData();
            })
            .catch(error => console.error('Fetch error:', error));
    } else {
        console.error('Input is empty');
    }
}

function deleteItem(name) {
    fetch(`http://localhost:3000/list/${name}`, {
        method: 'DELETE'
    })
    .then(response => {
        console.log('Item deleted:', name);
        getData();
    })
    .catch(error => console.error('Fetch error:', error));
}

login();

get_LIST = { everything }

get_ListIcons = [{ listName1: "name", pic1: "pic" }, { listName2: "name", pic2: "pic" }]

get_ListByName = [{ Category1: [entrys] }, { Category2: [entrys] }]

get_ListDetails = { image: "picLink", weather: "Sunny", categorys: ["name1", "name2"] }

get_Entry = { name: "Entry Name", rating: "10 / 10", description: "Descripton", deadline: "30.03.2024", calendar: "yes", wheater: "sunny" }


post_List = [{ name: "List Name", picture: "A Link", weather: "Sunny" }]

post_Category = [{ name: "Category Name" }]

post_Entry = [{ name: "Entry Name", rating: "10 / 10", description: "Descripton", deadline: "30.03.2024", calendar: "yes" }]


put_List = [{ name: "New List Name", picture: "New Pic", weather: "Sunny" }]

put_Category = [{ name: "New Category Name" }]

put_Entry = [{ name: "New entry name1", rating: "10 / 10", description: "Descripton", deadline: "30.03.2024", calendar: "yes", }]

put_ChangeCategory={newCat:"New Category name"}
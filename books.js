

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}


function Book( title , author, pages, read) {

    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;

    this.info = function() {
        let string;
        if (read) {
            string = 'has been read.';
        }
        else {
            string = 'not yet read';
        }
        return `The ${title } is by ${author} and it has ${pages} pages, ${string}`;
    }
}

function addBookToLibrary( book) {
    myLibrary.push(book);

    if (storageAvailable('localStorage')) {
        localStorage.setItem( 'storedLibrary', JSON.stringify(myLibrary) );
    }
}

function displayBooks() {
    
    while (library.firstChild) {
        library.removeChild(library.firstChild);
    }
    let index = 0;
    for (const book of myLibrary) {
        //console.log(book);
        

        let newBook = document.createElement("div");
        newBook.classList.add("book");
        let title = document.createElement("p");
        let author = document.createElement("p");
        let pages = document.createElement("p");
        let read = document.createElement("button");
        let removeButton = document.createElement("button");

        title.innerHTML = book.title;
        author.innerHTML = "By "+book.author;
        pages.innerHTML =  book.pages + " pages";
        read.innerHTML = (book.read ? "Read" : "Unread");
        removeButton.innerHTML = "Remove";

        read.classList.add("readButton");
        removeButton.classList.add("removeButton");

        read.addEventListener("click", toggleRead);
        removeButton.addEventListener("click", removeBook);

        removeButton.id = index;

        
        read.style.backgroundColor = "rgb(200, 204, 197)";
        

        newBook.appendChild(title);
        newBook.appendChild(author);
        newBook.appendChild(pages);
        newBook.appendChild(read);
        newBook.appendChild(removeButton);

        library.appendChild(newBook);

        index++;
    }
}

function submitForm(e) {
    let authorInput = document.querySelector("#myAuthor").value;
    let titleInput = document.querySelector("#myTitle").value;
    let pagesInput = document.querySelector("#myPages").value;
    let readInput = document.querySelector("#myRead").isChecked;

    if (pagesInput<0){
        pagesInput*=-1;
    }

    if( authorInput != "" && titleInput!="" && pagesInput !="") {
        let newBook = new Book(titleInput,authorInput,Math.round(pagesInput),readInput);
        addBookToLibrary(newBook);
        displayBooks();
        modal.style.display = "none";
        //console.log(myLibrary);
    }

}

function toggleRead(e) {
    console.log(64);
    if (e.target.innerHTML == "Read") {
        e.target.innerHTML = "Unread";
    }
    else {
        e.target.innerHTML = "Read";
    }
}

function removeBook(e){
    myLibrary.splice( e.target.id, 1);
    localStorage.setItem("storedLibrary", JSON.stringify(myLibrary));
    displayBooks();
}

let myLibrary  = [new Book("The Hobbit","JR Tolkien",304,true)];

if (storageAvailable('localStorage')) {
    if (!localStorage.getItem('storedLibrary')) {
        localStorage.setItem('storedLibrary', JSON.stringify(myLibrary));
    }
    else {
        myLibrary = JSON.parse(localStorage.getItem("storedLibrary"));

    }
}


let library = document.querySelector(".library");
displayBooks();


let modal = document.querySelector(".modal");
let closeButton = document.querySelector(".close");
let openButton = document.querySelector(".add")

openButton.onclick = function() {
    modal.style.display = "block";
    document.querySelector("#myAuthor").value = "";
    document.querySelector("#myTitle").value = "";
    document.querySelector("#myPages").value = "";
    document.querySelector("#myRead").checked = false;
    
}

closeButton.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

let submit = document.querySelector(".form-submit");
submit.addEventListener("click", submitForm);











const bookForm = document.getElementById('bookForm');
const formSearch = document.getElementById('searchBook');
const focusInput = document.getElementsByClassName('focusInput');
const isComplete = document.getElementById('bookFormIsComplete');
const showIsread = document.getElementById('showIsread');
const showIsunread = document.getElementById('showIsunread');
const showAddBook = document.getElementById('showAddBook');
const closeFormAdd = document.getElementById('closeFormAdd');


showAddBook.onclick = function(){
    const element = document.getElementById('addNewBook');
    element.style.display = 'flex';
    element.style.position = 'absolute';
    element.style.zIndex = '10';
    element.style.width = '100%';
}
closeFormAdd.onclick = function(){
    const element = document.getElementById('addNewBook');
    element.style.display = 'none';
}
showIsread.onclick = function(){
    showHide('isRead', 'isUnread');
}
showIsunread.onclick = function(){
    showHide('isUnread', 'isRead');
}
isComplete.onclick = function(){
    const btnSubmit = document.getElementById('bookFormSubmit');
    if (this.checked){
        btnSubmit.innerHTML = 'Masukkan Buku ke rak <span>selesai dibaca</span>';
    } else {
        btnSubmit.innerHTML = 'Masukkan Buku ke rak <span>Belum selesai dibaca</span>';
    }
}
const storageKey ='BOOKSHELF_APP';
bookForm.addEventListener('submit', function(event){
    event.preventDefault();
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = Number(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;
    
    const book = {
        id: +new Date(),
        title: title,
        author: author,
        year: year,
        isComplete: isComplete,
    };
    addBook(book);
    bookForm.reset();
})
formSearch.addEventListener('submit', function(event){
    event.preventDefault();
    const searchBookTitle = document.getElementById('searchBookTitle');
    
    const result = searchBook(searchBookTitle.value);
    const coverBook = document.getElementsByClassName('book-item');
    for (const book of coverBook){
        book.style.display = 'none';
    }
    result.forEach(listBook => {
        let book = document.querySelector(`[data-bookid="${listBook.id}"]`);
        book.style.display = 'flex';
    })
})
function checkStorage() {
    if (typeof(Storage) === 'undefined') {
        alert('Browser tidak mendukung localStorage');
        return false;
    }
    return true;
}
function addBook(book){
    if (!checkStorage()) return;

    const books = JSON.parse(localStorage.getItem(storageKey)) || [];
    books.push(book);

    localStorage.setItem(storageKey, JSON.stringify(books));
    renderBookList()
}
function editBook(bookId, updateBook){
    const books = getBookList();
    const index = books.findIndex(book => book.id === bookId);

    books[index] = { ...books[index], ...updateBook };
    localStorage.setItem(storageKey, JSON.stringify(books));

    renderBookList();
}
function deleteBook(bookId){
    const books = getBookList();
    const filteredBooks = books.filter(book => book.id !== bookId);
    
    localStorage.setItem(storageKey, JSON.stringify(filteredBooks));
    renderBookList();
}
function renderBookList(){
    const bookData = getBookList();
    const boxIncompleteList = document.getElementById('incompleteBookList');
    const boxcompleteList = document.getElementById('completeBookList');
    boxIncompleteList.innerHTML = '';
    boxcompleteList.innerHTML = '';
    for (let book of bookData){
        if (book.isComplete){
            boxcompleteList.innerHTML += bookTemplate(book, false);
        } else {
            boxIncompleteList.innerHTML += bookTemplate(book, true);
        }
    }
}
function readUnread(bookId){
    const books = getBookList();
    const index = books.findIndex(book => book.id === bookId);

    books[index].isComplete = !books[index].isComplete;
    localStorage.setItem(storageKey, JSON.stringify(books));

    renderBookList();
}
function getBookList(){
    if (!checkStorage()) return [];

    return JSON.parse(localStorage.getItem(storageKey)) || [];
}
function bookTemplate(book, movingPlace){
    let btnInnerHTML = null;
    if (movingPlace){
        btnInnerHTML = `<i class="fa fa-check-circle-o" aria-hidden="true"></i> Selesai dibaca`;
    } else {
        btnInnerHTML = `<i class="fa fa-undo" aria-hidden="true"></i> Undo`;
    }
    return `<div data-bookid="${book.id}" data-testid="bookItem" class="book-item">
                <h3 data-testid="bookItemTitle">${book.title}</h3>
                <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
                <p data-testid="bookItemYear">Tahun: ${book.year}</p>
                <div class="btn-action">
                    <button data-testid="bookItemIsCompleteButton" onclick="readUnread(${book.id});">
                        ${btnInnerHTML}
                    </button>
                    <button onclick="alertBox('Delete', ${book.id});">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                        Hapus Buku
                    </button>
                    <button onclick="alertBox('Edit', ${book.id});">
                        <i class="fa fa-pencil-square" aria-hidden="true"></i>
                        Edit Buku
                    </button>
                </div>
            </div>`;
}
function searchBook(keyword){
    const books = getBookList();
    const lowerKeyword = keyword.toLowerCase();

    return books.filter(book => 
        book.title.toLowerCase().includes(lowerKeyword) ||
        book.author.toLowerCase().includes(lowerKeyword)
    );
}
for (const fInput of focusInput) {
    inputFocusAndBlur(fInput);
}
function inputFocusAndBlur(element) {
    const label = element.nextElementSibling;

    element.addEventListener('focus', () => {
        label.style.top = '-25px';
    });
    element.addEventListener('blur', () => {
        if (element.value.length === 0) {
            label.style.top = '15px';
        }
    });
}
function alertBox(method, id){
    const books = getBookList();
    const book = books.find(book => book.id === id);
    
    const boxAlert = document.getElementsByClassName('boxAlert')[0];
    const alertTitle = document.getElementById('alertTitle');
    
    const infoTitle = document.getElementById('infoTitle');
    const infoAuthor = document.getElementById('infoAuthor');
    const infoYear = document.getElementById('infoYear');

    infoTitle.value = book.title;
    infoAuthor.value = book.author;
    infoYear.value = book.year;

    const btnDelete = boxAlert.getElementsByTagName('button')[1];
    const btnUpdate = boxAlert.getElementsByTagName('button')[2];

    console.log(btnUpdate);

    btnDelete.style.display = 'block';
    btnUpdate.style.display = 'block';

    if (method === 'Edit'){
        infoTitle.removeAttribute('disabled');
        infoAuthor.removeAttribute('disabled');
        infoYear.removeAttribute('disabled');

        btnDelete.style.display = 'none';
        btnUpdate.onclick = function(){
            
            const updateData = {
                title: infoTitle.value,
                author: infoAuthor.value,
                year: infoYear.value,
            }
            editBook(id, updateData);
            boxAlert.style.display = 'none';
        }
    } else {
        infoTitle.setAttribute('disabled', 'disabled');
        infoAuthor.setAttribute('disabled', 'disabled');
        infoYear.setAttribute('disabled', 'disabled');
        
        btnUpdate.style.display = 'none';
        btnDelete.onclick = function(){
            deleteBook(id);
            boxAlert.style.display = 'none';
        }
    }
    
    const cancel = boxAlert.getElementsByTagName('button')[0];
    cancel.onclick = function(){
        boxAlert.style.display = 'none';
    }
    boxAlert.style.display = 'flex';
    alertTitle.innerText = method;
}
function showHide(show, hide){
    const elementOne = document.getElementById(show);
    const elementTwo = document.getElementById(hide);
    elementOne.style.display = 'flex';
    elementOne.style.width = '100%';
    elementTwo.style.display = 'none';
}
window.addEventListener('load', function(){
    if (!checkStorage()) return;
    renderBookList();
})
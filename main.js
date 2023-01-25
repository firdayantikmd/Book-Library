const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";
 
function isStorageExist() {
	if (typeof Storage === undefined) {
		alert("Browser Anda tidak mendukung local storage");
		return false;
	}
	return true;
}
 
function generateId() {
	return +new Date();
}
 
function generateBookObject(id, title, author, year, isComplete) {
	return {
		id,
		title,
		author,
		year,
		isComplete,
	};
}
 
function addBook() {
	const titleBook = document.getElementById("inputBookTitle").value;
	const authorBook = document.getElementById("inputBookAuthor").value;
	const yearBook = document.getElementById("inputBookYear").value;
  const checkBook = document.getElementById("inputBookIsComplete").checked;
 
	const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, checkBook);
  books.push(bookObject);
	
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}
 
function makeBook(bookObject) {
	const textTitle = document.createElement("h3");
	textTitle.innerText = bookObject.title;
 
	const textAuthor = document.createElement("p");
	textAuthor.innerText = "Penulis : " + bookObject.author;
 
	const textYear = document.createElement("p");
	textYear.innerText = "Tahun : " + bookObject.year;
 
	const textContainer = document.createElement("article");
	textContainer.classList.add("book_item");
	textContainer.setAttribute("id", `book-${bookObject.id}`);
 
	const actionButton = document.createElement("div");
	actionButton.classList.add("action");
	if (bookObject.isComplete) {
		const uncompletedButton = document.createElement("button");
		uncompletedButton.classList.add("green");
		uncompletedButton.innerText = "Belum Selesai Dibaca";
 
		uncompletedButton.addEventListener("click", function () {
			addBookToCompleted(bookObject.id);
		});
 
		const removeButton = document.createElement("button");
		removeButton.classList.add("red");
		removeButton.innerText = "Hapus Buku";
 
		removeButton.addEventListener("click", function () {
			removeBook(bookObject.id);
		});
 
		actionButton.append(uncompletedButton, removeButton);
		textContainer.append(textTitle, textAuthor, textYear, actionButton);
	} else {
		const completedButton = document.createElement("button");
		completedButton.classList.add("green");
		completedButton.innerText = "Selesai Dibaca";
 
		completedButton.addEventListener("click", function () {
			addBookToUncompleted(bookObject.id);
		});
 
		const removeButton = document.createElement("button");
		removeButton.classList.add("red");
		removeButton.innerText = "Hapus Buku";
 
		removeButton.addEventListener("click", function () {
			removeBook(bookObject.id);
		});
 
		actionButton.append(completedButton, removeButton);
		textContainer.append(textTitle, textAuthor, textYear, actionButton);
	}
 
	return textContainer;
}
 
function addBookToUncompleted(bookId) {
	const bookTarget = findBook(bookId);
 
	if (bookTarget == null) return;
 
	bookTarget.isComplete = true;
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}
 
function addBookToCompleted(bookId) {
	const bookTarget = findBook(bookId);
 
	if (bookTarget == null) return;
 
	bookTarget.isComplete = false;
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}
 
function findBook(bookId) {
	for (const book of books) {
		if (book.id === bookId) {
			return book;
		}
	}
	return null;
}
 
function removeBook(bookId) {
	const bookTarget = findBookIndex(bookId);
	let dialogConfirm = confirm("Apakah anda yakin untuk menghapus item ini?");
 
	if (bookTarget === -1) return;
 
	if (dialogConfirm) {
		books.splice(bookTarget, 1);
		document.dispatchEvent(new Event(RENDER_EVENT));
	}
 
	saveData();
}
 
function findBookIndex(bookId) {
	for (const index in books) {
		if (books[index].id === bookId) {
			return index;
		}
	}
 
	return -1;
}
 
function saveData() {
	if (isStorageExist()) {
		const parsed = JSON.stringify(books);
		localStorage.setItem(STORAGE_KEY, parsed);
		document.dispatchEvent(new Event(SAVED_EVENT));
	}
}
 
function loadDataFromStorage() {
	const serializedData = localStorage.getItem(STORAGE_KEY);
	let data = JSON.parse(serializedData);
 
	if (data !== null) {
		for (const book of data) {
			books.push(book);
		}
	}
 
	document.dispatchEvent(new Event(RENDER_EVENT));
}
 
function search() {
	let input = document.getElementById("searchBookTitle").value;
	let article = document.getElementsByClassName("book_item");
 
	for (let i = 0; i < article.length; i++) {
		const h3 = document.getElementsByTagName("h3");
		const terms = h3[i].textContent.toLowerCase().includes(input.toLowerCase());
		if (terms) {
			article[i].style.display = "";
		} else {
			article[i].style.display = "none";
		}
	}
}
document.addEventListener("DOMContentLoaded", function () {
	const submitForm = document.getElementById("inputBook");
	submitForm.addEventListener("submit", function () {
		event.preventDefault();
		addBook();
	});
 
	if (isStorageExist()) {
		loadDataFromStorage();
	}
 
	const searchButton = document.getElementById("searchBook");
	searchButton.addEventListener(
		"submit",
		function (e) {
			e.preventDefault();
			search();
		}
	);
});
 
document.addEventListener(RENDER_EVENT, function () {
	const uncompletedBookshelfList = document.getElementById("incompleteBookshelfList");
	uncompletedBookshelfList.innerHTML = "";
 
	const iscompleteBookshelfList = document.getElementById("completeBookshelfList");
	iscompleteBookshelfList.innerHTML = "";
 
	for (const book of books) {
		const bookElement = makeBook(book);
		if (!book.isComplete) {
			uncompletedBookshelfList.append(bookElement);
		} else {
			iscompleteBookshelfList.append(bookElement);
		}
	}
});
 
document.addEventListener(SAVED_EVENT, function () {
	console.log(localStorage.getItem(STORAGE_KEY));
});
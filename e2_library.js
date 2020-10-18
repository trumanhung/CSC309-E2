/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function () {

			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function (name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime() // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array
	const newBookName = document.querySelector("#newBookName").value;
	const newBookAuthor = document.querySelector("#newBookAuthor").value;
	const newBookGenre = document.querySelector("#newBookGenre").value;

	const newBook = new Book(newBookName, newBookAuthor, newBookGenre);
	libraryBooks.push(newBook);


	// Call addBookToLibraryTable properly to add book to the DOM
	addBookToLibraryTable(newBook);

}

// Changes book patron information, and calls 
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron
	const loanBookId = document.querySelector('#loanBookId').value;
	const loanCardNum = document.querySelector('#loanCardNum').value;

	const loanBook = libraryBooks[loanBookId];
	const loanCard = patrons[loanCardNum];

	if (!loanBook)
		return console.error(`Book id ${loanBookId} not found!`);
	if (!loanCard)
		return console.error(`Patron card number ${loanCardNum} not found!`);

	// Add patron to the book's patron property
	// We assume books and card patron's number are never modified or deleted. 
	loanBook.patron = loanCard;


	// Add book to the patron's book table in the DOM by calling
	addBookToPatronLoans(loanBook);

	// Start the book loan timer.
	loanBook.setLoanTime();

}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e) {
	e.preventDefault();
	// check if return button was clicked, otherwise do nothing.

	// Call removeBookFromPatronTable()


	// Change the book object to have a patron of 'null'


}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
	const newPatronName = document.querySelector("#newPatronName").value;
	const newPatron = new Patron(newPatronName);
	patrons.push(newPatron)

	// Call addNewPatronEntry() to add patron to the DOM
	addNewPatronEntry(newPatron)
}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book
	const bookInfoId = document.querySelector("#bookInfoId").value;
	const book = libraryBooks[bookInfoId];

	if (!book)
		return console.error(`Book id ${bookInfoId} not found!`);

	// Call displayBookInfo()
	displayBookInfo(book);

}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Insert a row in the table at last row
	const newRow = bookTable.insertRow();

	// Insert cells in the row
	const newBookId = newRow.insertCell();
	const newBookTitle = newRow.insertCell();
	const newBookPatron = newRow.insertCell();


	// Append text nodes to the cells
	newBookId.appendChild(document.createTextNode(book.bookId));

	const strongStyle = document.createElement('strong')
	strongStyle.appendChild(document.createTextNode(book.title));
	newBookTitle.appendChild(strongStyle);

	if (book.patron) {
		newBookPatron.appendChild(document.createTextNode(book.patron));
	}

}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	const temp = [book.bookId, book.title, book.author, book.genre];
	const currentLoanedOutTo = book.patron ? book.patron.name : "N/A";
	temp.push(currentLoanedOutTo)

	let idx = 0;
	for (i of bookInfo.children) {
		i.firstElementChild.innerText = temp[idx];
		idx++;
	}

}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	for (p of patronEntries.children) {
		const cardNumber = p.children[1].lastElementChild.innerText

		// found the patron
		if (cardNumber == book.patron.cardNumber) {
			const patronLoansTable = p.lastElementChild;

			// Insert a row in the table at last row
			const newRow = patronLoansTable.insertRow();

			// Insert cells in the row
			const newBookId = newRow.insertCell();
			const newBookTitle = newRow.insertCell();
			const newBookStatus = newRow.insertCell();
			const newBookReturnButton = newRow.insertCell();

			// Append text nodes to the cells
			newBookId.appendChild(document.createTextNode(book.bookId));

			const strongStyle = document.createElement('strong');
			strongStyle.appendChild(document.createTextNode(book.title));
			newBookTitle.appendChild(strongStyle);

			const newSpan = document.createElement('span');
			newSpan.className = "green";
			newSpan.appendChild(document.createTextNode("Within due date"));
			newBookStatus.appendChild(newSpan);

			const newButton = document.createElement('button');
			newButton.className = 'return';
			newButton.appendChild(document.createTextNode("return"));
			newBookReturnButton.append(newButton)

			return;
		}

	}
}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
function addNewPatronEntry(patron) {
	let clone = document.querySelector('.patron').cloneNode(true);

	clone.children[0].firstElementChild.innerText = patron.name;
	clone.children[1].firstElementChild.innerText = patron.cardNumber;

	// Only keep the header row.
	clone.querySelectorAll("tr:not(:first-child)").forEach(row => {
		row.remove();
	});

	patronEntries.appendChild(clone)
}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here

}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here

}
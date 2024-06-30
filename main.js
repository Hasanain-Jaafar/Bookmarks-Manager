// DOM SELECTORS
//
// >=====================>>
const bookmarksContainer = document.querySelector(".bookmarks");
const categorySuggestionsContainer = document.querySelector(
  ".category-suggestions div"
);
const categoryButtonsContainer = document.querySelector(".category-button div");
const categoryInput = document.querySelector(".category");
const showAll = document.querySelector(".all");
//
// <<=======================================================<<
//
//
localStorage.removeItem("active-category");

showAll.addEventListener("click", function () {
  displayBookmarks();
  const categoryButtons = document.querySelectorAll(
    ".category-button div span"
  );
  localStorage.removeItem("active-category");
  categoryButtons.forEach((button) => button.classList.remove("active"));
});
// FUNCTION >=========>>|||>SAVE BOOKMARKS<||| <<========<
function saveBookMark() {
  const title = document.querySelector(".title").value.trim();
  const url = document.querySelector(".url").value.trim();
  const category = document.querySelector(".category").value.trim();
  if (!title || !url || !category) {
    alert("Please fill all fields ");
  }

  const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
  if (!allBookmarks[category]) allBookmarks[category] = [];
  allBookmarks[category].push({ title, url });
  localStorage.setItem("bookmarks", JSON.stringify(allBookmarks));
  //
  //  -----Empty the inputs fields---->>-----
  document.querySelectorAll("input").forEach((input) => (input.value = ""));
  //
  //  ----------Update Bookmarks------>>-----
  displayBookmarks();
  //
  //  ----------Display Suggestions------>>-----
  displayCategorySuggestion();
  //
  //  ----------Display Buttons------>>-----
  displayCategoryButtons();
}
// FUNCTION >=========>>|||>DISPLAY BOOKMARKS<||| <<========<
function displayBookmarks() {
  bookmarksContainer.innerHTML = "";
  const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
  for (const category in allBookmarks) {
    // console.log(category);
    const categoryBookmarks = allBookmarks[category];
    // console.log(categoryBookmarks);
    categoryBookmarks.forEach((bookmark, index) => {
      const bookmarkElement = document.createElement("div");
      bookmarkElement.innerHTML = `
            <div class='cat'>${category}</div>
            <div class='link'>
            <a href="${bookmark.url}" target ="_blank">
            ${bookmark.title}</a>
            </div>
            <button onclick="deleteBookmark('${category}', ${index})">Delete</button>
            `;
      bookmarksContainer.appendChild(bookmarkElement);
    });
  }
}
//
//
// FUNCTION >=========>>|||>FILTER BOOKMARKS<||| <<========<
function filterBookmarksByCategory(category) {
  const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
  const categoryBookmarks = allBookmarks[category];

  bookmarksContainer.innerHTML = "";

  categoryBookmarks.forEach((bookmark, index) => {
    const bookmarkElement = document.createElement("div");
    bookmarkElement.innerHTML = `
            <sapn class='number'>${index + 1}</sapn>
            <div class='link'>
            <a href="${bookmark.url}" target ="_blank">
            ${bookmark.title}</a>
            </div>
            <button onclick="deleteBookmark('${category}', ${index})">Delete</button>
            `;
    bookmarksContainer.appendChild(bookmarkElement);
  });
}
// FUNCTION >======>> ||>DISPLAY CATEGORY SUGGESTIONS<||<<====<
function displayCategorySuggestion() {
  const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
  const categories = Object.keys(allBookmarks);

  categorySuggestionsContainer.innerHTML = "";
  categories.forEach((category) => {
    const categoryElement = document.createElement("span");
    categoryElement.textContent = category;
    categoryElement.addEventListener(
      "click",
      () => (categoryInput.value = category)
    );
    categorySuggestionsContainer.appendChild(categoryElement);
  });
}
//
// FUNCTION >==============>>|||>DISPLAY CATEGORY BUTTONS <||| <<=============<
function displayCategoryButtons() {
  const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
  const categories = Object.keys(allBookmarks);
  categoryButtonsContainer.innerHTML = "";

  categories.forEach((category) => {
    const categoryElement = document.createElement("span");
    categoryElement.textContent = category;

    categoryElement.addEventListener("click", function () {
      filterBookmarksByCategory(category);
      localStorage.setItem("active-category", category);
      // Remove active class from all buttons
      const categoryButtons = document.querySelectorAll(
        ".category-button div span"
      );
      categoryButtons.forEach((button) => button.classList.remove("active"));
      //   Add Active class to the Clicked Button
      this.classList.add("active");
    });
    const activeCategory = localStorage.getItem("active-category");
    if (activeCategory === category) {
      categoryElement.classList.add("active");
    }
    categoryButtonsContainer.appendChild(categoryElement);
  });
}
//
// FUNCTION >==============>>|||>DELETE BOOKMARK<||| <<=============<
function deleteBookmark(category, index) {
  const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
  allBookmarks[category].splice(index,1);
  // if the category is empty, remove the category
  if(allBookmarks[category].length === 0) delete allBookmarks[category];
  localStorage.setItem("bookmarks",JSON.stringify(allBookmarks));

  if (allBookmarks[category] && localStorage.getItem("active-category")) {
    filterBookmarksByCategory(category);
  }else{
    displayBookmarks();
  }

  displayCategorySuggestion();
  displayCategoryButtons();
}
//
//
// ||> Show Bookmarks
displayBookmarks();
// ----<>----
// ||> Show Category Suggestion
displayCategorySuggestion();
// ----<>----
// ||> Show Category Buttons
displayCategoryButtons();

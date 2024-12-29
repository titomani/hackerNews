"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

let paginatedStoryList;

let page = "" ;

let pageNumber = 0

/** Get and show stories when site first loads. */

 function getAndShowPaginatedStories(){
  console.log( paginatedStoryList);

  switch(page){
    case "favorites":
      putFavoritesListOnPage();
      break;
    case "ownStories":
      putOwnStoriesOnPage()
      break;
    default:
      putStoriesOnPage(paginatedStoryList)
  }
}

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  console.log(storyList);

  $allStoriesList.empty();


  switch(page){
    case "favorites":
      putFavoritesListOnPage();
      break;
    case "ownStories":
      putOwnStoriesOnPage()
      break;
    default:
      putStoriesOnPage(storyList.stories)
  }
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */


function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const showStar = Boolean(currentUser);
  const showTrash = (story && currentUser) ? (story.username == currentUser.username) : false;


  return $(`
      <li id="${story.storyId}">
        ${showTrash ? removeBtnHtml(): ""}
        ${showStar ? starHTML(story, currentUser) : ""} 
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}



/** Gets list of stories from server, generates their HTML, and puts on page. */

/*function putStoriesOnPage() {

  page = "";
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}*/

function putStoriesOnPage(stories) {

  page = "";
  console.log("putStoriesOnPage", stories);


  // loop through all of our stories and generate HTML for them
  for (let story of stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

$submitForm.on("submit", submitNewStory);

async function submitNewStory(evt) {
  evt.preventDefault();
  console.log(currentUser, evt, $("#create-author").val());
  $("#create-author").val();
  await storyList.addStory(currentUser, {
    title: $("#create-title").val(),
    author: $("#create-author").val(),
    url: $("#create-url").val(),
  });

 getAndShowStoriesOnStart();


  $submitForm.trigger("reset");
  $submitForm.slideUp("500ms");
}

function removeBtnHtml() {
  return `
      <span class ="remove">
        <i class ="fa fa-trash"></i>
      </span>`;
}

function starHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
  <span class = "star">
    <i class ="${starType} fa-star"></i>
  </span>`;
}

async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);

  if ($tgt.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite);

function putFavoritesListOnPage() {

  page = "favorites";
  console.debug("putFavoritesListOnPage");

  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h3> No Favorites Added! </h3>");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }

  $favoritedStories.show();
}

function putOwnStoriesOnPage() {

  page = "ownStories"

  console.debug("putOwnStoriesOnPage");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h3> No stories have been added by user! </h3>");
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}

async function removeStory(evt) {
  console.debug("removeStory");
  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  getAndShowStoriesOnStart();
  
}


window.addEventListener('scroll',()=>{
  if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight){
    pageNumber++ ;
    paginatedStoryList = StoryList.getPaginatedStories(pageNumber)
    console.log(paginatedStoryList);
    getAndShowPaginatedStories();
  }
})


$storiesLists.on("click", ".remove", removeStory);
$ownStories.on("click", ".remove", removeStory);
$favoritedStories.on("click", " .remove", removeStory);

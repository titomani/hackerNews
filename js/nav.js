"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  page = "";
  getAndShowStoriesOnStart();
}

$body.on("click", "#nav-all", navAllStories);

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  evt.preventDefault();
  hidePageComponents();
  page = "";
  getAndShowStoriesOnStart();
  $submitForm.show();
}

$navSubmitStory.on("click", navSubmitClick);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  
  hidePageComponents();
  
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();

  $navUserProfile.text(`${currentUser.username}`).show();

  $loginForm.hide();
  $signupForm.hide();

  getAndShowStoriesOnStart();
}

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  page = "favorites";
  putFavoritesListOnPage();
}

function navMyStoriesClick(evt) {
  console.debug("navMyStoriesClick", evt);
  hidePageComponents();
  page = "ownStories";
  putOwnStoriesOnPage();
}

$body.on("click", "#nav-favorites", navFavoritesClick);
$body.on("click", "#nav-my-stories", navMyStoriesClick);


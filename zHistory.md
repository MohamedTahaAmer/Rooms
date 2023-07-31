# 1- GoodStates
## GoodState 1
```js
// 1- server side protected pages
// 2- cient side protected pages
// 3- google auth provider
// 4- nav with drop down menue
```
## GoodState 2 
```js
// 1- route intersction working
```

# 2- Problems
## Problem 1
### Next.js cashing routes, and the navbar never unmounts
```js

// i have a problem with next.js cashing, that when the user hits a route that he used before, then next.js never sends that request to the server, instead it returns a cashed version of that url, but the navbar is fixed in all routes, the components inside of it will have the value of the last visited new url only, if the client returned to an onld url, then next.js will just his the old cashed version, and the conponent in the navbar won't get back to it's state when this url was first visited instead it still have the value for the previous url, and won't change it untill the user hits a route that he never hit before,

// tried using

  // - 1- useEffect, but the navbar was never unmounted, so when the user navigates to an old url, the useEffect function won't be called.
  // - 2- tried useQuery, but it didn't work neither
    // ## decieded to go learn the max Next.js course, first to good knowlage of how next.js cashing work, so that i can stop it

// ## - solved: just accessed the window object on a button click event
  // - before i was tring to access the window object aftre the component mountes, then pass the href to the Link, and next.js was cashing that href, the link was redirecting to wrong locations
  // - but this way i lost the accessability, the screen reader won't that this is a link

// - after solving it decieded to continue with the project, while watching youtube vids about the internal of next.js

```
# 1- Next.js cashing routes, and the navbar never unmounts

i have a problem with next.js cashing, that when the user hits a route that he used before, then next.js never sends that request to the server, instead it returns a cashed version of that url, but the navbar is fixed in all routes, the components inside of it will have the value of the last visited new url only, if the client returned to an onld url, then next.js will just his the old cashed version, and the conponent in the navbar won't get back to it's state when this url was first visited instead it still have the value for the previous url, and won't change it untill the user hits a route that he never hit before, 
tried using
1- useEffect, but the navbar was never unmounted, so when the user navigates to an old url, the useEffect function won't be called.
2- tried useQuery, but it didn't work neither
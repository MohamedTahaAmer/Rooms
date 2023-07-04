export default function Default() {
  return null
}

// >(1:40) this @ in the route is used to intercept a certain routes like sign-in, sign-out in this example
// >(1:43) How inteseption work, is by loading the model if the client is being redirected, but if the client requested this route directly we won't intersept, instead the sign-in page it self will be displayed
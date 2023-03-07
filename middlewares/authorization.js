// middleware for doing role-based permissions
export default function permit(...permittedUserTypes) {
    // return a middleware
    return (request, response, next) => {
      const { user } = request
  console.log(user)
      if (user && permittedUserTypes.includes(user.userType)) {
        next(); // role is allowed, so continue on the next middleware
      } else {
        response.status(403).json({message: "Forbidden"}); // user is forbidden
      }
    }
  }
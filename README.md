# URL Shortener Microservice

## Objectives
1. I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
2. If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.
3. When I visit that shortened URL, it will redirect me to my original link.

[Full description](https://www.freecodecamp.com/challenges/url-shortener-microservice)

[Live Demo](https://short-url-js.herokuapp.com/)

### New short-link creation:
https://short-url-js.herokuapp.com/new/https://www.google.com

### Example Output:
```
{
original: "https://google.com",
short: "rkfnK0ebx"
}
```
### Redirect to original using short link:
https://short-url-js.herokuapp.com/rkfnK0ebx

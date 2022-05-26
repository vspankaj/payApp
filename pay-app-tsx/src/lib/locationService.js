export const locationService = fetch("https://api.ipregistry.co/?key=tryout")
.then(response => response.json())
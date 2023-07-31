str = "{-start-/search-end-}";
const regexMatch = str.match(/(?<=-start-).*?(?=-end-)/); // /search
const regex = regexMatch && regexMatch[0]

const str = `{"callbackUrl":"/"}`.match(/(?<="callbackUrl":).*?(?=})/)
console.log(str[0])
function identity<Type>(arg: Type): Type {
  return arg;
}


let output = identity<string>("myString");
output



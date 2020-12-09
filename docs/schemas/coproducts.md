# Coproduct types

_Coproduct types_ are the other composite types in tasl. They're also known in other contexts as _discriminated unions_, _sums_, or _variants_.

Coproduct types also map URI keys to types, but they're written using square brackets `[ ]` and inside-out arrows `>-`. We call the slots of a coproduct type its _options_. The two parts of each option are its _key_ (the URI) and its _value_ (the type).

```tasl
namespace s http://schema.org/
namespace ex http://example.com/ns#

class s:Person {
	ex:favoriteColor -> string;
	ex:birthday -> dateTime;
	ex:height -> [
	  ex:official >- double;
	  ex:unofficial >- string;
  ]
}
```

Coproducts correspond to the idea of "OR" or an "alternative". A value of a coproduct type has a value for exactly one of its options. Here, we've added a third component to our `s:Person` type, with key `ex:height` and a value that is a coproduct type with two options. The first option has key `ex:official` with value `double`; the second has key `ex:unofficial` with value `string`.

However, coproducts behave a little bit different than unions as you might be used to them. A value of a coproduct type has a value for exactly one of its options, _and it also knows explicitly which option it is_.

In most schema languages or type systems, the union of a type with itself is the same type. For example, in TypeScript, if I try to define a type `type hello = string | string`, the type `hello` behaves exactly like `string` - a value of type `hello` will be a string like `"world"`

But in tasl, if I have a coproduct

```tasl
namespace ex http://example.com/ns#

type hello [
  ex:one >- string;
  ex:two >- string;
]
```

a value of type `hello` will be a pair like `(ex:one, "world")` or `(ex:two, "world")`.

## Enums

One really handy way to use coproducts is to model enums.

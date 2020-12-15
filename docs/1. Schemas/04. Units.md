# The Unit Type

The _unit type_ in tasl is written with an exclamation mark `!`. For convenience, you can also use the global variable `unit`, which is defined like this:

```tasl
type unit !
```

> Units correspond to the idea of "null" or a _placeholder_.

The unit type is a little unintuitive. You can either think of it as a primitive type, or as an "empty" product type. In some ways it resembles a "null" type; in other contexts it can be used to indicate "nodes" or a raw concept of "identity".

## Types as Sets

Understanding the unit type requires backing up and formalizing what a "type" really _is_ in the first place. Fortunately, this is easier than it sounds: a type is just a [_set_](<https://en.wikipedia.org/wiki/Set_(mathematics)>). We can treat any type as a set, and any set as a type. There's no difference between a "type" and the **set of possible values** of that type.

(One annoying thing that mathematicians love to emphasize is that the elements of a set can be basically anything. This is usually illustrated by writing out a set full of nonsensical things, like `{ 🆒, ☃︎, "Call be Ishmael. Some years ago, ..." }`. The point is that you shouldn't worry about the "types" of the elements inside sets. They don't have types; they're just abstract _things_.)

Let's first look at some familiar types represented as sets, and then come back to the unit type.

### Bytes

Lots of languages have a type called "byte" or similar. We can think of the type "byte" as the set of integers `{ 0, 1, 2, 3, ... 126, 127 }` (not a builtin-type in tasl but common in programming languages like C or whatever). The type byte is finite; it only has 128 elements.

### Strings

"strings" are another universally familiar type. We can think of the type "string" as the _set of all strings_. The type "string" is _infinite_. That's ok! We can still treat it as a set; it just has [uncountably many](https://en.wikipedia.org/wiki/Uncountable_set) elements.

### Booleans

We're also all familiar with a type called "boolean" that has just two elements - `true` and `false`.

One interesting observation that the boolean type highlights (it's true for all types but is just particularly noticeable here) is that the actual elements "true" and "false" are not that important. We could also write the boolean type as a set like this: `{ TRUE, FALSE }`, or like this: `{ 1, 0 }`, or `{ yes, no }`, or `{ ✅, ❌ }`, or _basically anything_! All that matters is that we're able to tell the two apart, and that we agree on how they relate to other sets - so that when we have some function that maps some domain to the type "boolean" (like the function "is greater than 5" from the domain "integers"), we know which of the two boolean values to map each of the domain elements to.

Now let's get back to the unit type.

## The Unit Type is a Set with Just One Element

The [unit type](https://en.wikipedia.org/wiki/Unit_type) is this set: `{ <the unit value> }`. It's a set with only one element. For now, let's call that element "the unit value".

Just like we noticed with the boolean type, it doesn't really matter what we call the unit value. In fact, it matters even less than it mattered for the boolean type, since here there's nothing else we need to disambiguate it from!

This weird situation - never needing to distinguish the unit value from other values of the same type - is probably why there isn't a single common name for the unit value. The best candidate is the value `null` in some programming languages. But the name "null" has a lot of baggage - it has a negative association, and it usually means an absence of some other value. The unit type can definitely be used to represent an empty alternative to something, but it's also useful on its own in other ways.

What we _can_ say about the unit type is that it "carries no information". If you use the unit type somewhere in a schema, instances of that schema can only have that one, singular unit value in that location.

## Example: Unit Classes as Nodes

One way that unit types are useful "on their own" is in modeling _nodes_ in a graph.

```tasl
namespace ex http://example.com/

class ex:Node !

class ex:Edge {
  ex:source -> * ex:Node;
  ex:target -> * ex:Node;
}
```

This is a schema for [directed graphs](https://en.wikipedia.org/wiki/Directed_graph).

Keeping track of how identity works in schemas can be tricky. Here, the _class_ `ex:Node` can have lots of instance _elements_. But each of these elements will have a value of... the same, single, carries-no-information unit value. What this really means is that our schema describes an _unlabelled_ directed graph: one where nodes don't have externally-accessible identity.

Unit are especially powerful when combined with coproduct types, so we'll see more examples of them in action over there.

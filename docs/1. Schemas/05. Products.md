# Product Types

_Product types_ are one of the two composite types in tasl - that means they're one of the ways that we can build "bigger" types out of smaller ones. In other contexts, they're also called _structs_, _maps_, _records_, _tuples_, _vectors_, or _objects_.

> Product types correspond to the idea of "AND" or _combination_.

A product type is written as map from URI keys to types, using curly braces `{ }`, arrows `->`, and semicolons. We call the slots of a product type its _components_, and the two parts of each component are its _key_ (the URI) and its _value_ (the type). It's sometimes confusing to use the word "value" to refer to the type that a component maps to, but usually there's enough context to tell whether "value" means a type-in-a-component or an actual concrete instance-of-a-type value.

We've already seen several product types in action:

```tasl
namespace s http://schema.org/
namespace ex http://example.com/ns#

class s:Person {
  ex:favoriteColor -> string;
  ex:birthday -> dateTime;
}
```

The curly braces aren't part of the class declaration (like they would be in JavaScript, for example) - the grammar for declaring a class is just "class _uri_ _type_". The curly braces define an inline product object with two components. The first component has key `ex:favoriteColor` and value `<xsd:string>`; the second component has key `ex:birthday` and value `<xsd:dateTime>`.

The value of a product type has a value for every one of its components.

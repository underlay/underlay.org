# Schemas

Schemas in the Underlay are written in a tiny algebraic schema language called tasl.

A tasl _schema_ defines a set of _classes_. Each class is associated with a URI key and a _type_. A _type_ is one of six kinds of types:

-   a [literal type](docs/schemas/literals)
-   the [URI type](docs/schemas/uris)
-   the [unit type](docs/schemas/units)
-   a [product type](docs/schemas/products)
-   a [coproduct type](docs/schemas/coproducts)
-   a [reference type](docs/schemas/references)

Two of these - products and coproducts - are _composite types_, which means that they have other types inside of them.

Each kind of type corresponds to its own kind of _value_. You can think of each type as a different shape, and values as actual objects that fit a specific shape.

A schema has classes and types, and it only describes shapes. An _instance_ of a schema has _elements_ and _values_, which all fit the corresponding shapes of a particular schema. On R1, we develop schemas and collections separately. A version of a schema just defines a set of classes and types. A version of a collection links to a version of a schema, and contains an instance of that schema version.

## Classes, Types, Elements, and Values

This diagram is an overview of the relationships between schemas, instances, classes, types, elements, and values. We'll unpack this a bit in the next couple sections.

![An overview of the relationships between schemas, instances, classes, types, elements, and values](/collection-diagram.svg)

### Classes vs types

You can think of classes as types that are given URI labels - the whole schema is just a map from URIs to types. In tasl, you can declare classes using the `class` keyword, followed by the URI label, followed by a type expression.

```tasl
namespace ex http://example.com/

class ex:Thing !
```

Here, we declare a class with a URI `ex:Thing` and a type `!` (this is the [Unit type](schemas/units), which we'll explain later). Other classes can have more complex types:

```tasl
namespace ex http://example.com/

class ex:Person {
  ex:name -> string;
  ex:bestFriend -> ? * ex:Person;
  ex:favoriteColor -> [ ex:red; ex:green ];
}
```

Classes are types that are exported from the schema. The reason we have a different name for them is because some types are composed of other types, so sometimes "type" can refer to one of those child types (which don't have a URI label, etc). Classes are always top-level.

### Elements vs values

The class-vs-type distinction is mirrored on the instance side with _elements_, which instantiate classes, and _values_, which instantiate types. A collection version has a set of elements for each class in the schema; each element of a given class is associated with a value of the class type.

The important thing to remember is that _identity_ is held by **elements**. This means that you can have as many different elements of the same class as you want, even if they all have the "same" value. But by default, there's no externally-accessible way of identifying individual elements - they don't automatically have UUIDs or anything.

## _Algebraic!?_

We say that tasl is a tiny algebraic schema language. What does "algebraic" mean here?

In math, an _algebra_ is any little system that starts with a few initial things, and has two different ways of combining things to get more things. The algebra that's taught in high school is the one where the initial things are numbers and variables, and the two ways of combining them are addition and multiplication. In that context, an "algebraic expression" is something like `(x * 4) + (y * (x + 1))` - a composite thing built up from some initial terms and assembled using `*` and `+`.

The algebra that we're interested in is one where the expressions are _types_. Here, instead of numbers and variables, our initial "primitive" things are literal datatypes like `string` and `date`, and our two ways of combining them are called _product_ and _coproduct_. These are known as [algebraic data types](https://en.wikipedia.org/wiki/Algebraic_data_type).

## LEGO Expressions

Using tasl effectively involves a different overall approach to schema design than other languages you may be used to. tasl doesn't have built-in concepts of optional properties, enums, class inheritance, or basically any of the usual affordances that you might typically reach for. Instead of building those features directly into the language, tasl just gives you a toolbox of composable expressions that you can use to re-create them in exactly your own terms.

So you can't just call something "optional", but you _can_ construct a little expression that says "either this thing, or nothing". Working with tasl ends up feeling less like annotating a system diagram and more like playing with LEGOs.

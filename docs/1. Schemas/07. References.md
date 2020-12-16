# Reference Types

The last kind of type that we have in tasl is _reference types_. A reference type points to a class in the same schema. We write them with an asterisk followed by the class URI. We've already seen several of them in action:

```tasl
namespace ex http://example.com/

class ex:Person {
  ex:name -> string;
  ex:favoriteBook -> ? * ex:Book;
}

class ex:Book {
  ex:title -> string;
  ex:isbn -> <>;
}
```

Here, `* ex:Book` is a reference type; we would pronounce it "a reference to `ex:Book`".

A value of a reference type is an element of the referenced class. Sometimes we'll call this value a _pointer_. Recall this relationship diagram:

![An overview of the relationships between schemas, instances, classes, types, elements, and values](/collection-diagram.svg)

References account for the two "might reference" arrows. A type might be a reference type that points to another class in the same schema, in which case its values are all pointers to individual elements (of the corresponding class) in the same instance.

## Managing identity

Often you'll be faced with a choice between inlining a type and splitting it out into its own class. Let's compare the previous example to this similar schema...

```tasl
namespace ex http://example.com/

class ex:Person {
  ex:name -> string;
  ex:favoriteBook -> ? {
    ex:title -> string;
    ex:isbn -> <>;
  };
}
```

... where we just spliced the book type directly into the person class. There are two major functional differences between the two schemas:

1. In the first schema (with separate classes), it's possible to have lots of books that aren't anybody's favorite. In the second example, the only way that a book can show up in an instance is as a nested value of an `ex:Person` element.
2. In the first schema, it's easy to tell if two people have the same favorite book, since we can just ask whether the references point to the same book element. In the second schema, the best we could do is compare the _values_ of the `ex:favoriteBook` components for different people. In this case, we're probably comfortable with comparing the values for `ex:title` and `ex:isbn`, and if they're the same for two people, concluding that they have the same favorite book. But in other cases this kind of value comparison can break down, or isn't appropriate for the actual thing you're modeling. Having separate classes allows us to have multiple elements with the exact same values.

The common theme behind both of these differences is the motto that _identity is held by elements_. Comparing the values (or parts of the values) of different elements is only sometimes useful.

## Multi-valued properties

One common way that we use references is to model properties that can have multple values. For example, in this simple schema...

```tasl
namespace ex http://example.com/

class ex:Person {
  ex:age -> integer;
  ex:name -> string;
}
```

... a person has to have exactly one name. We've seen how we coud model a person with an optional name...

```tasl
namespace ex http://example.com/

class ex:Person {
  ex:age -> integer;
  ex:name -> ? string;
}
```

... but what if we wanted to model a person with _zero or more names_? To do this, we have to name a separate class just for the person/name property, like this:

```tasl
namespace ex http://example.com/

class ex:Person {
  ex:age -> integer;
}

class ex:Person/name {
  ex:person -> * ex:Person;
  ex:name -> string;
}
```

In this schema, we can have arbitrarily many people elements, each of whom has exactly one integer age. Separately, we have arbitrarly many `ex:Person/name`, each of which points to a person element and also has a string name. Retriving the set of names that are associated with a given person just amounts to retriving the `ex:Person/name` elements that reference to that person.

Writing separate classes for multi-properties like this is definitely a little awkward. It's good practice to give these "property classes" relatively verbose, obvious names like `ex:Person/name` to indicate that they're not proper conceptual objects. "Property class" is an informal term for classes that are used to link other classes with values.

## Unit references

Another useful general pattern is to use references to unit classes as a way to "tie things together". We've already seen this with the example of a directed graph:

```tasl
namespace ex http://example.com/

class ex:Node !

class ex:Edge {
  ex:source -> * ex:Node;
  ex:target -> * ex:Node;
}
```

The elements of the `ex:Node` class don't have any information associated with them; they only serve to "wire together" the graph.

But let's say we wanted to turn this schema into a [hypergraph data model](https://en.wikipedia.org/wiki/Hypergraph), where edges contain arbitrarily many nodes. Now instead of fixed `ex:source` and `ex:target` properties, we need to express that an edge can have any number of `* ex:Node` references. This is exactly the kind of multi-valued property we just saw in the last section! We can express this by making _edges_ (in addition to nodes) a unit class and introducing a new edge-associated-with-a-node property class.

```tasl
namespace ex http://example.com/

class ex:Node !

class ex:Hyperedge !

class ex:Hyperedge/includes {
  ex:edge -> * ex:Hyperedge;
  ex:node -> * ex:Node;
}
```

Multi-valued properties are also called _one-to-many_ properties; hypergraphs are an example of modeling a _many-to-many_ property. Each edge can have many nodes; each node can belong to many edges. But the important takeaway is that "supporting many-to-many properties" isn't built in to tasl. Instead, it's a structure that we were able to model ourselves using simple building blocks (units, products, and references).

## Self-references

Technically, you can even define a class to be a reference to itself:

```tasl
namespace ex http://example.com/

class ex:Useless * ex:Useless
```

... although this structure isn't very useful. An instance of this schema could have arbitrarly many elements of the `ex:Useless` class; each one would have to point to another (or itself).

Here's a more interesting kind of self-reference:

```tasl
namespace ex http://example.com/

class ex:ListOfIntegers ? {
  ul:head -> integer;
  ul:tail -> * ex:ListOfIntegers;
}
```

The class `ex:ListOfIntegers` is either nothing - the `ul:none` option of the `?` coproduct - or (in the `ul:some` option of the `?` coproduct) a product of two components: an `integer` and a pointer to another `ex:ListOfIntegers` element. This means that an element of `ex:ListOfIntegers` is either null (the empty list) or an integer and another element.

As the name implies, this effectively models a [linked list](https://en.wikipedia.org/wiki/Linked_list) of integers. There's no generic "list" type in tasl; if we need lists we have to roll our own linked list class for the particular type that we want (although this is discouraged, which we'll talk about later).

If we wanted to model _non-empty_ linked lists, we could tweak our class declaration to express that:

```tasl
namespace ex http://example.com/

class ex:ListOfIntegers {
  ul:head -> integer;
  ul:tail -> ? * ex:ListOfIntegers;
}
```

... here we moved the optional operator from the top level to the `ul:tail` component. This means that now every element has to have an integer `ul:head` value, and can optionally link to another element.

Again, the purpose of this example is just to illustrate how references work. Making linked lists with schemas is discouraged, and using this non-empty linked list structure to enforce a "one or more" constraint on an otherwise-unordered multi-valued property is even more strongly discouraged.

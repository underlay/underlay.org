# Schemas

Schemas in the Underlay are written in a tiny algebraic schema language called tasl.

## _Algebraic!?_

"Algebraic" sounds scary, but it actually describes something very simple. In math, an _algebra_ is any little system that starts with a few initial things, and has two different ways of combining things to get more things.

The algebra that's taught in high school is the one where the initial things are numbers and variables, and the two ways of combining them are addition and multiplication. In that context, an "algebraic expression" is something like `(x * 4) + (y * (x + 1))` - a composite thing built up from some initial terms and assembled using `*` and `+`.

The algebra that we're interested in is one where the expressions are _types_. Here, instead of numbers and variables, our initial "primitive" things are literal datatypes like `string` and `date`, and our two ways of combining them are called _product_ and _coproduct_.

## LEGO Expressions

Using tasl effectively involves a different overall approach to schema design than other languages you may be used to. tasl doesn't have built-in concepts of optional properties, enums, class inheritance, or basically any of the usual affordances that you might typically reach for. Instead of building those features directly into the language, tasl just gives you a toolbox of composable expressions that you can use to re-create them in exactly your own terms.

So you can't just call something "optional", but you _can_ construct a little expression that says "either this thing, or nothing". Working with tasl ends up feeling less like annotating a system diagram and more like playing with LEGOs.

## Concepts

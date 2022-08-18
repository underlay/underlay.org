# Protocol

Over the course of our work on Underlay, we're struggled to pin down what the Underlay is specifically. Is it a layer over a database? A provenance signing protocol? A network protocol for sending data?

To answer that, it is also important to identify what purpose Underlay is serving.

Our current answer is that the purpose of the Underlay is to make public data more accessible and effective. To make that data easier to understand, integrate, and maintain. [More about that purpose is explored here](https://notes.knowledgefutures.org/pub/1id7h71i).

With that in mind, it is often easier to identify what parts of that problem Underlay does _not_ address. For example, we are not trying to increase query-speed of data (i.e. we're not a database), and we're not trying to improve transfer sizes (i.e. we're not a compression algorithm).

In fact, nearly all of the technical components that one typically things of when considering public datasets have already been considered and addressed by past efforts around the Semantic Web, RDF, and other open data projects. However, despite the technical expertise brought to these projects, the reality of public data still leaves us wanting. As such, we identify that a missing piece we can address is the social dynamics of using public data. As such, our approach is to identify simple, well-established technical components that can serve as the basis for facilitating more effective, equitable, and sustainble processes.

The Underlay is premised on the idea that a knowledge graph can be constructed from a series of distributed transactions called assertions. Multiple assertions are combined through a process called reduction and can be curated into useful groupings using collections.

## Assertions

An assertion is simply a set of data with some form of attribution. This attribution could by a cryptographic signature or any sort of pointer to an identity. For most development, we use JSON blobs to send data around, so we will use that for these examples, but the approach is not specific to JSON serialization - any would do just fine.

An assertion is simply something like

```
{
	data: { name: 'Rosalind Franklin', birthYear: '1920' },
	signature: 'Jude'
}
```

In english: 'Jude says that Rosalind Franklin was born in 1920'.

## Reduction

Now, say we have two assertions:

```
[
	{
		data: [{ name: 'Rosalind Franklin', birthYear: '1919', favoriteColor: 'red' }],
		signature: 'Jude'
	},
	{
		data: [{ name: 'Rosalind Franklin', birthYear: '1920' }],
		signature: 'Jude'
	}
]
```
We want a way to take multiple assertions and process them such that we end up with a singular output state. 

There are many ways we could 'reduce' these assertions into a single state. We could:
- Overwrite old assertions with newer ones
  ```
  ///Output
  {
    data: [{ name: 'Rosalind Franklin', birthYear: '1920' }],
  }
  ```
- Append assertions
  ```
  ///Output
  {
    data: [
    	{ name: 'Rosalind Franklin', birthYear: '1920' },
    	{ name: 'Rosalind Franklin', birthYear: '1919', favoriteColor: 'red' }
    ]
  }
  ```
- Merge assertions 
	```
  ///Output
  {
    data: [
    	{ name: 'Rosalind Franklin', birthYear: '1920', favoriteColor: 'red' },
    ]
  }
  ```

And of course, we could do such transactions with any set of filters (e.g. Filter out all assertions that aren't from Jude).

In reality, we need a bit more than is described in the toy example. Specifically, we need a schema which allows us to specify important elements such as unique identifiers (in order to know *how* to merge), we need some way of maintaining provenance into the output data. In practice, a set of input assertions and resulting outputs look more like this:

```
// Input
[
	{
		assertionId: uuid,
		reductionType: 'merge',
		data: [{ name: 'Rosalind Franklin', birthYear: '1919', favoriteColor: 'red' }],
		signature: 'Jude'
	},
	{
		assertionId: uuid,
		reductionType: 'merge',
		data: [{ name: 'Rosalind Franklin', birthYear: '1920' }],
		signature: 'Jude'
	}
]

// Output


```
The simple process is to start at the beginning of your list of assertions, and one-by-one reduce the assertion into the previous dataset state.

## Collections

## A simple mental model

We use two simple components to understand how we think about data in the Underlay:

1. JSON blobs
2. Schemas

Schemas describe the types and shape of

A simple approach for making data more collaborative, and accessible.

-   A schema (described in JSON)
-   A list of json blobs

Json blobs are 'reduced', according to parameters set in the blob.
The output of reduction is a new JSON blob.

-   Json blobs conform to a specific schema (types?)
-   Json blobs can be signed (carry prov info)

You can implement reduction code for a variety of storage mediums. The 'default' is a static json file. But you can write database language that allows reduction outputs to be represented by database states.

-   This solves essentially the two pieces of the challenge for getting 'caught up' with a dataset. You need to know the shape of it, and a papertrail of what happened. The more actionable/collaborative that papertrail is, the better.

## Thought from 2022-08-15

-   If KFG is about overcoming the social barriers with infrastructure, our purpose is not some new technical capability, but a simplifying process that allows group interconnection

## Schema Migrations?

-   Renames of properties and classes is no problem (we use canonical hashes)
-   Deletion of properties is no problem
-   Deletion of classes is no problem if no relationships (extra steps if it has relationships bound)
-   Addition of class is no problem
-   Addition of property is no problem
-   What if for certain schema changes, you have to map the current state into the new one?

    -   Essentially, you turn it into a json import for the new schema type (we should be able to infer most of it). Then that json becomes your baseline for future reductions?

-   Maybe json flat files are our canonical, and then we have a couple different databases (so we have baseline that's not dependent on db tech we choose).

---
-   Inputs are Assertions
-   EdgeDB? Just as the storage and to help migration

-   All that matters is that we have inputs, their ordering, and can produce a dataset from them.
-   The protocol is a description of what metadata you need to store to make this possible.

Assertions are json blobs.
Assertions have a prescribed way they are added. This includes how they are merged, how a unique Id is assigned, and how prov is tracked.

We can describe and write tests for all the different scenarios.

The output of reduction is a new json blob.

We can show examples of input assertion(s) and reduction output for all scenarios.

A universal namespace for types. Don't care about what other things do, ontologies, namespaces, etc. We just have a global type namespace. Expand it as you would any other type. It's just a type...

If we have a graphql type query engine (edged) we can generate shaped exports really easily.

Sub collections don't need to be a thing anymore. You just have an assertion that pulls from an export of another collection.

Export maps can be generic, we should name exports based on the mapping, and if it's identical, just serve the same content. Two exports with identical mapping don't need to be their own rows. I'm not sure you really even need to see how others are exporting (at least not at the table level like that...). Just see who is using the dataset?

-   Exports are just cached queries?

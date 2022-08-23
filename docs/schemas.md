# Schemas

An important first step in any data project is building the model of how you wish to represent your data. Especially in collaborative data projects, simply communicating the shape of the data involved is a major part of the challenge. In building schemas, there are two common misteps we see repeated in different groups:

## Mistep 1: Optimizing for consensus
In developing Underlay, we've spoken with many groups who have lamented the challenge of settling on a schema definition with a committee of stakeholders. We've heard anecdotes of folks spending more time in email, zoom calls, and forums debating what the ideal schema is than they did collecting the data. This creates an enormous barrier to starting work, it biases towards premature optimization, and it stymies excitement for projects. 

As such, we've prioritized a design that trades in a-priori schema consensus for simple, post-hoc usage-driven schema adjustments. Rather than forcing everyone to agree at the beginning, simply start doing what seems right, and iterate over time to find what actually promotes collaboration in practice. The best schema is the one you'll actually use. Allowing them to be fluid allows collaboration to emerge over time.

## Mistep 2: Optimizing for storage
The first time many projects need to consider their schema is when they try to insert their data into a database. The database will require a schema, and often offer techniques for optimizing queries, storage size, and other datbase-centric parameters. While this is a critical technical step, it can create a schema that is does not align with the mental model people (especially non-technical people) typically have for such data. It requires the person to thing like a computer, as opposed to letting them think like a human and have the computer adapt. 

As such, we've prioritized schema declarations that are storage-agnostic. Underlay schemas are intended to mirror the mental model people often have for a given dataset. The technical bits that allow for optimized querying and storage come at another stage in the process.

## Starting with Types
In building an Underlay schema, we advocate to begin by describing the different entities that are represented in your dataset. Are there people, cars, food, animals?
[TODO: technical dive on naming all the parts of a schema]

## Adopting common Types
Unsurprisingly, many people are interested in data about a common set of things. Many folks want to represent a person, a location, an event, etc. There exist many best practices about how to represent such things, and we believe that removing the burden of inventing a type for common things from scratch is a great way to reduce the overhead and cost of beginning a data project. 

Underlay allows you to reference a type from another schema directly. This allows you to simply compose schemas from the best practices, tailored to your use case. We expect there to be certain communities and individuals who maintain collections with the sole purpose or providing common, standardized typed for common things.

Beyond reduceing the cost of designing your schema, this also makes it trivial to interoperate with other collections that also use that type. It provides a path for the ecosystem to coalesce around agreements that both reduce the overhead and make interopability simple.
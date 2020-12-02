## Data fetching!

We have two basic goals: try to fetch everything
that you need in one query, and factor out common
logic whenever you can.

For example, lots of pages need to locate a schema or
collection based on a profileSlug and a contentSlug,
so we use findResourceWhere() in from utils that returns
a Primsa.SchemaWhereInput & Prisma.CollectionWhereInput object
(meaning we can use it for both/either of them).
On most pages, we end up needing some props for e.g. a header
component, and other props for e.g. the body content, and often
those two intersect in some sense (the content will need a
different but overlapping set of properties of the same resource
as the header). At some point we have to transform the stuff that
we get from prisma (organized "around the data") into stuff we pass
into components (organized "around the ui").
This should happen _in the client component_, and the props returned
from getServerSideProps should be organized "around the data".
This is how all data fetching frameworks (like GraphQL) are
organized, and we'll have to start thinking this way anyway if we
ever start having more complex client-side updating stuff happening.

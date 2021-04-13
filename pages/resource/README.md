## Data fetching!

We have two basic goals: try to fetch everything that you need in one query, and factor out common logic whenever you can.

On most pages, we end up needing some props for e.g. a header component, and other props for e.g. the body content, and often those two intersect in some sense (the content will need a different but overlapping set of properties of the same resource as the header). At some point we have to transform the stuff that we get from prisma (organized "around the data") into stuff we pass into components (organized "around the ui"). This transformation should happen _in the client component_, and the props returned from getServerSideProps should be organized "around the data". This is how all data fetching frameworks (like GraphQL) are organized, and we'll have to start thinking this way anyway if we ever start having more complex client-side updating stuff happening.

In general, most resource and resource mode pages are structured into three sections:

-   a `getServerSideProps` method, which fetches all the data the page needs
-   a "Page" component (named `SchemaOverviewPage`, `SchemaEditPage`, `CollectionSettingsPage`, ...). This component sets the `LocationContext.Provider` and returns the appropriate PageFrame (e.g. `SchemaPageFrame`).
-   a "Content" component (named `SchemaOverviewContent`, `SchemaEditContent`, ...). The Page component passes the Content component as a child into the page frame.

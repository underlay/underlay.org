-x Hook
-x Header
-x Footer
-x Signup Page
-x Login Page
-x Profile Page
-x Organization Page
- Signup email verification
-x File upload (S3 standup)
- discussions
- typescript cleanup
- Login/signup cleanup
- People page on community
- Community Create page and api
- Collection Create page and api


## Minimal data editor
- Create nodes (keep fields local)
- Create relationships (keep fields local)
- Fill in fields
  

## Temporary Roadmap
- Show up - have a blank grey box
- Schema Definition
  - Create a Node
    - Define it's schema
      - Define the Class's namespace
      - Define the Class's key
      - Define the Class's properties
        - Define the property's namespace 
        - Define the property's key
        - Define the property's type
        - Define the property's optionality
        - Define the property's multiplicity
        - Re-order properties
    - Format the schema into tasl
    - Consider hidden properties (e.g. a uuid set by r1)
  - Create a Relationship
    - Define it's schema
    - Implement fixed properties (source and target) which point to one or more Nodes
    - Define the Class's properties
      - ...Same sub-items as above
  - Visualize Schema
- Data manipulation
- Data explore
- Versioning
- Publication
- Importing
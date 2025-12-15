---
section_id: Accessing IYP from code
nav_order: 4
title: Setup
---

For a more systematic analysis you can access IYP via different programming
languages.
Neo4j offers a [variety of
drivers](https://neo4j.com/docs/bolt/current/neo4j-drivers/), but we will only
discuss the [Python driver](https://neo4j.com/docs/python-manual/current/) here.

First, install the driver:

```bash
# To make the setup cleaner, you can also create a virtual environment and install neo4j in there
# For Linux:
# python3 -m venv .venv
# source .venv/bin/activate
# For Windows/Mac: ¯\_(ツ)_/¯

pip install neo4j
```

To verify that the setup worked, you can run this simple script:

```python
from neo4j import GraphDatabase

URI = 'neo4j://iyp-bolt.ihr.live:7687'
AUTH = None
db = GraphDatabase.driver(URI, auth=AUTH)

db.verify_connectivity()
db.close()
```

If you run a local instance of IYP (described [in the next
section](local-instance.md)) you will need to specify a username and password
like this:

```python
URI = 'neo4j://localhost:7687'
AUTH = ('neo4j', 'password')
```

## References

* [Neo4j Python driver manual](https://neo4j.com/docs/python-manual/current/)
* [Python driver API
  documentation](https://neo4j.com/docs/api/python-driver/current/api.html)

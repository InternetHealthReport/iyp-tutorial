---
section: Accessing IYP from code
nav_order: 2
title: Simple Python example
---
There are multiple ways to query the database, but for the purpose of this tutorial, we will stick to the simplest one: [`execute_query()`](https://neo4j.com/docs/api/python-driver/current/api.html#neo4j.Driver.execute_query). You can just pass the query to this function, (almost) like you did before in the browser interface.

```python  
# Import of module and db setup excluded.

records, _, _ = db.execute_query(
    """
    MATCH (iij:AS)-[:MEMBER_OF]-(ix:IXP)
    WHERE iij.asn = 2497
    RETURN DISTINCT(ix.name) AS name
    """ 
)  
for r in records: 
    print(r['name'])  
```  

Note that there are some key differences in the query. Instead of specifying and returning a path `p`, like we did before, we only return a single property of the resulting nodes. Otherwise, we would retrieve the results in the form of a path, including all properties of all nodes and relationships, which is probably not what we are interested in. In addition, we assign a name to the result (using `AS`), which will be used as the key in the resulting dictionary.

Executing static queries is boring, so there is also the option to use placeholders (starting with `$`) in the query and pass their value via a function parameter. This example retrieves the number of IPv4 and IPv6 prefixes that IIJ originates:

```python  
query = """
    MATCH (iij:AS)-[:ORIGINATE]-(pfx:Prefix)
    WHERE iij.asn = 2497
    AND pfx.af = $address_version
    RETURN COUNT(DISTINCT pfx) AS num_prefixes
"""
records, _, _ = db.execute_query(query, address_version=4)
# execute_query always returns a list, but we know it only has one entry.
num_v4_prefixes = records[0]['num_prefixes']
records, _, _ = db.execute_query(query, address_version=6)
num_v6_prefixes = records[0]['num_prefixes']
print(f'IIJ originates {num_v4_prefixes} IPv4 and {num_v6_prefixes} IPv6 prefixes.')
```

## References

- [Neo4j Python driver manual](https://neo4j.com/docs/python-manual/current/)  
- [Python driver API documentation](https://neo4j.com/docs/api/python-driver/current/api.html)

---
nav_order: 4
title: Accessing IYP from Code
---

For a more systematic analysis you can access IYP via different programming languages. Neo4j offers a [variety of drivers](https://neo4j.com/docs/bolt/current/neo4j-drivers/), but we will only discuss the [Python driver](https://neo4j.com/docs/python-manual/current/) here.

## Setup

First, install the driver:

```bash  
`# To make the setup cleaner, you can also create a virtual environment and install neo4j in there`  
`# For Linux:`  
`# python3 -m venv .venv`  
`# source .venv/bin/activate`  
`# For Windows/Mac: ¯\_(ツ)_/¯`

`pip install neo4j`  
```

To verify that the setup worked, you can run this simple script:

```python  
`from neo4j import GraphDatabase`

`URI = 'neo4j://iyp-bolt.ihr.live:7687'`  
`AUTH = None`  
`db = GraphDatabase.driver(URI, auth=AUTH)`

`db.verify_connectivity()`  
`db.close()`  
```

If you run a local instance of IYP (described [below](#hosting-a-local-iyp-instance)) you will need to specify a username and password like this:

```python  
`URI = 'neo4j://localhost:7687'`  
`AUTH = ('neo4j', 'password')`  
```

## Simple queries from Python

There are multiple ways to query the database, but for the purpose of this tutorial, we will stick to the simplest one: [`execute_query()`](https://neo4j.com/docs/api/python-driver/current/api.html#neo4j.Driver.execute_query). You can just pass the query to this function, (almost) like you did before in the browser interface.

```python  
`# Import of module and db setup excluded.`

`records, _, _ = db.execute_query(`  
    `"""`  
    `MATCH (iij:AS)-[:MEMBER_OF]-(ix:IXP)`   
    `WHERE iij.asn = 2497`   
    `RETURN DISTINCT(ix.name) AS name`  
    `"""`  
`)`  
`for r in records:`  
    `print(r['name'])`  
```  
Note that there are some key differences in the query. Instead of specifying and returning a path `p`, like we did before, we only return a single property of the resulting nodes. Otherwise, we would retrieve the results in the form of a path, including all properties of all nodes and relationships, which is probably not what we are interested in. In addition, we assign a name to the result (using `AS`), which will be used as the key in the resulting dictionary.

Executing static queries is boring, so there is also the option to use placeholders (starting with `$`) in the query and pass their value via a function parameter. This example retrieves the number of IPv4 and IPv6 prefixes that IIJ originates:

```python  
`query = """`  
    `MATCH (iij:AS)-[:ORIGINATE]-(pfx:Prefix)`   
    `WHERE iij.asn = 2497`   
    `AND pfx.af = $address_version`  
    `RETURN COUNT(DISTINCT pfx) AS num_prefixes`  
`"""`  
`records, _, _ = db.execute_query(query, address_version=4)`  
`# execute_query always returns a list, but we know it only has one entry.`  
`num_v4_prefixes = records[0]['num_prefixes']`  
`records, _, _ = db.execute_query(query, address_version=6)`  
`num_v6_prefixes = records[0]['num_prefixes']`  
`print(f'IIJ originates {num_v4_prefixes} IPv4 and {num_v6_prefixes} IPv6 prefixes.')`  
```

## Using Pandas data frames

If your results are a bit more complex and you like working with [Pandas](https://pandas.pydata.org/) data frames, you can use the keys returned by `execute_query()` to easily load the results into a data frame. For example, to get the top 1000 ASes from AS Rank with their name as known by RIPE and their registered country according to the NRO delegated stats:

```python  
`import pandas as pd`

`# [...] database init like above`

`query = """`  
    `MATCH (a:AS)-[r:RANK {reference_name: 'caida.asrank'}]-(:Ranking)`  
    `OPTIONAL MATCH (a)-[:NAME {reference_name: 'ripe.as_names'}]-(n:Name)`  
    `OPTIONAL MATCH (a)-[:COUNTRY {reference_name: 'nro.delegated_stats'}]-(c:Country)`  
    `RETURN a.asn AS asn, r.rank AS as_rank, n.name AS name, c.country_code as country`  
    `ORDER BY as_rank`  
    `LIMIT 1000`  
`"""`

`records, _, keys = db.execute_query(query)`  
`df = pd.DataFrame(records, columns=keys)`

`# Alternatively, Neo4j can directly transform the results into a dataframe`  
`# df = db.execute_query(query, result_transformer_=neo4j.Result.to_df)`  
```

For querying IYP this is pretty much all you need to know. For more examples see the [Jupyter notebooks](https://github.com/InternetHealthReport/iyp-notebooks) we provide as part of our paper. However, you will notice that only the queries are more involved, the Python functions are the same.

## References

- [Neo4j Python driver manual](https://neo4j.com/docs/python-manual/current/)  
- [Python driver API documentation](https://neo4j.com/docs/api/python-driver/current/api.html)



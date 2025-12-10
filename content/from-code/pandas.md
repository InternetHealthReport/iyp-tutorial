---
section: Accessing IYP from code
nav_order: 3
title: Using Pandas data frames
---

If your results are a bit more complex and you like working with [Pandas](https://pandas.pydata.org/) data frames, you can use the keys returned by `execute_query()` to easily load the results into a data frame. 

For example, to get the top 1000 ASes from AS Rank with their name as known by RIPE and their registered country according to the NRO delegated stats:

```python  
import pandas as pd

# [...] database init like above

query = """
    MATCH (a:AS)-[r:RANK {reference_name: 'caida.asrank'}]-(:Ranking)
    OPTIONAL MATCH (a)-[:NAME {reference_name: 'ripe.as_names'}]-(n:Name)
    OPTIONAL MATCH (a)-[:COUNTRY {reference_name: 'nro.delegated_stats'}]-(c:Country)
    RETURN a.asn AS asn, r.rank AS as_rank, n.name AS name, c.country_code as country
    ORDER BY as_rank
    LIMIT 1000
"""

records, _, keys = db.execute_query(query)
df = pd.DataFrame(records, columns=keys)

# Alternatively, Neo4j can directly transform the results into a dataframe
# df = db.execute_query(query, result_transformer_=neo4j.Result.to_df)
```

For querying IYP this is pretty much all you need to know. For more examples see the [Jupyter notebooks](https://github.com/InternetHealthReport/iyp-notebooks) we provide as part of our paper. However, you will notice that only the queries are more involved, the Python functions are the same.

## References

- [Neo4j Python driver manual](https://neo4j.com/docs/python-manual/current/)  
- [Python driver API documentation](https://neo4j.com/docs/api/python-driver/current/api.html)

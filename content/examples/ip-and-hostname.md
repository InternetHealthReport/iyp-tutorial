---
nav_order: 2
section: Example IYP Queries 
title: IP and Hostname
gallery: true
---


Now we’ll see how to query more complex patterns and introduce other types of nodes and relationships: `IP`, `HostName`, `PART_OF`, `RESOLVES_TO`. We’ll also learn about the [Cypher Aggregating function](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/) `collect()`

## Finding popular IPs in a prefix

Some of the datasets integrated into IYP provide IP addresses and hostnames. A good example of that are the top popular websites and DNS nameservers provided by Tranco and OpenINTEL.

The query to fetch any hostnames (from any of the integrated dataset) hosted by AS2497 is:

```cypher  
MATCH (:AS {asn:2497})-[:ORIGINATE]-(pfx:Prefix)-[:PART_OF]-(:IP)-[:RESOLVES_TO]-(h:HostName) 
RETURN pfx.prefix, collect(DISTINCT h.name)
```

Note the usage of `collect` in the `RETURN` clause. This function is used to compile a list of all `HostName` names per prefix. If you use aggregation functions in the return clause, it implies (in SQL terms) a “GROUP BY” on all returned elements that are not aggregated (like pfx.prefix in this example).

However, the above query is returning only prefixes that are related to hostnames. It won’t return an empty hostname list. To list all prefixes and their corresponding hostnames (if they have any) we should break down the previous query into two parts and make one of the parts optional. Optional parts of a pattern are preceded by the keyword `OPTIONAL`, hence the previous query becomes:

```cypher  
MATCH (:AS {asn:2497})-[:ORIGINATE]-(pfx:Prefix) 
OPTIONAL MATCH (pfx)-[:PART_OF]-(:IP)-[:RESOLVES_TO]-(h:HostName)
RETURN pfx.prefix, collect(DISTINCT h.name)
```

## Finding DNS authoritative nameservers and corresponding domains

Looking at the results of the above query you may see a lot of hostnames that start with ‘ns’. Those are typically DNS nameservers. In IYP a node can have multiple types. The DNS nameservers are both `HostName` and `AuthoritativeNameServer`. Hence, the following query finds all authoritative nameservers hosted by AS2497 and the number of domains they manage.

```cypher  
MATCH (:AS {asn:2497})-[:ORIGINATE]-(pfx:Prefix)
MATCH (pfx)-[:PART_OF]-(:IP)-[:RESOLVES_TO]-(ns:AuthoritativeNameServer)
OPTIONAL MATCH (dn:DomainName)-[:MANAGED_BY]-(ns) 
RETURN ns.name, count(DISTINCT dn.name) AS nb_domains, collect(DISTINCT dn.name)
ORDER BY nb_domains DESC
```

Note the use of:
* the `count` function (similar to SQL) to count the number of domain names,  
* the `AS` keyword to name a result column,  
* the `ORDER BY` and `DESC` keywords to sort the results (similar to SQL).

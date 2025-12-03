---
nav_order: 3
title: Example IYP Queries 
---

Writing IYP queries from scratch is daunting!.. But once you can read queries, you can then easily modify existing queries. 

In the following, we conduct small studies using IYP and provide all corresponding queries. This should give you enough material to start writing your own queries. Execute these examples in the IYP console, then try tuning or combining some of the queries. Also remember to click on the database icon (top left corner in the IYP console) to see all node and relationship types and get examples by clicking on any of those.

## AS and IP Prefixes

First, we will learn about queries for finding specific prefixes and ASes. We also use these examples to explain how to use the IYP console interface and provide some tricks for making your own queries.

### **Find prefixes originated by an AS**

We start by looking at the prefixes originated by a certain AS which is represented in IYP by the \`ORIGINATE\` relationship between \`AS\` and \`Prefix\` nodes.

Here is the query to find prefixes originated by AS2497:

```cypher  
`MATCH p = (:AS {asn:2497})-[r:ORIGINATE]-(:Prefix)`   
`RETURN p`  
```

Copy/paste this query into the [IYP Console](https://iyp.iijlab.net/iyp/browser/?dbms=iyp-bolt.iijlab.net:443). You should obtain a busy graph like this:  
![][image9]

Now let’s try another query focusing only on the IPv6 prefixes. By clicking on any of the Prefix nodes you will see in the right side panel the properties of the node (if you don’t see the panel then click the ‘\<’ icon), something like this:  
![][image10]  
The \`af\` property (i.e. Address Family) tells us if the prefix is for IPv4 or IPv6. So to find all IPv6 prefixes originated by AS2497 we can filter prefixes using the \`af\` property:

```cypher  
`MATCH p = (:AS {asn:2497})-[r:ORIGINATE]-(:Prefix {af: 6})`   
`RETURN p`  
```  
Copy/paste this query into the [IYP Console](https://iyp.iijlab.net/iyp/browser/?dbms=iyp-bolt.iijlab.net:443), you should obtain another cute graph. You may wonder why there are multiple links between the same pair of nodes. This is because multiple datasets provide us with this same information. Clicking on the links you can see that the \`reference\_org\` property is different. Some are from BGPKIT, some are from Packet Clearing House and some are from IHR. IYP gives you the possibility to filter per dataset. If you want to query only data from BGPKIT, you can filter on this property (or even better on the \`reference\_name\` property which is a unique name for the dataset):

```cypher  
`MATCH p = (:AS {asn:2497})-[r:ORIGINATE]-(:Prefix {af: 6})`  
`WHERE r.reference_name = 'bgpkit.pfx2asn'`  
`RETURN p`  
```

For analysis we need the actual list of prefixes (not a cute graph). To do that we can ask Cypher to return property values instead of nodes and relationships. The following query returns a list of IPv6 prefixes originated by AS2497:

```cypher  
`MATCH (:AS {asn:2497})-[r:ORIGINATE]-(pfx:Prefix {af: 6})`  
`RETURN DISTINCT pfx.prefix`  
```  
Note the use of the keyword \`DISTINCT\` in the RETURN statement, this ensures that we retrieve only unique rows. Since we have multiple links that match this pattern the query would have returned multiple times the same prefix (try the query without \`DISTINCT\`).

Executing the above query you should see a table listing all prefixes:  
![][image11]

You can download the data in CSV or JSON format via the download icon at the top right corner.

Finally, we can also search for more complex patterns in the graph. The following query looks for prefixes that are originated by two different origin ASes. The return values are the prefix, the two origin ASes, and the \`count\` values provided by BGPKIT (the number of RIS and RouteViews peers that see the prefix/origin pair).

```cypher  
`MATCH (a:AS)-[ra:ORIGINATE {reference_org: 'BGPKIT'}]-(pfx:Prefix)-[rb:ORIGINATE {reference_org: 'BGPKIT'}]-(b:AS)`  
`WHERE a <> b`  
`RETURN DISTINCT pfx.prefix, a.asn, b.asn, ra.count, rb.count`  
`LIMIT 100`  
```

As we write more complex Cypher queries the searched pattern may become very long and hard to read. In this case we can also use multiple \`MATCH\` clauses. The following query gives the exact same results as the previous one:  
```cypher  
`MATCH (a:AS)-[ra:ORIGINATE {reference_org: 'BGPKIT'}]-(pfx:Prefix)`  
`MATCH (pfx)-[rb:ORIGINATE {reference_org: 'BGPKIT'}]-(b:AS)`  
`WHERE a<>b`  
`RETURN DISTINCT pfx.prefix, a.asn, b.asn, ra.count, rb.count`  
`LIMIT 100`  
```

### **Exercises**

1. Write a query that fetches only IPv4 prefixes.  
2. Write a query that fetches only /24 prefixes.  
3. \`ORIGINATE\` is not the only type of relationship between ASes and Prefixes. For RPKI we have the ‘ROUTE\_ORIGIN\_AUTHORIZATION’ relationship between AS and Prefix nodes.   
   Find prefixes that are announced by one AS and that have a ROA for another AS.

## IP addresses and HostNames

Now we’ll see how to query more complex patterns and introduce other types of nodes and relationships: \`IP\`, \`HostName\`, \`PART\_OF\`, \`RESOLVES\_TO\`. We’ll also learn about the [Cypher Aggregating function](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/) \`collect()\`

### **Finding popular IPs in a prefix** 

Some of the datasets integrated into IYP provide IP addresses and hostnames. A good example of that are the top popular websites and DNS nameservers provided by Tranco and OpenINTEL. 

The query to fetch any hostnames (from any of the integrated dataset) hosted by AS2497 is:

```cypher  
`MATCH (:AS {asn:2497})-[:ORIGINATE]-(pfx:Prefix)-[:PART_OF]-(:IP)-[:RESOLVES_TO]-(h:HostName)`  
`RETURN pfx.prefix, collect(DISTINCT h.name)`  
```

Note the usage of \`collect\` in the \`RETURN\` clause. This function is used to compile a list of all \`HostName\` names per prefix. If you use aggregation functions in the return clause, it implies (in SQL terms) a “GROUP BY” on all returned elements that are not aggregated (like pfx.prefix in this example).

However, the above query is returning only prefixes that are related to hostnames. It won’t return an empty hostname list. To list all prefixes and their corresponding hostnames (if they have any) we should break down the previous query into two parts and make one of the parts optional. Optional parts of a pattern are preceded by the keyword \`OPTIONAL\`, hence the previous query becomes:

```cypher  
`MATCH (:AS {asn:2497})-[:ORIGINATE]-(pfx:Prefix)`  
`OPTIONAL MATCH (pfx)-[:PART_OF]-(:IP)-[:RESOLVES_TO]-(h:HostName)`  
`RETURN pfx.prefix, collect(DISTINCT h.name)`  
```

### **Finding DNS authoritative nameservers and corresponding domains**

Looking at the results of the above query you may see a lot of hostnames that start with ‘ns’. Those are typically DNS nameservers. In IYP a node can have multiple types. The DNS nameservers are both \`HostName\` and \`AuthoritativeNameServer\`. Hence, the following query finds all authoritative nameservers hosted by AS2497 and the number of domains they manage.

```cypher  
`MATCH (:AS {asn:2497})-[:ORIGINATE]-(pfx:Prefix)`  
`MATCH (pfx)-[:PART_OF]-(:IP)-[:RESOLVES_TO]-(ns:AuthoritativeNameServer)`  
`OPTIONAL MATCH (dn:DomainName)-[:MANAGED_BY]-(ns)`  
`RETURN ns.name, count(DISTINCT dn.name) AS nb_domains, collect(DISTINCT dn.name)`  
`ORDER BY nb_domains DESC`  
```

Note the use of:

* the \`count\` function (similar to SQL) to count the number of domain names,  
* the \`AS\` keyword to name a result column,  
* the \`ORDER BY\` and \`DESC\` keywords to sort the results (similar to SQL).

## More examples

IYP integrates a lot of different datasets, more that we can cover in this tutorial. To end this part we provide a list of small queries for diverse datasets available in IYP to help you start writing your own queries.

**IXPs** and their colocation facilities:  
```cypher  
`MATCH p=(:IXP)-[r:LOCATED_IN]-(:Facility)-[:COUNTRY]-(:Country)`   
`RETURN p LIMIT 25`  
``` 

**Peering LANs** of IXPs:  
```cypher  
`MATCH p = (pfx:Prefix)-[:MANAGED_BY]-(:IXP)`  
`RETURN p LIMIT 50`  
```

The **“best” name** for AS2497:  
```cypher  
MATCH (a:AS {asn:2497})  
OPTIONAL MATCH (a)-\[:NAME {reference\_org: 'PeeringDB'}\]-\>(n1:Name)  
OPTIONAL MATCH (a)-\[:NAME {reference\_org: 'BGP.Tools'}\]-\>(n2:Name)  
OPTIONAL MATCH (a)-\[:NAME {reference\_org: 'RIPE NCC'}\]-\>(n3:Name)  
RETURN a.asn, coalesce(n1.name, n2.name, n3.name) AS name  
```

**RPKI ROAs** for prefixes not seen in BGP:  
```cypher  
`MATCH (roa_as:AS)-[:ROUTE_ORIGIN_AUTHORIZATION]-(pfx:Prefix)`  
`WHERE NOT (pfx)-[:ORIGINATE]-(:AS)`  
`RETURN pfx.prefix, roa_as.asn`  
```

**RPKI invalid prefixes** (all possible  types: RPKI Valid / RPKI Invalid / RPKI NotFound):  
```cypher  
`MATCH (pfx:Prefix)-[:CATEGORIZED]-(t:Tag)`  
`WHERE t.label = "RPKI Invalid"`  
`RETURN pfx.prefix`  
```

All the **parent domain names** of 'server.transfer.us-west-1.amazonaws.com':   
```cypher  
`MATCH p=(:DomainName {name: 'server.transfer.us-west-1.amazonaws.com'})-[:PARENT*]->()`   
`RETURN p`  
```

**Top 1k domain names** in **Tranco**:  
```cypher  
`MATCH (dn:DomainName)-[r:RANK]-(:Ranking)`  
`WHERE r.reference_name = 'tranco.top1m' AND r.rank < 1000`  
`RETURN dn.name`  
```

**Top 1k website** from **CrUX** for France and the corresponding hosting ASes:  
```cypher  
`MATCH (h:HostName)-[r:RANK]-(:Ranking)-[:COUNTRY]-(c:Country)`  
`WHERE r.rank <= 1000`  
  `AND r.reference_name = 'google.crux_top1m_country'`  
  `AND c.country_code = 'FR'`  
`MATCH (h)-[:RESOLVES_TO {reference_org:'OpenINTEL'}]-`  
  `(:IP)-[:PART_OF]-(:Prefix)-[:ORIGINATE]-(net:AS)`  
`RETURN h.name, COLLECT(DISTINCT net.asn)`  
```

Resources allocated to the same opaque ID (from **RIR’s delegated stat files**) as AS15169 (Google):  
```cypher  
`MATCH p = (:AS {asn:15169})-[:ASSIGNED]-(OpaqueID)-[:ASSIGNED]-()`  
`RETURN p`  
```

All **RIS** peers providing more than 800k IPv4 prefixes (change to \`route-views\` to see **RouteViews’** peers):  
```cypher  
`MATCH p=(rc:BGPCollector)-[peer:PEERS_WITH]-(:AS)`  
`WHERE peer.num_v4_pfxs > 800000 and rc.project = 'riperis'`  
`RETURN p`  
```

All **RIPE Atlas** measurements towards ‘google.com’ and participating probes:  
```cypher  
`MATCH msm_target = (msm:AtlasMeasurement)-[r:TARGET]-(:HostName {name:'google.com'})`  
`OPTIONAL MATCH probes = (:AtlasProbe)-[:PART_OF]-(msm)`  
`RETURN msm_target, probes`  
```

**ASes classified** as academic networks by BGP.Tools:  
```cypher  
`MATCH p=(:AS)-[r:CATEGORIZED {reference_name:'bgptools.tags'}]-`  
  `(:Tag {label:'Academic'})`  
`RETURN p LIMIT 25`  
```

**AS population** in US aggregated per AS names:  
```cypher  
MATCH (eyeball:AS)-\[pop:POPULATION\]-(c:Country)  
WHERE c.country\_code \= 'US'  
// Find the name for each AS  
OPTIONAL MATCH (eyeball)-\[:NAME {reference\_org:'BGP.Tools'}\]-(n:Name)  
// Group ASNs by name (first word of the name), list all ASNs, and the total population  
RETURN head(split(n.name,' ')), collect(eyeball.asn), sum(pop.percent) as total\_pop  
ORDER BY total\_pop DESC  
```

## Other examples online

More example queries are available at the following pages:

* [Understanding the Japanese Internet with the Internet Yellow Pages, APNIC blog](https://blog.apnic.net/2023/09/06/understanding-the-japanese-internet-with-the-internet-yellow-pages/)  
* [IYP Gallery](https://github.com/InternetHealthReport/internet-yellow-pages/blob/main/documentation/gallery.md)  
* [RiPKI: The Tragic Story of RPKI Deployment in the Web Ecosystem, HotNets’15 (reproduction)](https://github.com/InternetHealthReport/iyp-notebooks/blob/main/hotnets15-rpki/hotnets15.ipynb)  
* [Comments on DNS Robustness, IMC’18 (reproduction)](https://github.com/InternetHealthReport/iyp-notebooks/blob/main/imc18-dns/imc18.ipynb)

### **Exercise**

* Find all hostnames in IYP that ends with ‘.gov’  
* Find all hostnames in IYP that ends with ‘.gov’ and resolves to IPs in RPKI NotFound prefixes  
* Which ASes host the most popular content but are not tagged as ‘Content’ by BGP.Tools?  
* Find popular domain names managed by authoritative nameservers hosted at UCSD (AS7377) and authoritative nameservers hosted at San Diego Supercomputer Center (AS195).



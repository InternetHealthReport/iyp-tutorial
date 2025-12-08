---
nav_order: 3
section: Example IYP Queries 
title: Other Examples
gallery: true
---


IYP integrates a lot of different datasets, more that we can cover in this tutorial. To end this part we provide a list of small queries for diverse datasets available in IYP to help you start writing your own queries.

**IXPs** and their colocation facilities:  
```cypher  
MATCH p=(:IXP)-[r:LOCATED_IN]-(:Facility)-[:COUNTRY]-(:Country)   
RETURN p LIMIT 25  
```

**Peering LANs** of IXPs:  
```cypher  
MATCH p = (pfx:PeeringLAN)-[:MANAGED_BY]-(:IXP)  
RETURN p LIMIT 50  
```

The **“best” name** for AS2497:  
```cypher  
MATCH (a:AS {asn:2497})  
OPTIONAL MATCH (a)-[:NAME {reference_org: 'PeeringDB'}]->(n1:Name)  
OPTIONAL MATCH (a)-[:NAME {reference_org: 'BGP.Tools'}]->(n2:Name)  
OPTIONAL MATCH (a)-[:NAME {reference_org: 'RIPE NCC'}]->(n3:Name)  
RETURN a.asn, coalesce(n1.name, n2.name, n3.name) AS name  
```

Ten **RPKI ROAs** for prefixes not seen in BGP:  
```cypher  
MATCH (roa_as:AS)-[:ROUTE_ORIGIN_AUTHORIZATION]-(rpfx:RPKIPrefix)
WHERE NOT (rpfx)-[:PART_OF]-(:BGPPrefix {prefix: rpfx.prefix})
RETURN rpfx.prefix, roa_as.asn
LIMIT 10
```

**RPKI invalid prefixes** (all possible  types: RPKI Valid / RPKI Invalid / RPKI Invalid,more-specific / RPKI NotFound):  
```cypher  
MATCH (pfx:BGPPrefix)-[:CATEGORIZED]-(t:Tag)  
WHERE t.label STARTS WITH "RPKI Invalid"  
RETURN pfx.prefix, t.label 
```

All the **parent domain names** of 'server.transfer.us-west-1.amazonaws.com':   
```cypher  
MATCH p=(:DomainName {name: 'server.transfer.us-west-1.amazonaws.com'})-[:PARENT*]->()   
RETURN p  
```

**Top 1k domain names** in **Tranco**:  
```cypher  
MATCH (dn:DomainName)-[r:RANK]-(:Ranking {name: "Tranco top 1M"})  
WHERE r.rank < 1000  
RETURN dn.name
```

**Top 1k website** from **CrUX** for France and the corresponding hosting ASes:  
```cypher  
// Find the CRuX Rankings for France
MATCH (ra:Ranking)-[cr:COUNTRY]-(c:Country)
WHERE c.country_code = 'FR' AND cr.reference_name = 'google.crux_top1m_country'
// Find the top 1k
MATCH (h:HostName)-[r:RANK]-(ra)
WHERE r.rank <= 1000
// Find originating ASes
MATCH (h)-[re:RESOLVES_TO]-(:IP)-[:PART_OF]-(:BGPPrefix)-[:ORIGINATE]-(net:AS)  
WHERE re.reference_name = 'openintel.crux'
RETURN h.name, COLLECT(DISTINCT net.asn)
```

Resources allocated to the same opaque ID (from **RIR’s delegated stat files**) as AS15169 (Google):  
```cypher  
MATCH p = (:AS {asn:15169})-[:ASSIGNED]-(OpaqueID)-[:ASSIGNED]-()  
RETURN p  
```

All **RIS** peers providing more than 800k IPv4 prefixes (change to `route-views` to see **RouteViews’** peers):  
```cypher  
MATCH p=(rc:BGPCollector)-[peer:PEERS_WITH]-(:AS)  
WHERE peer.num_v4_pfxs > 800000 and rc.project = 'riperis'  
RETURN p  
```

All **RIPE Atlas** measurements towards ‘google.com’ and participating probes:  
```cypher  
MATCH msm_target = (msm:AtlasMeasurement)-[r:TARGET]-(:HostName {name:'google.com'})  
OPTIONAL MATCH probes = (:AtlasProbe)-[:PART_OF]-(msm)  
RETURN msm_target, probes  
```

**ASes classified** as academic networks by BGP.Tools:  
```cypher  
MATCH p=(:AS)-[r:CATEGORIZED {reference_name:'bgptools.tags'}]-(:Tag {label:'Academic'})  
RETURN p LIMIT 25  
```

**AS population** in US aggregated per AS names:  
```cypher  
MATCH (eyeball:AS)-[pop:POPULATION]-(c:Country)  
WHERE c.country_code = 'US'  
// Find the name for each AS  
OPTIONAL MATCH (eyeball)-[:NAME {reference_org:'bgp.tools'}]-(n:Name)  
// Group ASNs by name (first word of the name), list all ASNs, and the total population  
RETURN head(split(n.name,' ')), collect(eyeball.asn), sum(pop.percent) as total_pop  
ORDER BY total_pop DESC  
```

## Other examples online

More example queries are available at the following pages:

* [Understanding the Japanese Internet with the Internet Yellow Pages, APNIC blog](https://blog.apnic.net/2023/09/06/understanding-the-japanese-internet-with-the-internet-yellow-pages/)  
* [IYP Gallery](https://github.com/InternetHealthReport/internet-yellow-pages/blob/main/documentation/gallery.md)  
* [RiPKI: The Tragic Story of RPKI Deployment in the Web Ecosystem, HotNets’15 (reproduction)](https://github.com/InternetHealthReport/iyp-notebooks/blob/main/hotnets15-rpki/hotnets15.ipynb)  
* [Comments on DNS Robustness, IMC’18 (reproduction)](https://github.com/InternetHealthReport/iyp-notebooks/blob/main/imc18-dns/imc18.ipynb)

## Exercises

* Find all hostnames in IYP that ends with ‘.gov’  
* Find all hostnames in IYP that ends with ‘.gov’ and resolves to IPs in RPKI NotFound prefixes  
* Which ASes host the most popular content but are not tagged as ‘Content’ by BGP.Tools?  
* Find popular domain names managed by authoritative nameservers hosted at UCSD (AS7377) and authoritative nameservers hosted at San Diego Supercomputer Center (AS195).



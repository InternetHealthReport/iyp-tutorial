---
nav_order: 8
title: Exercises
---

{% capture text %}
**Tips**

* Use the [IYP
  documentation](https://github.com/InternetHealthReport/internet-yellow-pages/tree/main/documentation)
  including:
  * the different types of
    [nodes](https://github.com/InternetHealthReport/internet-yellow-pages/blob/main/documentation/node-types.md)
    and
    [relationships](https://github.com/InternetHealthReport/internet-yellow-pages/blob/main/documentation/relationship-types.md)
    available,
  * the list of [all integrated
    datasets](https://github.com/InternetHealthReport/internet-yellow-pages/blob/main/documentation/data-sources.md).
* See also the [IYP cheatsheet](/content/cheatsheet).
* Always add `LIMIT 10` at the end of your query when you are experimenting.
{% endcapture %}
{% include alert.html text=text color=secondary %}

## IXPs

{% capture question %}
Find the top 10 IXPs in terms of members.
{% endcapture %}
{% capture solution %}

```cypher
MATCH (m:AS)-[:MEMBER_OF]->(i:IXP)
RETURN i.name AS ixp_name, count(DISTINCT m) as num_members
ORDER BY num_members DESC
LIMIT 10
```

{% endcapture %}
{% include question.html
    id="ixp-0"
    text=question
    solution=solution
%}

{% capture question %}
Find the top 10 ASes in terms of IXP membership.
{% endcapture %}
{% capture solution %}

```cypher
MATCH (m:AS)-[:MEMBER_OF]->(i:IXP)
RETURN m.asn AS asn, count(DISTINCT i) as num_ixps
ORDER BY num_ixps DESC
LIMIT 10
```

{% endcapture %}
{% include question.html
    id="ixp-1"
    text=question
    solution=solution
%}

{% capture question %}
Which are the top 10 IXPs for which CAIDA reports more members than PeeringDB?

*Note: IXP data provided by CAIDA is an aggregation of PeeringDB, PCH, and HE
data.*

**Bonus:** for **some** of these ASes we have looking glass information too
(`reference_org: 'Alice-LG'`).
Show also the counts from the looking glass.

{% endcapture %}
{% capture solution %}

```cypher
MATCH (c:AS)-[:MEMBER_OF {reference_org: 'CAIDA'}]->(i:IXP)
MATCH (p:AS)-[:MEMBER_OF {reference_org: 'PeeringDB'}]->(i)
WITH i.name AS ixp_name, count(DISTINCT c) AS num_members_caida, count(DISTINCT p) AS num_members_pdb
WHERE num_members_caida > num_members_pdb
RETURN ixp_name, num_members_caida, num_members_pdb
ORDER BY num_members_caida DESC
LIMIT 10
```

**Bonus:**

```cypher
MATCH (c:AS)-[:MEMBER_OF {reference_org: 'CAIDA'}]->(i:IXP)
MATCH (p:AS)-[:MEMBER_OF {reference_org: 'PeeringDB'}]->(i)
OPTIONAL MATCH (lg_member:AS)-[:MEMBER_OF {reference_org: 'Alice-LG'}]->(i)
WITH i.name AS ixp_name, count(DISTINCT c) AS num_members_caida, count(DISTINCT p) AS num_members_pdb, count(DISTINCT lg_member) AS num_members_lg
WHERE num_members_caida > num_members_pdb
RETURN ixp_name, num_members_caida, num_members_pdb, num_members_lg
ORDER BY num_members_caida DESC
LIMIT 10
```

The query above is very slow.
You can optimize it by only searching for looking glass information for IXPs
that will be included in the output:

```cypher
MATCH (c:AS)-[:MEMBER_OF {reference_org: 'CAIDA'}]->(i:IXP)
MATCH (p:AS)-[:MEMBER_OF {reference_org: 'PeeringDB'}]->(i)
WITH i, count(DISTINCT c) AS num_members_caida, count(DISTINCT p) AS num_members_pdb
WHERE num_members_caida > num_members_pdb
ORDER BY num_members_caida DESC
LIMIT 10
OPTIONAL MATCH (lg_member:AS)-[:MEMBER_OF {reference_org: 'Alice-LG'}]->(i)
RETURN i.name AS ixp_name, num_members_caida, num_members_pdb, count(DISTINCT lg_member) AS num_members_lg
```

{% endcapture %}
{% capture solution2 %}

```cypher
MATCH (c:AS)-[:MEMBER_OF {reference_org:'CAIDA'}]->(i:IXP)
MATCH (p:AS)-[:MEMBER_OF {reference_org:'PeeringDB'}]->(i)
RETURN i.name AS ixp_name, count(DISTINCT p) AS num_members_pdb, count(DISTINCT c) AS num_members_caida, abs(count(DISTINCT c) - count(DISTINCT p)) AS diff
ORDER BY diff DESC
LIMIT 10
```

{% endcapture %}
{% include question.html
    id="ixp-2"
    text=question
    solution=solution
    solution2=solution2
%}

{% capture question %}
Which are the top 10 IXPs having the most members from a different country?

Hint: there is a `COUNTRY` relationship between `IXP` and `Country` nodes, and
`AS` and `Country` nodes.
This may mean different things (e.g., AS registered in a country, AS
"geolocated" to a country etc.).
First try with `reference_org: 'PeeringDB'` for IXPs and `reference_org: 'NRO'`
for ASes.
{% endcapture %}
{% capture solution %}

```cypher
MATCH (i:IXP)-[:COUNTRY {reference_org: 'PeeringDB'}]->(i_c:Country)
MATCH (m_c:Country)<-[:COUNTRY {reference_org: 'NRO'}]-(m:AS)-[:MEMBER_OF]->(i)
WHERE i_c <> m_c
RETURN i.name AS ixp_name, count(DISTINCT m) AS num_members_diff_country
ORDER BY num_members_diff_country DESC
LIMIT 10
```

{% endcapture %}
{% include question.html
    id="ixp-3"
    text=question
    solution=solution
%}

## RIPE Atlas

{% capture question %}
Find the top 10 ASes (or countries) hosting the most Atlas probes.

**Bonus:** Can you do the same but counting only “Connected” probes?
{% endcapture %}
{% capture solution %}

ASes:

```cypher
MATCH (p:AtlasProbe)-[:LOCATED_IN]->(a:AS)
RETURN a.asn AS asn, count(DISTINCT p) AS num_probes
ORDER BY num_probes DESC
LIMIT 10
```

Countries:

```cypher
MATCH (p:AtlasProbe)-[:COUNTRY]->(c:Country)
RETURN c.name AS country, count(DISTINCT p) AS num_probes
ORDER BY num_probes DESC
LIMIT 10
```

Only connected probes:

```cypher
MATCH (p:AtlasProbe {status_name: 'Connected'})-[:LOCATED_IN]->(a:AS)
RETURN a.asn AS asn, count(DISTINCT p) AS num_probes
ORDER BY num_probes DESC
LIMIT 10
```

{% endcapture %}
{% include question.html
    id="atlas-0"
    text=question
    solution=solution
%}

{% capture question %}
Find the top 10 “Connected” probes that are part of the largest number of
measurements.

Return the id, type, and description of the probe.
{% endcapture %}
{% capture solution %}

```cypher
MATCH (p:AtlasProbe {status_name: 'Connected'})-[:PART_OF]->(m:AtlasMeasurement)
RETURN p.id AS prb_id, p.type AS prb_type, p.description AS prb_description, count(DISTINCT m) AS num_measurements
ORDER BY num_measurements DESC
LIMIT 10
```

{% endcapture %}
{% include question.html
    id="atlas-1"
    text=question
    solution=solution
%}

{% capture question %}
Find hostnames targeted by more than 20 different Atlas measurements.

Hint: see the Cypher `WITH` clause.
{% endcapture %}
{% capture solution %}

```cypher
MATCH (m:AtlasMeasurement)-[:TARGET]->(h:HostName)
WITH h.name as hostname, count(DISTINCT m) as num_measurements
WHERE num_measurements > 20
RETURN hostname, num_measurements
ORDER BY num_measurements DESC
```

{% endcapture %}
{% include question.html
    id="atlas-2"
    text=question
    solution=solution
%}

{% capture question %}
What are the countries with the highest population/#probes ratio?

Hint: Total population of a country is available in the relation:

```cypher
(:Country)-[:POPULATION {reference_org: 'WorldBank'}]-(:Estimate)
```

You can first aggregate the number of probes per country with a `WITH` clause.
{% endcapture %}
{% capture solution %}

```cypher
MATCH (p:AtlasProbe)-[:COUNTRY]->(c:Country)
WITH c, count(p) AS num_probes
MATCH (c)-[pop:POPULATION {reference_org: 'WorldBank'}]->(:Estimate)
RETURN c.name AS country, num_probes, pop.value AS population, pop.value / num_probes AS pop_probes_ratio
ORDER BY pop_probes_ratio DESC
```

Without `WITH`:

```cypher
MATCH (p:AtlasProbe)-[:COUNTRY]->(c:Country)
    -[pop:POPULATION {reference_org: 'WorldBank'}]->(:Estimate)
RETURN c.name AS country, count(p) AS num_probes, pop.value AS population, pop.value / count(p) AS pop_probes_ratio
ORDER BY pop_probes_ratio DESC
```

{% endcapture %}
{% include question.html
    id="atlas-3"
    text=question
    solution=solution
%}

## Content (Google CrUX)

{% capture question %}
Find the top 1k websites in Denmark.
{% endcapture %}
{% capture solution %}

```cypher
MATCH (h:HostName)-[r:RANK {reference_name: 'google.crux_top1m_country'}]->(:Ranking)
    -[:COUNTRY]->(:Country {country_code: 'DK'})
WHERE r.rank <= 1000
RETURN h.name AS hostname
```

{% endcapture %}
{% include question.html
    id="crux-0"
    text=question
    solution=solution
%}

{% capture question %}
Find in the top 10k websites in Denmark that are accessed via HTTP (not HTTPS).

Hint: the `RANK` relationship has a property that contains the whole URL.
{% endcapture %}
{% capture solution %}

```cypher
MATCH (h:HostName)-[r:RANK {reference_name: 'google.crux_top1m_country'}]->(:Ranking)
    -[:COUNTRY]->(:Country {country_code: 'DK'})
WHERE r.rank <= 10000
AND r.origin STARTS WITH 'http:'
RETURN h.name AS hostname
```

{% endcapture %}
{% include question.html
    id="crux-1"
    text=question
    solution=solution
%}

{% capture question %}
Find which ASes host the largest number of the top 1k popular websites in
Denmark.
{% endcapture %}
{% capture solution %}

```cypher
MATCH (a:AS)-[:ORIGINATE]->(:BGPPrefix)
  <-[:PART_OF]-(:IP)
  <-[:RESOLVES_TO]-(h:HostName)
  -[r:RANK {reference_name: 'google.crux_top1m_country'}]->(:Ranking)
  -[:COUNTRY]->(:Country {country_code: 'DK'})
WHERE r.rank <= 1000
RETURN a.asn AS asn, count(DISTINCT h) AS num_websites
ORDER By num_websites DESC
```

{% endcapture %}
{% capture solution2 %}

```cypher
MATCH (h:HostName)-[r:RANK {reference_name:'google.crux_top1m_country'}]-(:Ranking)
  -[:COUNTRY]-(:Country {country_code:'DK'})
WHERE r.rank <= 1000
WITH h
MATCH (h)-[:RESOLVES_TO]->(:IP)-[:PART_OF]->(:BGPPrefix)<-[:ORIGINATE]-(a:AS)
RETURN a.asn AS asn, count(DISTINCT h) AS num_websites
ORDER BY num_websites DESC
```

{% endcapture %}
{% include question.html
    id="crux-2"
    text=question
    solution=solution
    solution2=solution2
%}

{% capture question %}
In how many countries is `www.google.com` in the top 1k most popular websites?
{% endcapture %}
{% capture solution %}

```cypher
MATCH (:HostName {name: 'www.google.com'})-[r:RANK {reference_name: 'google.crux_top1m_country'}]->(:Ranking)
  -[:COUNTRY]->(c:Country)
WHERE r.rank <= 1000
RETURN count(c) AS num_countries
```

{% endcapture %}
{% include question.html
    id="crux-3"
    text=question
    solution=solution
%}

{% capture question %}
How many websites appear only in the top 1k of one country (websites popular in
only one country)?

Hint: see the Cypher `WITH` clause to count the number of countries.
{% endcapture %}
{% capture solution %}

Simple:

```cypher
MATCH (h:HostName)-[r:RANK {reference_name: 'google.crux_top1m_country'}]->(ran:Ranking)
-[:COUNTRY]->(c:Country)
WHERE r.rank <= 1000
WITH h, count(DISTINCT c) AS num_countries
WHERE num_countries = 1
RETURN count(h) AS num_websites
```

Better performance with cheating by using the country code in the `RANK`
relationship (avoids matching `Country` nodes):

```cypher
MATCH (h:HostName)-[r:RANK {reference_name: 'google.crux_top1m_country'}]->(:Ranking)
WHERE r.rank <= 1000
WITH h, count(DISTINCT r.country_code) AS num_countries
WHERE num_countries = 1
RETURN count(h) AS num_websites
```

{% endcapture %}
{% include question.html
    id="crux-4"
    text=question
    solution=solution
%}

## Routing

{% capture question %}
Which AS announces the largest number of IPv4 prefixes? IPv6 prefixes?

**Bonus:** Do the same but for hyper-specific prefixes, i.e., /25 and smaller
for IPv4 and /49 and smaller for IPv6.

*Hint:* look at the properties of the `Prefix` nodes.
{% endcapture %}
{% capture solution %}

IPv4 (use `af: 6` for IPv6):

```cypher
MATCH (a:AS)-[:ORIGINATE]->(p:BGPPrefix {af: 4})
RETURN a.asn AS asn, count(DISTINCT p) as num_pfx
ORDER BY num_pfx
LIMIT 1
```

Hyper-specific prefixes (use `af: 6` and `prefixlen < 48` for IPv6):

```cypher
MATCH (a:AS)-[:ORIGINATE]->(p:BGPPrefix {af: 4})
WHERE p.prefixlen < 24
RETURN a.asn AS asn, count(DISTINCT p) as num_pfx
ORDER BY num_pfx DESC
LIMIT 1
```

{% endcapture %}
{% include question.html
    id="routing-0"
    text=question
    solution=solution
%}

{% capture question %}
Find 10 prefixes that are originated by more than one AS (multi-origin
prefixes).

**Bonus:** Find prefixes that are originated by more than 10 ASes and the number
of origins.
{% endcapture %}
{% capture solution %}

Normal:

```cypher
MATCH (a:AS)-[:ORIGINATE]->(p:Prefix)<-[:ORIGINATE]-(b:AS)
WHERE a <> b
RETURN p.prefix
LIMIT 10
```

Bonus:

```cypher
MATCH pa = (a:AS)-[:ORIGINATE]->(p:Prefix)<-[:ORIGINATE]-(b:AS)
WHERE a <> b
WITH p.prefix AS prefix, count(DISTINCT a) AS num_origins
WHERE num_origins > 10
RETURN prefix, num_origins
ORDER BY num_origins DESC
```

{% endcapture %}
{% include question.html
    id="routing-1"
    text=question
    solution=solution
%}

{% capture question %}
Find the 10 ASes that peer with the most ASes (according to BGP data) in IPv4 /
IPv6.
{% endcapture %}
{% capture solution %}

IPv4 (use `af: 6` for IPv6):

```cypher
MATCH (a:AS)-[:PEERS_WITH {af: 4}]-(b:AS)
RETURN a.asn AS asn, count(DISTINCT b) AS num_peers
ORDER BY num_peers DESC
LIMIT 10
```

{% endcapture %}
{% include question.html
    id="routing-2"
    text=question
    solution=solution
%}

{% capture question %}
Find the 10 ASes that peer with the most RIPE RIS and RouteViews collectors.
{% endcapture %}
{% capture solution %}

```cypher
MATCH (a:AS)-[:PEERS_WITH]-(rc:BGPCollector)
RETURN a.asn AS asn, count(DISTINCT rc) AS num_rc_peers
ORDER BY num_rc_peers DESC
LIMIT 10
```

{% endcapture %}
{% include question.html
    id="routing-3"
    text=question
    solution=solution
%}

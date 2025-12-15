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

* Find the top 10 IXPs in terms of members.
* Find the top 10 ASes in terms of IXP membership.
* What are the top 10 IXPs for which CAIDA reports more members than PeeringDB?
  * Note: IXP data provided by CAIDA is an aggregation of PeeringDB, PCH, and HE
    data
  * Show the total number of members as reported by CAIDA and PeeringDB.
  * Bonus: for **some** of these ASes we have looking glass information too
    (`reference_org: 'Alice-LG'`).
    Show also the counts from the looking glass.
* Which are the top 10 IXPs having the most members from a different country?
  * Hint: there is a `COUNTRY` relationship between `IXP` and `Country` nodes,
    and `AS` and `Country` nodes.
    This may mean different things (e.g., AS registered in a country, AS
    "geolocated" to a country etc.).
    First try with `reference_org: 'PeeringDB'` for IXPs and `reference_org:
    'NRO'` for ASes.

## RIPE Atlas

* Find the top 10 ASes (or countries) hosting the most Atlas probes.
* Can you do the same but counting only “Connected” probes?
* Find the top 10 “Connected” probes that are part of the largest number of
  measurements.
  * Display the type of the probe and its description.
* Find hostnames targeted by more than 20 different Atlas measurements.
  * Hint: see the Cypher `WITH` clause.
* What are the countries with the highest population/#probes ratio?
  * Hint: Total population of a country is available in the relation:
    `(:Country)-[:POPULATION {reference_org: 'WorldBank'}]-(:Estimate)`.
  * You can first aggregate the number of probes per country with a `WITH`
    clause.

## Content (Google CrUX)

* Find the top 1k websites in Denmark.
* Find in the top 10k websites in Denmark that are accessed via HTTP (not
  HTTPS).
  * Hint: the `RANK` relationship has a property that contains the whole URL.
* Find which ASes host the largest number of the top 1k popular websites in
  Denmark.
* In how many countries is `www.google.com` in the top 1k most popular websites?
* How many websites appear only in the top 1k of one country (websites popular
  in only one country)?
  * Hint: see the Cypher `WITH` clause to count the number of countries.

## Routing

* Which AS announces the largest number of IPv4 prefixes? IPv6 prefixes?
  * Do the same but ignoring IPv4 prefixes smaller than /24 and IPv6 prefixes
    smaller than /48.
  * Hint: look at the properties of the `Prefix` nodes.
* Find 10 prefixes that are originated by more than one AS.
* Which ASes peer with the most ASes (according to BGP data) in IPv4? IPv6?
* Which ASes peer with the most RIPE RIS and RouteViews collectors?

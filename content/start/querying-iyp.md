---
section: Get Started with IYP
nav_order: 3
title: Cypher - Querying IYP
gallery: true
---

The main advantage of IYP is the possibility to query all available datasets at once. The learning curve is quite steep, though. It requires you to be familiar with how datasets are modelled in IYP and the Cypher querying language. We’ll cover the basics of Cypher here.

{% capture text %}
**Documentation**

The [IYP documentation](https://github.com/InternetHealthReport/internet-yellow-pages/tree/main/documentation) contains complementary information that is essential for writing queries. 
There you will find:

* the different types of [nodes](https://github.com/InternetHealthReport/internet-yellow-pages/blob/main/documentation/node-types.md) and [relationships](https://github.com/InternetHealthReport/internet-yellow-pages/blob/main/documentation/relationship-types.md) available,  
* the list of [all integrated datasets](https://github.com/InternetHealthReport/internet-yellow-pages/blob/main/documentation/data-sources.md),  
* see also the [IYP cheatsheet](https://docs.google.com/presentation/d/1UyeSFOIXCvM7CKXclT9vxgHcJxOAFX4mGc2eVCsLkLs/edit?usp=sharing)
{% endcapture %}
{% include alert.html text=text color=secondary %}


## **IYP console** {#iyp-console}

The easiest way to execute IYP queries is to use IYP’s public instance:

1. Go to the [IYP console](https://iyp.iijlab.net/iyp/browser/?dbms=iyp-bolt.iijlab.net:443).  
2. Click on the ‘Connect’ button (no username or password required).  
3. And before you continue we recommend you to turn off the `Connect result nodes` option in the settings available from the cogwheel at bottom left.

{% include gallery-figure.html img="images/start/iyp-console.png" alt="IYP console" caption="There is no username/password required to connect to the <a href='https://iyp.iijlab.net/iyp/browser/?dbms=iyp-bolt.iijlab.net:443'>IYP console</a>. Make sure you uncheck the `Connect result nodes` option in the settings." width="75%" %}


The [IYP console](https://iyp.iijlab.net/iyp/browser/?dbms=iyp-bolt.iijlab.net:443) provides a summary of the database which is quite handy when writing queries. At the top left there is a database icon that shows all types of nodes and relationships available in the database. Clicking on a node or relationship type displays examples.

{% include gallery-figure.html img="images/start/console-sidebar.png" alt="IYP console sidebar" caption="The top left tab in the <a href='https://iyp.iijlab.net/iyp/browser/?dbms=iyp-bolt.iijlab.net:443'>IYP console</a> displays all types of nodes and relationships available in the database. Click on one of those to see examples." width="75%" %}

## **Hello world**

You are ready for your first query. Copy/paste the below query in the top input box (next to `neo4j$`) and click the play button.

```cypher  
MATCH p = (:AS)--(n:Name) WHERE n.name CONTAINS 'Hello' RETURN p  
```

You should see something similar to this (click on the node labels at the top right corner to change the node’s color and select the property which should be used as the caption of the node):

{% include gallery-figure.html img="images/start/hello-results.png" alt="Results for the Hello World query." caption="Results for the Hello World query." width="75%" %}


This graph shows ASes that contain the word ‘Hello’ in their name. If you see a lot more links that means you haven’t un-checked the `Connect result nodes` option in the settings (**please uncheck that option!**).

## **Cypher 101**

Cypher is the main language used to query IYP. It has some similarities with SQL but it is designed to query graph databases. That means instead of looking for rows in tables, a Cypher query describes patterns to find in a graph.

The pattern is given in an ASCII art representation where nodes are depicted by a pair of parentheses, `( )`, and relationships are depicted with two dashes `--` sometimes including more information in square brackets `-[]-`.

{% include gallery-figure.html img="images/start/cypher-ascii.png" alt="Cypher’s ASCII representation of graphs." caption="Cypher’s ASCII representation of graphs." width="75%" %}

The simplest pattern we can look for is a node. The below query finds the AS node with ASN 2497 (try it in the IYP console\!):

```cypher  
MATCH (iij:AS)  
WHERE iij.asn = 2497  
RETURN iij  
``` 

Now let’s see how the query works:

- The `MATCH` clause defines the pattern to find in the graph.  
- `(iij:AS)` is the pattern we are looking for. The parenthesis show that it is a node, `iij` is an arbitrary variable to refer to that node later in the query, and the type of node is given after the colon.  
- The WHERE clause describes conditions for nodes or relationships that match the pattern. Here we specify that the node called iij should have a property `asn` that equals 2497\.  
- The `RETURN` clause describes the data we want to extract from the found patterns. Here we return `iij` the node that satisfies both the `MATCH` and `WHERE` clauses.

Another way to specify the condition for the node property is to set it within the search pattern. For example the following query returns exactly the same results as the above one:

```cypher  
MATCH (iij:AS {asn: 2497})  
RETURN iij  
```   
This is a more compact form, but really it doesn’t make a difference for the final result.

Slightly more complicated, the below query finds which IXPs AS2497 is a member of:

```cypher  
MATCH p = (iij:AS)-[:MEMBER_OF]-(:IXP)   
WHERE iij.asn = 2497   
RETURN p  
```

Thus `(iij:AS)-[:MEMBER_OF]-(:IXP)` describes a path that starts from a node we call iij that connects to another node typed `IXP`.  
Similar to the node type, the type of a relationship is given after the colon, for example `-[:MEMBER_OF]-` is a relationship of type “member of”.

This query is also using a handy trick. Instead of assigning a variable for every node and relationship in the query, it uses one variable `p` that contains the whole pattern and specifies only `p` in the RETURN clause.

If needed we can assign variables to relationships and filter on their properties. For example, this query finds which IXPs AS2497 is a member of but not from PeeringDB data (the operator for inequality is `<>`):

```cypher  
MATCH p = (iij:AS)-[mem:MEMBER_OF]-(:IXP)  
WHERE iij.asn = 2497 AND mem.reference_org <> 'PeeringDB'   
RETURN p  
```

## More Cypher

We don’t have the intention to cover the whole Cypher language in this tutorial. Cypher contains all operators you may expect from a modern querying language, including [aggregating functions](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/), [OPTIONAL MATCH](https://neo4j.com/docs/cypher-manual/current/clauses/optional-match/) for patterns with optional parts, and many other [clauses](https://neo4j.com/docs/cypher-manual/current/clauses/).

The [Cypher tutorial](https://neo4j.com/docs/getting-started/appendix/tutorials/guide-cypher-basics/) and [Cypher documentation](https://neo4j.com/docs/cypher-manual/current/introduction/) are the more comprehensive places you should refer to when crafting your queries.

Also, in the IYP console the `:help` command provides documentation to any Cypher clause. Try `:help MATCH` or `:help cypher` in the IYP console. 

## More Cypher Hints

* Double click on a node in the UI to see its neighbors and links. The number of displayed nodes is limited, you can increase this limit in the settings (bottom left cog wheel).  
* Add `LIMIT 10` at the end of your queries when experimenting.  
* Add comments in your queries: Single line comments starting with `//` or multiple line comments using `/*` `*/`.

## A Comment on Code Autocompletion

While typing queries in the IYP console, you will see prompts of autocompletion, e.g., for node labels. Please be aware that these are not intelligent and simply represent the entire graph schema. For example, if you start a query for an `AS` node and want to filter on a property:

```cypher  
MATCH p = (:AS { 
```

the console will simply show a list of all properties available in the graph, even if they are not available for `AS` nodes. In terms of Cypher this is not a problem, so this example would be a (syntactically) valid query:

```cypher  
MATCH p = (:AS {country_code: 'JP'})
RETURN p 
```

However, this query would return no results, since there is no `AS` node with the `country_code` property. So just be aware of this and do not rely on autocompletion too much!



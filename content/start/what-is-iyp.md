---
section_id: Get Started with IYP
nav_order: 2
title: What is IYP?
---

The Internet Yellow Pages (IYP) is a graph database composed of over 60 Internet measurement datasets. 
IYP has been designed to facilitate the exploration and analysis of these datasets. 

IYP is built on Neo4j, a graph database management system, which means that data is stored and queried through graph structures. 
Neo4j’s query language is called Cypher and all programmatic interaction with IYP will require basic understanding of Cypher. 
In this tutorial we provide a Cypher overview and example queries for analyzing IYP data.

More details on the design of IYP can be found in the paper “[The Wisdom of the Measurement Crowd: Building the Internet Yellow Pages a Knowledge Graph for the Internet](https://www.iijlab.net/en/members/romain/pdf/romain_imc2024.pdf).”   

{% capture text %}
**Disclaimer**

* Data quality: IYP makes no changes to imported datasets. **Users should be aware of the original datasets’ limitations** to accurately interpret results and maximize the utility of IYP.  
* Feedback: Report erroneous data found in IYP directly to the data providers, so that the original dataset can be fixed, the changes will be reflected in following IYP snapshots.  
* Citation: If you publish work/tools based on IYP cite the original dataset used (and the [IYP paper](https://www.iijlab.net/en/members/romain/pdf/romain_imc2024.bib)\!).  
* Heavy duty: For large scale analysis installing a local instance of IYP is recommended.  
* Temporal analysis: IYP is not suitable for timely analysis and longitudinal analysis.
{% endcapture %}
{% include alert.html text=text color=secondary %}


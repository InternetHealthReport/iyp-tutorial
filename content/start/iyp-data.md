---
section: Get Started with IYP
nav_order: 2
title: Overview of IYP data
gallery: true
---


Given the diversity of datasets integrated into IYP, one of the first difficulties when working with IYP is to get an overview of the data that is available.
We cover these with the two following sections:

* [Internet Health Report](#internet-health-report) (IHR) provides a high level web interface based on most important IYP datasets.  
* [IYP data modeling](#iyp-data-modelling) provides an overview of the underlying data model.  

## Internet Health Report {#internet-health-report}

The easiest way to browse the IYP database is to visit the [Internet Health Report website](https://www.ihr.live). There you can search for an Internet resource (e.g. AS, prefix, domain name) and get IYP data related to that resource.

1. Enter the resource into the **search field** in the top left corner.  
2. Selecting the **Routing**, **DNS**, **Peering**, **Registration**, or **Rankings** tabs.    
   1. The time series **Monitor** tab is external to the IYP.  
      
{% include gallery-figure.html img="images/start/ihr-website.png" alt="IHR website" caption="IYP routing data shown on <a href='https://www.ihr.live/en/network/AS2497?active=routing'>IHR website</a>." width="75%" %}

The above figure illustrates the ‘routing’ tab for the Internet Initiative Japan network (AS2497). All other tabs (except the ‘monitoring’ one) are providing IYP data via different widgets. 

For each widget, you’ll find a *chart, data, Cypher query*, and a *metadata* tabs. 

* The Chart tab shows a visual representation of the data.  
* The Data tab gives the raw data in a table format.   
* **And the Cypher Query tab gives you the exact query we used to pull the data from IYP. You can reuse that to query directly the IYP database or craft your own queries.** More on [how to write your own query in the next section](querying-iyp). 
* The Metadata tab gives links to the original datasets and the freshness of the data. 

## IYP data modelling {#iyp-data-modelling}

Under the hood IYP is stored in a graph database where nodes represent mostly Internet resources and links give relationships between them. To do that we had to model all datasets integrated to IYP as graphs. For some datasets it makes a lot of sense, for some it may seem counter-intuitive. In any cases IYP’s github repository (the [iyp/crawler folder](https://github.com/InternetHealthReport/internet-yellow-pages/tree/main/iyp/crawlers)) contains a readme for each dataset where the modelling is documented.

Let’s see a simple example. The below figure is an extract of BGP data showing the two ASes connected to the University of Tokyo (AS2501):  

{% include gallery-figure.html img="images/start/peering-2501.png" alt="Networks peering with AS2501" caption="Networks peering with AS2501" width="45%" %}

This is very similar to AS graphs we usually draw on a whiteboard. In addition the number displayed in each node shows the ASN which is actually a property set on the node.

For a counter-intuitive example see the graph below. These are the names associated with AS2501:  

{% include gallery-figure.html img="images/start/name-2501.png" alt="Names for AS2501." caption="Names for AS2501." width="55%" %}

Although we could have set a property ‘name’ to our AS nodes, we wouldn’t know which value to use for this property. Different datasets give us different AS names. So instead of a property, a name is a unique entity that can be linked to other entities.

The previous example also illustrates two different types of nodes, one \`AS\` node and three \`Name\` nodes. In IYP every node and every relationship are typed. The list of [node](https://github.com/InternetHealthReport/internet-yellow-pages/blob/main/documentation/node-types.md) and [relationship](https://github.com/InternetHealthReport/internet-yellow-pages/blob/main/documentation/relationship-types.md) types is available on GitHub and grows as IYP integrates more datasets.

Nodes and links have properties. For example the \`asn\` property permits to uniquely identify the AS represented by an AS node. In the IYP console (introduced [on the next page](querying-iyp#iyp-console)) click on a link or node to see all its properties.  
IYP uses properties for three different purposes:

* **Identification**: Some properties are immutable values that enable the user to select a specific thing in the database. For example, all AS nodes have the property \`asn\` that permits distinguishing the different ASes. Country nodes have the property \`country\_code\`, HostName nodes have the property \`name\`, etc. These properties are documented in the list of [node](https://github.com/InternetHealthReport/internet-yellow-pages/blob/main/documentation/node-types.md) and [relationship](https://github.com/InternetHealthReport/internet-yellow-pages/blob/main/documentation/relationship-types.md) types.  
* **Non-modelled data**: Some datasets provide a lot of detailed information, more than what IYP is modelling. In this case IYP keeps non-modelled data in the form of properties. For example, PeeringDB provides IXP member lists. This is modelled by connecting AS nodes to IXP nodes with the \`MEMBER\_OF\` relationship. PeeringDB also provides the general peering policy of these ASes, which is not modelled in IYP but available via the property \`policy\_general\` of the relationships. These properties are generally not documented in IYP and require a good understanding of the original dataset.  
* **Reference**: Every relationship in IYP contains metadata referring to the origin of the data:  
  * The \`reference\_org\` property refers to the organization providing the original data.  
  * \`reference\_time\_fetch\` is the date at which the data was imported.  
  * \`reference\_time\_modification\` is the time at which the data was produced.  
  * \`reference\_url\_data\` is the URL of the original dataset.  
  * \`reference\_url\_info\` is the URL of the documentation of the original dataset.  
  * \`reference\_name\` is unique per dataset and is composed of the organization name and dataset name (e.g. \`caida.as\_relationships\_v4\`). This is particularly useful to filter per datasets.


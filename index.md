---
title: Internet Yellow Pages (IYP) Tutorial
layout: lesson-content
anchor_headings: false
---

This tutorial covers the following topics:

* [**Get Started with IYP**](): the basics of the Internet Yellow Pages and its querying language, Cypher.  
* [**Example IYP queries**](): example queries to strengthen your understanding of IYP data and its querying language.  
* [**Accessing IYP from code**](): interact with IYP from Python.  
* [**Hosting a local IYP instance**](): run your own instance of IYP locally.  
* [**Adding data to IYP**](): the steps to add your own data to IYP.  
* [**Q\&A**:]() Answers to questions or problems you might encounter.

For writing queries see also the IYP cheatsheet:  
[IYP-cheatsheet-image](https://docs.google.com/presentation/d/1UyeSFOIXCvM7CKXclT9vxgHcJxOAFX4mGc2eVCsLkLs/edit?usp=sharing)
{% capture text %}**Disclaimer**

* Data quality: IYP makes no changes to imported datasets. **Users should be aware of the original datasets’ limitations** to accurately interpret results and maximize the utility of IYP.  
* Feedback: Report erroneous data found in IYP directly to the data providers, so that the original dataset can be fixed, the changes will be reflected in following IYP snapshots.  
* Citation: If you publish work/tools based on IYP cite the original dataset used (and the [IYP paper](https://www.iijlab.net/en/members/romain/pdf/romain_imc2024.bib)\!).  
* Heavy duty: For large scale analysis installing a local instance of IYP is recommended.  
* Temporal analysis: IYP is not suitable for timely analysis and longitudinal analysis.
{% endcapture %}

{% include alert.html text=text color=secondary %}

{% include toc.html %}

{% include template/credits.html %}

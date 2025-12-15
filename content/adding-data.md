---
nav_order: 6
title: Adding data to IYP
---

Before you start hacking away, the first, and very important, step is to **model
your data as a graph**.
Take a look at the existing
[node](https://github.com/InternetHealthReport/internet-yellow-pages/blob/main/documentation/node-types.md)
and
[relationship](https://github.com/InternetHealthReport/internet-yellow-pages/blob/main/documentation/relationship-types.md)
types and see if and where your data could attach to the existing graph and if
you can reuse existing relationship types.
Also refer back to the [IYP data modeling](#iyp-data-modelling) section.
If you need help, feel free to start a
[discussion](https://github.com/InternetHealthReport/internet-yellow-pages/discussions)
on GitHub.

Once you have modeled your data, you can start writing a _crawler_.
The main tasks of a crawler are to fetch data, parse it, model it with IYP
ontology, and push it to the IYP database. Most of these tasks are assisted by
the IYP python library (described next).

## IYP code structure

The repository and code is structured like this:

```
internet-yellow-pages/
├─ iyp/
│  ├─ __init__.py <- contains IYP module
│  ├─ crawlers/
│  │  ├─ org/ <- name of the organization
│  │  │  ├─ README.md <- README describing datasets and modelling
│  │  │  ├─ crawler1.py <- one crawler per dataset
│  │  │  ├─ crawler2.py
│  ├─ post/ <- for post-processing scripts
```

The canonical way to execute a crawler is:

```bash
python3 -m iyp.crawlers.org.crawler1
```

## Writing a IYP crawler

A full explanation of how to write a crawler from scratch is outside the scope
of this tutorial.
To get you started, we point you to the existing
[documentation](https://github.com/InternetHealthReport/internet-yellow-pages/blob/main/documentation/writing-a-crawler.md),
the [example
crawler](https://github.com/InternetHealthReport/internet-yellow-pages/blob/main/iyp/crawlers/example/crawler.py)
that you can use as a template, and the [best practices for writing
crawlers](https://github.com/InternetHealthReport/internet-yellow-pages/blob/main/documentation/crawler-best-practices.md).
You can also look at other [existing
crawlers](https://github.com/InternetHealthReport/internet-yellow-pages/tree/main/iyp/crawlers)
and of course always contact us for help.

## Making data publicly available

If you want to add private data to your own instance, feel free to do so.
However, we welcome crawler contributions that add data to IYP!

The workflow for this is usually as follows:

1. Propose a new dataset by opening a
   [discussion](https://github.com/InternetHealthReport/internet-yellow-pages/discussions).
   The point of the discussion is to decide if a dataset should be included and
   how to model it.
   Please add a short description of why the dataset would be useful for
   you/others.
   This is just to prevent adding datasets for the sake of it (“because we can”)
   which inflates to database size.
   You also do not have to provide a perfect model at the start, we can figure
   this out together.
1. Once it is decided that we want to integrate the dataset and how to model it,
   the discussion will be converted into an
   [issue](https://github.com/InternetHealthReport/internet-yellow-pages/issues).
   Then you (or someone else) can implement it.
1. Open a [pull
   request](https://github.com/InternetHealthReport/internet-yellow-pages/pulls)
   with the crawler implementation.
1. We will merge it and the next dump will contain your dataset!

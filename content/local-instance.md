---
nav_order: 5
title: Hosting a local IYP instance
---

To perform extensive analysis or analysis including your own datasets, we recommend that you locally host your own instance of IYP. This is also useful if you are on-the-go without a stable Internet connectivity. Don’t worry, apart from disk space, IYP is pretty lightweight!

## System requirements

- [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/install/)  
- About 100GB of free disk space  
- At least 2GB of RAM  
- At least 1 CPU core :)

## Clone the IYP repository

The first thing we have to do is to clone the IYP repository:

```bash  
git clone https://github.com/InternetHealthReport/internet-yellow-pages.git
```

Go to the directory `internet-yellow-pages`, the following steps (download database and setup IYP) should be done from this directory.

## Download a database dump

Visit the [database dump repository](https://archive.ihr.live/ihr/iyp/).

Dumps are organized by year, month, and day in this format:

```text  
https://archive.ihr.live/ihr/iyp/YYYY/MM/DD/iyp-YYYY-MM-DD.dump 
```

For the purpose of this tutorial, we recommend a recent dump (warning: link goes to a 20GB file):

```text  
https://archive.ihr.live/ihr/iyp/2025/11/22/iyp-2025-11-22.dump
```


This dump requires about 200GB of disk space once it is loaded. 
If this is too much for your machine, you can also use an older dump that is missing some datasets (CAIDA AS Relationship, Google CrUX, OONI censorship, some DNS CNAMEs), but only requires 40GB of disk space (file is 4.1GB).

```text  
https://archive.ihr.live/ihr/iyp/2024/07/22/iyp-2024-07-22.dump
```

The dump file needs to be called `neo4j.dump` and needs to be put in a folder called `dumps` (`dumps/neo4j.dump`).

To create the folder and download a dump with `curl`:

```bash  
mkdir dumps
curl https://archive.ihr.live/ihr/iyp/2025/02/01/iyp-2025-02-01.dump -o dumps/neo4j.dump
```

## Set up IYP

**For Mac users with ARM-based machines:** You might need to edit the Docker Compose file (docker-compose.yaml). Change the following line:  
```  
iyp_loader:
    image: neo4j/neo4j-admin:5.21.2
```  
to  
```  
iyp_loader:
    image: neo4j/neo4j-admin:5.21.2-arm
```

To load and start the database run the following command:

```bash  
mkdir -p data
uid="$(id -u)" gid="$(id -g)" docker compose --profile local up
```

**Please wait until IYP is fully loaded (indicated by the message `Started.`).**
The above command creates a `data` directory containing the database, loads the database dump, and starts the local IYP instance.
This initial setup needs to be done only once but it takes some time to completely load the database and start IYP.

This step won't work if the data directory already contains a database.
To delete an existing database, simply delete the contents of the `data` directory.

This setup keeps the database instance running in the foreground (add the `-d`
flag to run IYP in background).
You can stop the database with `Ctrl+C`.
Afterwards, simply start/stop IYP in the background to use it.

### Start/Stop IYP

To start the database, run the following command:

```bash  
docker start iyp
```
To stop the database, run the following command:

``` bash  
docker stop iyp
```



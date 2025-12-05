---
nav_order: 7
title: Frequently Asked Questions
---

**Q: I cannot execute queries. I get a `SemanticError` claiming `The following unsupported clauses were used: MATCH.`**  
**A:** If your prompt window is showing system$ instead of neo4j$ you changed the active database. Either select neo4j in the “Use database” dropdown list under the “Database information” tab in the top left, or execute `:use neo4j` in the prompt field.

**Q: I cannot copy or paste via the right-click context menu.**  
**A:** The IYP console uses the Neo4j Browser, which as an application for some reason does not support this. Please use Ctrl+C / V to copy / paste.

**Q: I get some weird JSON output instead of a graph.**  
**A:** Sometimes the IYP console defaults to the “Table” output, which is in JSON if you return a pattern in the query. Click on “Graph” at the top left of the result window to change the output mode.

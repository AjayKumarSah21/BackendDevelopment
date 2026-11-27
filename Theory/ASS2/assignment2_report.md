# Assignment 2 --- PostgreSQL as SQL + NoSQL: Working with JSONB

> **Submission note:** Rename this file to `<roll_number>assignment2.md`
> before final submission if your instructor requires that exact
> filename.

## Learning Objective

Understand how PostgreSQL's `jsonb` type lets one relational database
support both strongly structured SQL data and flexible document-style
data, and compare this approach with MongoDB.

------------------------------------------------------------------------

# Part A --- Conceptual Questions

## 1. What is `jsonb` in PostgreSQL, and how does it differ from plain `json`?

PostgreSQL provides both `json` and `jsonb` for storing JSON data, but
they use different storage approaches. The `json` type stores the
original JSON input as text. This preserves its original representation,
including whitespace. Because PostgreSQL mainly validates and stores the
text, plain `json` can require less processing during insertion.

`jsonb`, meaning JSON Binary, stores a parsed binary representation.
PostgreSQL must process the input before storing it, so writes can be
slightly more expensive than with plain `json`. The advantage appears
when the data is queried. Since the value is already parsed, PostgreSQL
can efficiently inspect keys and values rather than repeatedly
processing the original JSON text.

A major advantage of `jsonb` is indexing. It supports GIN indexes and
other indexing strategies that can significantly improve containment and
key-based searches. Therefore, `json` is useful when JSON mainly needs
to be stored and returned, while `jsonb` is normally preferable when
applications frequently search, filter, modify, or index JSON content.

``` sql
CREATE TABLE examples (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    raw_data JSON,
    searchable_data JSONB
);

INSERT INTO examples (raw_data, searchable_data)
VALUES (
    '{"name":"Laptop","ram":16}',
    '{"name":"Laptop","ram":16}'
);

SELECT searchable_data ->> 'name' AS product_name
FROM examples;
```

The final query returns `Laptop` as SQL text.

------------------------------------------------------------------------

## 2. How can PostgreSQL work as both a SQL and a NoSQL database in the same table?

PostgreSQL can combine normal relational columns with a `jsonb` column
in the same table. Relational columns provide a fixed schema for
information that every row should contain, while JSONB stores attributes
whose structure can vary between records.

For example, every product may require an `id`, `name`, `category`, and
`price`. These values fit naturally into typed SQL columns because their
structure is predictable and constraints can be applied. Different
categories, however, need different properties. A laptop may have
`ram_gb` and `cpu`; a book may have `author` and `pages`; and an
accessory may have `color` and `wireless`. Creating relational columns
for every possible property would produce many irrelevant or nullable
columns.

A JSONB column solves this by holding category-specific data as a
document. PostgreSQL can still provide SQL joins, constraints,
transactions, aggregation, and typed relational columns while also
allowing document-style queries against JSONB. Therefore, the same table
can combine the strengths of SQL and NoSQL-style storage.

``` sql
CREATE TABLE products (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    attributes JSONB
);

INSERT INTO products (name, category, price, attributes)
VALUES
('Clean Code', 'book', 499.00,
 '{"author":"Robert C. Martin","pages":464}'),
('DevBook Pro', 'laptop', 74999.00,
 '{"ram_gb":16,"cpu":"Intel Core i7"}');
```

The relational structure remains consistent while each JSONB document
can contain different keys.

------------------------------------------------------------------------

## 3. Examples of `->`, `->>`, `@>`, and `?`

PostgreSQL provides operators for querying JSONB documents. The `->`
operator retrieves a value while keeping it as JSON/JSONB, whereas `->>`
extracts the value as SQL text. The `@>` operator tests whether one
JSONB document contains another, and `?` checks whether a top-level key
exists.

Assume this product exists:

``` sql
INSERT INTO products (name, category, price, attributes)
VALUES (
    'Wireless Mouse',
    'accessory',
    1299.00,
    '{"color":"black","wireless":true}'
);
```

Using `->`:

``` sql
SELECT attributes -> 'color'
FROM products
WHERE name = 'Wireless Mouse';
```

**Returns:** `"black"` as JSONB.

Using `->>`:

``` sql
SELECT attributes ->> 'color'
FROM products
WHERE name = 'Wireless Mouse';
```

**Returns:** `black` as SQL text.

Using `@>`:

``` sql
SELECT name
FROM products
WHERE attributes @> '{"wireless":true}';
```

**Returns:** `Wireless Mouse`.

Using `?`:

``` sql
SELECT name
FROM products
WHERE attributes ? 'color';
```

**Returns:** products whose top-level `attributes` object contains the
`color` key.

The key difference between `->` and `->>` is the result type: `->`
preserves JSON/JSONB, while `->>` produces text that can easily be
displayed or cast to another SQL type.

------------------------------------------------------------------------

## 4. How can a GIN index on a `jsonb` column change query performance?

A GIN (Generalized Inverted Index) index can significantly improve
searches inside JSONB documents. Without a suitable index, PostgreSQL
may need to scan many rows and inspect each JSONB value. This becomes
expensive as the number of records increases.

A GIN index creates an index structure for searchable components of
JSONB values. It is particularly useful for supported containment and
existence searches. For example, a catalog that frequently searches for
products containing `"wireless": true` can benefit from a GIN index.

``` sql
CREATE INDEX idx_products_attributes
ON products
USING GIN (attributes);

SELECT name
FROM products
WHERE attributes @> '{"wireless":true}';
```

On a sufficiently large table, PostgreSQL can use the index rather than
checking every JSONB document.

A general GIN index does not automatically accelerate every JSONB
expression. For example:

``` sql
SELECT name
FROM products
WHERE (attributes ->> 'ram_gb')::int >= 16;
```

This query extracts text, converts it to an integer, and performs a
numeric range comparison. A general GIN index on the entire JSONB
document is not designed to directly optimize that expression. If such a
range query is common, a suitable expression index can be created
instead.

------------------------------------------------------------------------

## 5. Where could PostgreSQL + `jsonb` replace MongoDB, and where would MongoDB still be the better fit?

PostgreSQL with JSONB can replace MongoDB in many applications that need
flexible attributes but also depend strongly on relational features.
Product catalogs, content systems, order-management applications, and
business software can benefit because PostgreSQL combines document-style
fields with typed columns, joins, foreign keys, constraints, and
transactions.

For example:

``` sql
SELECT p.name, p.price, p.attributes ->> 'color' AS color
FROM products AS p
WHERE p.attributes @> '{"wireless":true}';
```

This provides document-style filtering without giving up SQL.

PostgreSQL is especially attractive when transactions, relational joins,
and schema enforcement are central requirements. Important fields can be
strictly typed and constrained, while selected fields remain flexible
through JSONB.

MongoDB can still be a better fit when the application is primarily
document-oriented and nested documents are the natural unit of storage
and retrieval. Its query syntax works directly with document paths, and
MongoDB has mature built-in support for distributing document workloads
horizontally through sharding. MongoDB also supports transactions, but
its modeling approach commonly favors embedding related information when
appropriate.

Therefore, PostgreSQL + JSONB is strong for mixed relational/document
workloads, while MongoDB remains attractive for document-first systems
and workloads designed around horizontal distribution.

------------------------------------------------------------------------

# Part B --- Hands-on Exercise: Product Catalog

## Task 1 --- Schema

``` sql
CREATE TABLE products (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    attributes JSONB
);
```

The fixed columns enforce a predictable product structure, while
`attributes` stores flexible category-specific data.

------------------------------------------------------------------------

## Task 2 --- Insert Data

The following five products cover three categories: books, laptops, and
accessories.

``` sql
INSERT INTO products (name, category, price, attributes) VALUES
(
    'Clean Code',
    'book',
    499.00,
    '{"author":"Robert C. Martin","pages":464}'
),
(
    'Database System Concepts',
    'book',
    699.00,
    '{"author":"Abraham Silberschatz","pages":1376}'
),
(
    'DevBook Pro',
    'laptop',
    74999.00,
    '{"ram_gb":16,"cpu":"Intel Core i7","storage_gb":512}'
),
(
    'CodeStation X',
    'laptop',
    92999.00,
    '{"ram_gb":32,"cpu":"AMD Ryzen 7","storage_gb":1000}'
),
(
    'Wireless Mouse',
    'accessory',
    1299.00,
    '{"color":"black","wireless":true}'
);
```

------------------------------------------------------------------------

## Task 3 --- Query by Category-Specific Attribute

### Books with at least 500 pages

``` sql
SELECT
    name,
    attributes ->> 'author' AS author,
    (attributes ->> 'pages')::int AS pages
FROM products
WHERE category = 'book'
  AND (attributes ->> 'pages')::int >= 500;
```

**Expected result:** `Database System Concepts`.

### Laptops with at least 16 GB RAM

``` sql
SELECT
    name,
    attributes ->> 'cpu' AS cpu,
    (attributes ->> 'ram_gb')::int AS ram_gb
FROM products
WHERE category = 'laptop'
  AND (attributes ->> 'ram_gb')::int >= 16;
```

**Expected results:** `DevBook Pro` and `CodeStation X`.

### Wireless accessories

``` sql
SELECT
    name,
    attributes ->> 'color' AS color
FROM products
WHERE category = 'accessory'
  AND (attributes ->> 'wireless')::boolean = true;
```

**Expected result:** `Wireless Mouse`.

------------------------------------------------------------------------

## Task 4 --- Containment Query

``` sql
SELECT name
FROM products
WHERE attributes @> '{"wireless":true}';
```

**Expected result:**

``` text
Wireless Mouse
```

The query only specifies the JSON fragment that must exist; the product
can contain additional attributes.

------------------------------------------------------------------------

## Task 5 --- Update JSONB Without Altering the Table

``` sql
UPDATE products
SET attributes = attributes || '{"discount_pct":10}'
WHERE name = 'Wireless Mouse';
```

Verify the update:

``` sql
SELECT name, attributes
FROM products
WHERE name = 'Wireless Mouse';
```

The JSONB value now contains the original attributes and the new field:

``` json
{
  "color": "black",
  "wireless": true,
  "discount_pct": 10
}
```

No `ALTER TABLE` command was required.

------------------------------------------------------------------------

## Task 6 --- Index and Compare

### Before creating the index

``` sql
EXPLAIN ANALYZE
SELECT name
FROM products
WHERE attributes @> '{"wireless":true}';
```

### Create a GIN index

``` sql
CREATE INDEX idx_products_attributes
ON products
USING GIN (attributes);
```

### Run the query again

``` sql
EXPLAIN ANALYZE
SELECT name
FROM products
WHERE attributes @> '{"wireless":true}';
```

### Observation

The GIN index is suitable for JSONB containment searches such as `@>`.
However, this assignment contains only five rows. PostgreSQL may still
choose a sequential scan because scanning such a small table is cheaper
than using an index. The performance advantage becomes clearer on a much
larger dataset.

The category-specific numeric query is different:

``` sql
EXPLAIN ANALYZE
SELECT name
FROM products
WHERE category = 'laptop'
  AND (attributes ->> 'ram_gb')::int >= 16;
```

The general JSONB GIN index does not directly optimize this
extracted-and-cast range expression. If RAM range searches are frequent,
an expression index could be created:

``` sql
CREATE INDEX idx_products_ram_gb
ON products (((attributes ->> 'ram_gb')::int));
```

------------------------------------------------------------------------

# Task 7 --- MongoDB Comparison

## Insert the Same Products

Run the following in `mongosh`:

``` javascript
use assignment2

db.products.insertMany([
  {
    name: "Clean Code",
    category: "book",
    price: 499.00,
    attributes: {
      author: "Robert C. Martin",
      pages: 464
    }
  },
  {
    name: "Database System Concepts",
    category: "book",
    price: 699.00,
    attributes: {
      author: "Abraham Silberschatz",
      pages: 1376
    }
  },
  {
    name: "DevBook Pro",
    category: "laptop",
    price: 74999.00,
    attributes: {
      ram_gb: 16,
      cpu: "Intel Core i7",
      storage_gb: 512
    }
  },
  {
    name: "CodeStation X",
    category: "laptop",
    price: 92999.00,
    attributes: {
      ram_gb: 32,
      cpu: "AMD Ryzen 7",
      storage_gb: 1000
    }
  },
  {
    name: "Wireless Mouse",
    category: "accessory",
    price: 1299.00,
    attributes: {
      color: "black",
      wireless: true
    }
  }
]);
```

## Equivalent MongoDB Queries

### Books with at least 500 pages

``` javascript
db.products.find(
  {
    category: "book",
    "attributes.pages": { $gte: 500 }
  },
  {
    name: 1,
    "attributes.author": 1,
    "attributes.pages": 1
  }
);
```

### Laptops with at least 16 GB RAM

``` javascript
db.products.find(
  {
    category: "laptop",
    "attributes.ram_gb": { $gte: 16 }
  },
  {
    name: 1,
    "attributes.cpu": 1,
    "attributes.ram_gb": 1
  }
);
```

### Wireless accessories

``` javascript
db.products.find(
  {
    category: "accessory",
    "attributes.wireless": true
  },
  {
    name: 1,
    "attributes.color": 1
  }
);
```

## MongoDB Index Examples

``` javascript
db.products.createIndex({ "attributes.ram_gb": 1 });
```

``` javascript
db.products.createIndex({ "attributes.wireless": 1 });
```

An execution plan can be inspected using:

``` javascript
db.products.find({
  "attributes.ram_gb": { $gte: 16 }
}).explain("executionStats");
```

------------------------------------------------------------------------

# PostgreSQL JSONB vs MongoDB

  -------------------------------------------------------------------------
  Area                    PostgreSQL + JSONB        MongoDB
  ----------------------- ------------------------- -----------------------
  Primary model           Relational with document  Document-oriented
                          support                   

  Fixed schema            Typed columns and         Flexible documents by
                          constraints               default

  Flexible attributes     JSONB                     Native nested documents

  Query language          SQL + JSON operators      MongoDB query syntax

  Joins                   Strong relational joins   Supported, but
                                                    embedding is often used

  Transactions            Strong relational         Transaction support
                          transaction model         available

  Document indexing       GIN and expression        Nested/document field
                          indexes                   indexes

  Nested numeric ranges   Extraction/casting may be Direct field query
                          needed                    syntax

  Horizontal scaling      Depends on PostgreSQL     Sharding is a core
                          deployment/architecture   MongoDB feature

  Strong use case         Mixed relational +        Document-first
                          document data             applications
  -------------------------------------------------------------------------

------------------------------------------------------------------------

## Syntax Comparison

### PostgreSQL

``` sql
SELECT name
FROM products
WHERE category = 'laptop'
  AND (attributes ->> 'ram_gb')::int >= 16;
```

### MongoDB

``` javascript
db.products.find({
  category: "laptop",
  "attributes.ram_gb": { $gte: 16 }
});
```

MongoDB's syntax for nested document fields is direct. PostgreSQL
requires JSON extraction, and values returned with `->>` may need to be
cast for numeric comparisons. PostgreSQL, however, can keep important
fields in strictly typed relational columns while reserving JSONB for
flexible properties.

------------------------------------------------------------------------

# Key Findings

1.  `jsonb` stores parsed JSON data and is optimized for querying and
    indexing rather than preserving the exact original JSON text.
2.  PostgreSQL can combine typed relational columns with flexible JSONB
    documents in one table.
3.  `->`, `->>`, `@>`, and `?` provide document-style querying through
    SQL.
4.  GIN indexes are particularly useful for supported JSONB containment
    and existence searches.
5.  A general GIN index does not automatically optimize numeric range
    comparisons on extracted JSONB values.
6.  PostgreSQL + JSONB is useful when relational integrity,
    transactions, joins, and flexible attributes are needed together.
7.  MongoDB provides natural document syntax and straightforward
    nested-field querying and indexing.
8.  PostgreSQL and MongoDB overlap in capability but emphasize different
    data models and scaling approaches.

------------------------------------------------------------------------

# Conclusion

This assignment demonstrates that PostgreSQL can provide more than
traditional relational storage. By combining strongly typed SQL columns
with `jsonb`, PostgreSQL supports both structured relational information
and flexible document-style attributes in the same database.

The product catalog illustrates this hybrid model clearly. Important
fields such as `id`, `name`, `category`, and `price` remain structured
and strongly typed, while category-specific properties are stored in
JSONB without repeatedly changing the table schema. PostgreSQL's JSON
operators make these properties queryable, and appropriate GIN or
expression indexes can improve performance for common access patterns.

MongoDB provides a more direct document-oriented model and concise
nested-field syntax. PostgreSQL + JSONB is particularly useful when
document flexibility must coexist with SQL features such as joins,
relational constraints, and transactions. MongoDB remains attractive for
document-first applications and systems designed around MongoDB's
horizontal sharding model.

Overall, JSONB allows PostgreSQL to handle many workloads that might
otherwise require a separate document database while retaining the
benefits of a relational database system.

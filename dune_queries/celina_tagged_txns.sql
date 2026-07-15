WITH candidate_txns AS (
  SELECT
    hash,
    block_time,
    block_number,
    "from",
    "to",
    data,
    length(data) AS data_len
  FROM celo.transactions
  WHERE block_number >= 67800000
),

legacy_tagged AS (
  SELECT hash, block_time, block_number, "from", "to"
  FROM candidate_txns
  WHERE bytearray_position(data, 0x43454c494e41) > 0  -- CELINA (legacy, any suffix format)
),

erc8021_parsed AS (
  SELECT
    hash, block_time, block_number, "from", "to",
    bytearray_substring(data, CAST(data_len - 15 AS bigint), 16) AS erc_marker,
    bytearray_substring(data, CAST(data_len - 16 AS bigint), 1) AS schema_id,
    bytearray_substring(data, CAST(data_len - 22 AS bigint), 6) AS codes_candidate,
    bytearray_substring(data, CAST(data_len - 23 AS bigint), 1) AS codes_length_byte
  FROM candidate_txns
  WHERE data_len >= 39  -- enough bytes for marker(16) + schemaId(1) + len(1) + "celina"(6) + at least some tx_data
),

erc8021_tagged AS (
  SELECT hash, block_time, block_number, "from", "to"
  FROM erc8021_parsed
  WHERE erc_marker = 0x80218021802180218021802180218021
    AND schema_id = 0x00
    AND codes_length_byte = 0x06
    AND codes_candidate = 0x63656c696e61  -- "celina"
),

combined AS (
  SELECT hash, block_time, block_number, "from", "to" FROM legacy_tagged
  UNION
  SELECT hash, block_time, block_number, "from", "to" FROM erc8021_tagged
),

daily_counts AS (
  SELECT
    DATE_TRUNC('day', block_time) AS day,
    COUNT(*) AS txn_count
  FROM combined
  GROUP BY 1
),

daily_with_cumulative AS (
  SELECT
    day,
    txn_count,
    SUM(txn_count) OVER (ORDER BY day ASC) AS cumulative_txns
  FROM daily_counts
)

SELECT
  d.day,
  d.txn_count,
  d.cumulative_txns,
  c.hash,
  c.block_time,
  c.block_number,
  c."from",
  c."to"
FROM daily_with_cumulative d
LEFT JOIN combined c ON DATE_TRUNC('day', c.block_time) = d.day
ORDER BY c.block_time DESC
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
  WHERE block_number >= 76121998
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
)

SELECT
  hash,
  block_time,
  block_number,
  "from",
  "to"
FROM erc8021_tagged
ORDER BY block_time DESC

WITH candidate_txns AS (
  SELECT
    hash, block_time, block_number, "from", "to", data
  FROM celo.transactions
  WHERE block_number >= 76121998
    AND block_time >= TIMESTAMP '2026-08-29 16:59:16'
),

erc8021_located AS (
  SELECT
    hash, block_time, block_number, "from", "to", data,
    bytearray_position(data, 0x80218021802180218021802180218021) AS marker_pos
  FROM candidate_txns
),

erc8021_base AS (
  SELECT
    hash, block_time, block_number, "from", "to", data, marker_pos,
    bytearray_substring(data, CAST(marker_pos - 1 AS bigint), 1) AS schema_id,
    bytearray_substring(data, CAST(marker_pos - 2 AS bigint), 1) AS codes_length_byte
  FROM erc8021_located
  WHERE marker_pos >= 3
),

erc8021_matched AS (
  SELECT
    hash, block_time, block_number, "from", "to", data, marker_pos,
    bytearray_to_bigint(codes_length_byte) AS codes_length
  FROM erc8021_base
  WHERE schema_id = 0x00
),

erc8021_parsed AS (
  SELECT
    hash, block_time, block_number, "from", "to",
    bytearray_substring(data, CAST(marker_pos - 2 - codes_length AS bigint), CAST(codes_length AS bigint)) AS codes_field
  FROM erc8021_matched
  WHERE codes_length > 0
    AND marker_pos - 2 - codes_length >= 1
),

erc8021_tagged AS (
  SELECT hash, block_time, block_number, "from", "to"
  FROM erc8021_parsed
  WHERE codes_field = 0x63656c696e61
     OR bytearray_position(codes_field, 0x2c63656c696e61) > 0
     OR bytearray_position(codes_field, 0x63656c696e612c) > 0
)

SELECT hash, block_time, block_number, "from", "to"
FROM erc8021_tagged
ORDER BY block_time DESC
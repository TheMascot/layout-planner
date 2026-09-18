from pathlib import Path

src = Path("backend/src/main/resources/seed_data.sql")
dst = Path("backend/src/main/resources/db/migration/V2__seed_aircraft_templates.sql")

text = src.read_text(encoding="utf-8")

pos = text.upper().find("VALUES")
if pos == -1:
    raise SystemExit("Could not find VALUES in the file.")

after_values = text[pos + len("VALUES"):].strip()

# parse every row tuple after VALUES
rows = []
current = []
depth = 0
quote = None
i = 0

while i < len(after_values):
    ch = after_values[i]

    if ch == "'" and (quote is None or quote == "'"):
        quote = None if quote else "'"
        current.append(ch)
        i += 1
        continue

    if quote is None:
        if ch == "(":
            if depth == 0:
                depth = 1
                current = []
                i += 1
                continue
            depth += 1
        elif ch == ")":
            if depth > 0:
                depth -= 1
                if depth == 0:
                    row = "".join(current)
                    if row.strip():
                        rows.append(row.strip())
                    current = []
                    i += 1
                    continue

    if depth > 0:
        current.append(ch)

    i += 1

if not rows:
    raise SystemExit("No rows parsed. Check the input file format.")

def split_fields(row: str):
    fields = []
    buf = []
    depth = 0
    quote = None

    for ch in row:
        if ch == "'" and (quote is None or quote == "'"):
            quote = None if quote else "'"
            buf.append(ch)
            continue

        if quote is None:
            if ch == "(":
                depth += 1
            elif ch == ")":
                depth -= 1
            elif ch == "," and depth == 0:
                val = "".join(buf).strip()
                if val:
                    fields.append(val)
                buf = []
                continue

        buf.append(ch)

    final = "".join(buf).strip()
    if final:
        fields.append(final)

    return fields

def clean(value: str):
    value = value.strip()
    if len(value) >= 2 and value.startswith("'") and value.endswith("'"):
        return value[1:-1]
    return value

obj_rows = []
air_rows = []

for idx, row in enumerate(rows, start=1):
    parts = split_fields(row)
    if len(parts) < 10:
        continue

    name = clean(parts[0])
    icao = clean(parts[1])
    type_value = clean(parts[2]).lower()
    width = clean(parts[3])
    length = clean(parts[4])
    height = clean(parts[5])

    obj_rows.append(
        f"({idx}, '{name}', {width}, {length}, 'AIRCRAFT', 'RECTANGLE', NULL, NOW(), NOW(), false)"
    )

    aircraft_type = "AIRPLANE" if type_value == "airplane" else "HELICOPTER"
    air_rows.append(f"({idx}, '{icao}', {height}, '{aircraft_type}')")

if not obj_rows:
    raise SystemExit("No valid rows after parsing.")

output = []
output.append("INSERT INTO object_templates (")
output.append("    id, name, width, length, object_category, geometry_type, created_by, created_at, updated_at, is_deleted")
output.append(") VALUES")
output.append(",\n".join(obj_rows) + ";")
output.append("")
output.append("INSERT INTO aircraft_templates (")
output.append("    id, icao, height, aircraft_type")
output.append(") VALUES")
output.append(",\n".join(air_rows) + ";")

dst.parent.mkdir(parents=True, exist_ok=True)
dst.write_text("\n".join(output) + "\n", encoding="utf-8")

print(f"Generated: {dst}")
print(f"Rows parsed: {len(obj_rows)}")
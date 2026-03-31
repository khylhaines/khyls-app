export function getLogicQuestion(input = {}) {
  const pool =
    (typeof QA_LOGIC_BY_GROUP !== "undefined" && QA_LOGIC_BY_GROUP) ||
    (typeof LOGIC_BY_GROUP !== "undefined" && LOGIC_BY_GROUP) ||
    null;

  const group = input.group || input.pin?.qaGroup || "";
  const tier = ["kid", "teen", "adult"].includes(input.tier)
    ? input.tier
    : "kid";
  const salt = Number(input.salt || 0);

  function pickOne(arr) {
    if (!Array.isArray(arr) || !arr.length) return null;
    return arr[Math.abs(salt) % arr.length];
  }

  if (pool && pool[group] && pool[group][tier]) {
    return pickOne(pool[group][tier]);
  }

  return null;
}

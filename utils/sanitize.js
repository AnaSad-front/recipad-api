const sanitize = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitize(item));
  }

  const sanitized = {};

  Object.keys(obj).forEach((key) => {
    if (!key.startsWith("$") && !key.includes(".")) {
      const value = obj[key];

      sanitized[key] =
        value && typeof value === "object" ? sanitize(value) : value;
    }
  });

  return sanitized;
};

exports.sanitize = sanitize;

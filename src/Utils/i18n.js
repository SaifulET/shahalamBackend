const GOOGLE_TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single";
const translationCache = new Map();

function normalizeLang(value) {
  if (!value || typeof value !== "string") return "en";
  const lang = value.toLowerCase();
  return lang.startsWith("ar") ? "ar" : "en";
}

export function getRequestLang(req) {
  const fromQuery = normalizeLang(req?.query?.lang);
  if (fromQuery === "ar") return "ar";

  const fromHeader = normalizeLang(req?.headers?.["x-language"]);
  if (fromHeader === "ar") return "ar";

  const acceptLanguage = normalizeLang(req?.headers?.["accept-language"]);
  return acceptLanguage;
}

async function translateOne(text, target) {
  const source = String(text || "").trim();
  if (!source || target !== "ar") return source;

  const cacheKey = `${target}:${source}`;
  const cached = translationCache.get(cacheKey);
  if (cached) return cached;

  try {
    const url = new URL(GOOGLE_TRANSLATE_URL);
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", "auto");
    url.searchParams.set("tl", target);
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", source);

    const response = await fetch(url.toString(), { method: "GET" });
    if (!response.ok) {
      translationCache.set(cacheKey, source);
      return source;
    }

    const data = await response.json();
    const chunks = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : [];
    const translated = chunks
      .map((chunk) => (Array.isArray(chunk) && typeof chunk[0] === "string" ? chunk[0] : ""))
      .join("")
      .trim();

    const finalText = translated || source;
    translationCache.set(cacheKey, finalText);
    return finalText;
  } catch {
    translationCache.set(cacheKey, source);
    return source;
  }
}

async function buildTranslationMap(texts, target) {
  const uniqueTexts = Array.from(
    new Set(
      texts
        .map((item) => String(item || "").trim())
        .filter(Boolean)
    )
  );

  if (!uniqueTexts.length || target !== "ar") {
    return new Map();
  }

  const translations = await Promise.all(uniqueTexts.map((text) => translateOne(text, target)));
  return new Map(uniqueTexts.map((text, index) => [text, translations[index] || text]));
}

function toPlain(entity) {
  if (!entity) return entity;
  return typeof entity.toObject === "function" ? entity.toObject() : { ...entity };
}

export async function localizeObjectsByFields(entities, fields, lang) {
  if (!Array.isArray(entities) || !entities.length || lang !== "ar") {
    return entities;
  }

  const plainEntities = entities.map(toPlain);
  const textsNeedingTranslation = [];

  plainEntities.forEach((entity) => {
    fields.forEach((field) => {
      const arField = `${field}_ar`;
      if (!entity?.[arField] && entity?.[field]) {
        textsNeedingTranslation.push(entity[field]);
      }
    });
  });

  const translationMap = await buildTranslationMap(textsNeedingTranslation, "ar");

  return plainEntities.map((entity) => {
    const localized = { ...entity };

    fields.forEach((field) => {
      const arField = `${field}_ar`;
      if (localized[arField]) {
        localized[field] = localized[arField];
      } else if (localized[field] && translationMap.has(localized[field])) {
        localized[field] = translationMap.get(localized[field]);
      }
    });

    return localized;
  });
}

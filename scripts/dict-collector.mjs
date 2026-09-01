import fs from "fs";
import path from "path";
import crypto from "crypto";

function toKey(originalText) {
    const normalized = originalText.replace(/\s+/g, " ").trim();
    if (normalized.length <= 60 && !originalText.includes("\n") && !originalText.includes('"') && !originalText.includes("'")) {
        return normalized;
    }
    const hash = crypto.createHash("sha256").update(normalized).digest("hex").slice(0, 6);
    const slug = normalized.replace(/[^a-zA-Z0-9\s-]/g, " ").replace(/\s+/g, " ").trim().slice(0, 24).trim();
    return `${slug}...#${hash}`;
}

const enDict = {};

function record(key, fullText) {
    enDict[key] = fullText || key;
    return key;
}

console.log("Dictionary collector initialized");

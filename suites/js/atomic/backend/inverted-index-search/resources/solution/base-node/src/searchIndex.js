/** In-memory inverted index with TF-IDF ranking. */
export class InvertedIndex {
  constructor() {
    this.docs = [];
    this.index = new Map();
    this.inverted = this.index;
  }
  add(doc) {
    const id = this.docs.length;
    this.docs.push(doc);
    const terms = String(doc.text ?? "").toLowerCase().match(/[a-z0-9]+/g) ?? [];
    for (const term of new Set(terms)) {
      if (!this.index.has(term)) this.index.set(term, new Map());
      const tfMap = this.index.get(term);
      tfMap.set(id, (tfMap.get(id) ?? 0) + 1);
    }
    return id;
  }
  search(query, limit = 5) {
    const terms = String(query).toLowerCase().match(/[a-z0-9]+/g) ?? [];
    const scores = new Map();
    const N = this.docs.length || 1;
    for (const term of terms) {
      const postings = this.index.get(term);
      if (!postings) continue;
      const df = postings.size;
      const idf = Math.log((N + 1) / (df + 1)) + 1;
      for (const [docId, tf] of postings.entries()) {
        scores.set(docId, (scores.get(docId) ?? 0) + tf * idf);
      }
    }
    return [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id, score]) => ({ ...this.docs[id], score }));
  }
}

import { mkdir, writeFile, unlink } from "node:fs/promises";
import { join } from "node:path";

export class LocalStorageProvider {
  constructor(root = join(process.cwd(), "storage")) {
    this.root = root;
  }
  async upload(key, data) {
    await mkdir(this.root, { recursive: true });
    const path = join(this.root, key);
    await writeFile(path, data);
    return { key, url: `/local/${key}` };
  }
  async delete(key) {
    await unlink(join(this.root, key)).catch(() => {});
    return { deleted: key };
  }
  getUrl(key) { return `/local/${key}`; }
}

export class S3StorageProvider {
  constructor(bucket = "demo-bucket") {
    this.bucket = bucket;
    this.objects = new Map();
  }
  async upload(key, data) {
    this.objects.set(key, data);
    return { key, url: `https://${this.bucket}.s3.amazonaws.com/${key}` };
  }
  async delete(key) {
    this.objects.delete(key);
    return { deleted: key };
  }
  getUrl(key) { return `https://${this.bucket}.s3.amazonaws.com/${key}`; }
}

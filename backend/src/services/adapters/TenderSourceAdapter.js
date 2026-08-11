export class TenderSourceAdapter {
  constructor(portalName) {
    if (this.constructor === TenderSourceAdapter) {
      throw new Error("Cannot instantiate abstract class TenderSourceAdapter.");
    }
    this.portalName = portalName;
  }

  async fetchList(page, filters) {
    throw new Error("Method 'fetchList()' must be implemented.");
  }

  async fetchDetail(sourceTenderId) {
    throw new Error("Method 'fetchDetail()' must be implemented.");
  }

  normalize(rawTenderData) {
    throw new Error("Method 'normalize()' must be implemented.");
  }
}
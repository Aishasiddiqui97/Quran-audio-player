import { Model, Document, FilterQuery } from "mongoose"
import { PaginationResult } from "../types"

interface QueryParams {
  page?: string
  limit?: string
  sort?: string
  search?: string
  [key: string]: string | undefined
}

export class ApiFeatures<T extends Document> {
  private model: Model<T>
  private queryParams: QueryParams
  private filter: Record<string, any> = {}
  private sortObj: Record<string, 1 | -1> = { createdAt: -1 }
  private page: number = 1
  private limit: number = 20
  private searchFields: string[] = []

  constructor(model: Model<T>, queryParams: QueryParams) {
    this.model = model
    this.queryParams = queryParams
    this.parseParams()
  }

  private parseParams(): void {
    const { page, limit, sort, search, ...rest } = this.queryParams

    if (page) this.page = Math.max(1, parseInt(page, 10) || 1)
    if (limit) this.limit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20))

    if (sort) {
      this.sortObj = {}
      sort.split(",").forEach((s) => {
        const field = s.replace(/^-/, "")
        this.sortObj[field] = s.startsWith("-") ? -1 : 1 as 1 | -1
      })
    }

    for (const [key, value] of Object.entries(rest)) {
      if (value === undefined) continue
      if (key === "surahNumber" || key === "ayahNumber" || key === "juz") {
        const num = parseInt(value, 10)
        if (!isNaN(num)) this.filter[key] = num
      } else if (key === "sajda") {
        this.filter[key] = value === "true"
      } else if (key === "revelationType") {
        if (value === "Meccan" || value === "Medinan") {
          this.filter[key] = value
        }
      } else if (key === "language" || key === "translator" || key === "source" || key === "reciter") {
        this.filter[key] = value
      }
    }
  }

  setSearchFields(fields: string[]): this {
    this.searchFields = fields
    return this
  }

  private applySearch(): void {
    const search = this.queryParams.search
    if (search && this.searchFields.length > 0) {
      const searchRegex = new RegExp(search, "i")
      this.filter.$or = this.searchFields.map((field) => ({
        [field]: searchRegex,
      }))
    }
  }

  private buildQuery() {
    this.applySearch()
    const skip = (this.page - 1) * this.limit
    return this.model
      .find(this.filter as FilterQuery<T>)
      .sort(this.sortObj)
      .skip(skip)
      .limit(this.limit)
  }

  async execute(): Promise<{ data: T[]; pagination: PaginationResult }> {
    const [data, totalItems] = await Promise.all([
      this.buildQuery(),
      this.model.countDocuments(this.filter as FilterQuery<T>),
    ])

    const totalPages = Math.ceil(totalItems / this.limit)

    return {
      data,
      pagination: {
        currentPage: this.page,
        totalPages,
        totalItems,
        itemsPerPage: this.limit,
        hasNextPage: this.page < totalPages,
        hasPrevPage: this.page > 1,
      },
    }
  }

  getFilter(): FilterQuery<T> {
    this.applySearch()
    return this.filter as FilterQuery<T>
  }
}

export function buildPaginationResult(
  total: number,
  page: number,
  limit: number
): PaginationResult {
  const totalPages = Math.ceil(total / limit)
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

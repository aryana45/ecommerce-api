// utils/ApiFeatures.ts

type BuiltQuery = {
  where: Record<string, unknown>;
  orderBy: Record<string, 'asc' | 'desc'> | Record<string, 'asc' | 'desc'>[];
  select: Record<string, boolean> | null;
  skip: number;
  take: number;
};

export class ApiFeatures {
  private query: BuiltQuery;
  private reqQuery: Record<string, unknown>;

  constructor(reqQuery: Record<string, unknown>) {
    this.query = {
      where: {},
      orderBy: {},
      select: null,
      skip: 0,
      take: 30,
    };
    this.reqQuery = reqQuery;
  }

  filter(): this {
    const queryObj = { ...this.reqQuery };
    const excludedFields = [
      'sort',
      'limit',
      'page',
      'fields',
      'cursorCreatedAt',
      'cursorId',
    ];
    excludedFields.forEach((field) => delete queryObj[field]);

    const where: Record<string, unknown> = {};
    Object.keys(queryObj).forEach((key) => {
      if (key.endsWith('_gte')) {
        where[key.replace('_gte', '')] = { gte: queryObj[key] };
      } else if (key.endsWith('_lte')) {
        where[key.replace('_lte', '')] = { lte: queryObj[key] };
      } else {
        where[key] = queryObj[key];
      }
    });

    this.query.where = where;
    return this;
  }

  sort(): this {
    if (this.reqQuery.sort) {
      this.query.orderBy = (this.reqQuery.sort as string)
        .split(',')
        .map((field) =>
          field.startsWith('-')
            ? { [field.substring(1)]: 'desc' as const }
            : { [field]: 'asc' as const }
        );
    } else {
      this.query.orderBy = [{ createdAt: 'desc' }];
    }
    return this;
  }

  limitFields(): this {
    if (this.reqQuery.fields) {
      const select: Record<string, boolean> = {};
      (this.reqQuery.fields as string)
        .split(',')
        .forEach((field) => (select[field] = true));
      this.query.select = select;
    } else {
      this.query.select = null;
    }
    return this;
  }

  pagination(): this {
    const limit = Number(this.reqQuery.limit) || 100;
    const page = Number(this.reqQuery.page) || 1;
    this.query.skip = (page - 1) * limit;
    this.query.take = limit;
    return this;
  }

  build(): BuiltQuery {
    return this.query;
  }
}

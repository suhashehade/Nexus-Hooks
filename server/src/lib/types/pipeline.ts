export type FilterConfig = {
  minTotal?: number;
  maxTotal?: number;
  allowedStatuses?: string[];
};

export type TransformConfig = {
  fieldMapping?: { [sourceField: string]: string };
  currencyConversion?: { from: string; to: string; rate: number };
  addFields?: { [key: string]: string | (() => string) };
};

export type EnrichConfig = {
  addFields: { [key: string]: string | (() => string) };
};

export type ActionConfig =
  | { type: "FILTER"; config: FilterConfig }
  | { type: "TRANSFORM"; config: TransformConfig }
  | { type: "ENRICH"; config: EnrichConfig };

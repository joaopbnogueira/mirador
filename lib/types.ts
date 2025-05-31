import { isEmpty } from 'lodash';

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type UnionMapper<TKeys> = TKeys extends object
  ? {
      [Key in keyof TKeys]-?: `${string & Key}${'' extends UnionMapper<TKeys[Key]> ? '' : '.'}${UnionMapper<
        TKeys[Key]
      >}`;
    }[keyof TKeys]
  : '';

type SchemaIdPrefix = '#schema';
type SchemaIdEntities = 'jobs/posting' | 'case' | 'article' | 'person' | 'partner';
type SchemaIdSuffix = string;

export type CountryCode = 'NL' | 'PT';
export const CountriesMap: Record<CountryCode, string> = {
  NL: 'Netherlands',
  PT: 'Portugal',
};

export type CountryName = (typeof CountriesMap)[CountryCode];

export const validCountryNames: CountryName[] = Object.values(CountriesMap) as CountryName[];

// type for the value of countries map

export type SchemaId = `${SchemaIdPrefix}/${SchemaIdEntities}/${SchemaIdSuffix}`;

export const isNotEmpty = <T>(argument: T | undefined | null): argument is T => !isEmpty(argument);

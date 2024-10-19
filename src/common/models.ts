import { DefaultRecord, Flavour } from '@event-driven-io/emmett';

export type DomainError<
  ErrorType extends string = string,
  ErrorData extends DefaultRecord = DefaultRecord,
> = Flavour<
  Readonly<{
    type: ErrorType;
    data: Readonly<ErrorData>;
  }>,
  'Error'
>;

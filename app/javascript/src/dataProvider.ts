import buildGraphQLProvider, { buildIntrospection, FieldNameConventionEnum } from '@moonlight-labs/ra-data-graphql-advanced'
import { DataProvider } from 'react-admin'

import { client } from './clients/apollo'

export const introspection = buildIntrospection(FieldNameConventionEnum.SNAKE)

export async function buildDataProvider(options?: any): Promise<DataProvider> {
  return buildGraphQLProvider({
    bulkActionsEnabled: true,
    client: client,
    fieldNameConvention: FieldNameConventionEnum.SNAKE,
    introspection: introspection,
    ...options,
  })
}
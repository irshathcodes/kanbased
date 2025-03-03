import { Api200Response } from './type-helpers';

// Board list response type
export type BoardListResponse = Api200Response<'/api/v1/boards', 'get'>;

// Columns response type
export type ColumnsWithTasksResponse = Api200Response<'/api/v1/columns', 'get'>;

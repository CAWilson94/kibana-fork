/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator, @kbn/openapi-generator.
 *
 * info:
 *   title: Workflow Insights API
 *   version: 1
 */

import { z } from '@kbn/zod';
import { ArrayFromString } from '@kbn/zod-helpers';

import { SuccessResponse } from '../model/schema/common.gen';

export type GetWorkflowInsightsRequestQuery = z.infer<typeof GetWorkflowInsightsRequestQuery>;
export const GetWorkflowInsightsRequestQuery = z.object({
  size: z.coerce.number().int().optional(),
  from: z.coerce.number().int().optional(),
  ids: ArrayFromString(z.string()).optional(),
  categories: ArrayFromString(z.literal('endpoint')).optional(),
  types: ArrayFromString(z.enum(['incompatible_antivirus', 'noisy_process_tree'])).optional(),
  sourceTypes: ArrayFromString(z.literal('llm-connector')).optional(),
  sourceIds: ArrayFromString(z.string()).optional(),
  targetTypes: ArrayFromString(z.literal('endpoint')).optional(),
  targetIds: ArrayFromString(z.string()).optional(),
  actionTypes: ArrayFromString(z.enum(['refreshed', 'remediated', 'suppressed', 'dismissed'])),
});
export type GetWorkflowInsightsRequestQueryInput = z.input<typeof GetWorkflowInsightsRequestQuery>;

export type GetWorkflowInsightsResponse = z.infer<typeof GetWorkflowInsightsResponse>;
export const GetWorkflowInsightsResponse = SuccessResponse;

export type UpdateWorkflowInsightRequestParams = z.infer<typeof UpdateWorkflowInsightRequestParams>;
export const UpdateWorkflowInsightRequestParams = z.object({
  insightId: z.string().min(1),
});
export type UpdateWorkflowInsightRequestParamsInput = z.input<
  typeof UpdateWorkflowInsightRequestParams
>;

export type UpdateWorkflowInsightRequestBody = z.infer<typeof UpdateWorkflowInsightRequestBody>;
export const UpdateWorkflowInsightRequestBody = z.object({
  '@timestamp': z.string().optional(),
  message: z.string().optional(),
  category: z.literal('endpoint').optional(),
  type: z.enum(['incompatible_antivirus', 'noisy_process_tree']).optional(),
  source: z
    .object({
      type: z.literal('llm-connector').optional(),
      id: z.string().optional(),
      data_range_start: z.string().optional(),
      data_range_end: z.string().optional(),
    })
    .optional(),
  target: z
    .object({
      type: z.literal('endpoint').optional(),
      ids: z.array(z.string()).optional(),
    })
    .optional(),
  action: z
    .object({
      type: z.enum(['refreshed', 'remediated', 'suppressed', 'dismissed']).optional(),
      timestamp: z.string().optional(),
    })
    .optional(),
  value: z.string().optional(),
  remediation: z
    .object({
      exception_list_items: z
        .array(
          z.object({
            list_id: z.string().optional(),
            name: z.string().optional(),
            description: z.string().optional(),
            entries: z.array(z.unknown()).optional(),
            tags: z.array(z.string()).optional(),
            os_types: z.array(z.string()).optional(),
          })
        )
        .optional(),
    })
    .optional(),
  metadata: z
    .object({
      notes: z.object({}).catchall(z.string()).optional(),
      message_variables: z.array(z.string()).optional(),
    })
    .optional(),
});
export type UpdateWorkflowInsightRequestBodyInput = z.input<
  typeof UpdateWorkflowInsightRequestBody
>;

export type UpdateWorkflowInsightResponse = z.infer<typeof UpdateWorkflowInsightResponse>;
export const UpdateWorkflowInsightResponse = SuccessResponse;

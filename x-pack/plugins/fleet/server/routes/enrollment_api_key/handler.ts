/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { type RequestHandler, SavedObjectsErrorHelpers } from '@kbn/core/server';
import type { TypeOf } from '@kbn/config-schema';

import type {
  GetEnrollmentAPIKeysRequestSchema,
  PostEnrollmentAPIKeyRequestSchema,
  DeleteEnrollmentAPIKeyRequestSchema,
  GetOneEnrollmentAPIKeyRequestSchema,
} from '../../types';
import type {
  GetEnrollmentAPIKeysResponse,
  GetOneEnrollmentAPIKeyResponse,
  DeleteEnrollmentAPIKeyResponse,
  PostEnrollmentAPIKeyResponse,
} from '../../../common/types';
import * as APIKeyService from '../../services/api_keys';
import { agentPolicyService } from '../../services/agent_policy';
import { AgentPolicyNotFoundError } from '../../errors';
import { getCurrentNamespace } from '../../services/spaces/get_current_namespace';
import { isSpaceAwarenessEnabled } from '../../services/spaces/helpers';

export const getEnrollmentApiKeysHandler: RequestHandler<
  undefined,
  TypeOf<typeof GetEnrollmentAPIKeysRequestSchema.query>
> = async (context, request, response) => {
  // Use kibana_system and depend on authz checks on HTTP layer to prevent abuse
  const esClient = (await context.core).elasticsearch.client.asInternalUser;
  const soClient = (await context.core).savedObjects.client;

  const useSpaceAwareness = await isSpaceAwarenessEnabled();
  const { items, total, page, perPage } = await APIKeyService.listEnrollmentApiKeys(esClient, {
    page: request.query.page,
    perPage: request.query.perPage,
    kuery: request.query.kuery,
    spaceId: useSpaceAwareness ? getCurrentNamespace(soClient) : undefined,
  });
  const body: GetEnrollmentAPIKeysResponse = {
    list: items, // deprecated
    items,
    total,
    page,
    perPage,
  };

  return response.ok({ body });
};
export const postEnrollmentApiKeyHandler: RequestHandler<
  undefined,
  undefined,
  TypeOf<typeof PostEnrollmentAPIKeyRequestSchema.body>
> = async (context, request, response) => {
  const { elasticsearch, savedObjects } = await context.core;
  const soClient = savedObjects.client;
  const esClient = elasticsearch.client.asInternalUser;
  // validate policy exists in the current space
  await agentPolicyService.get(soClient, request.body.policy_id).catch((err) => {
    if (SavedObjectsErrorHelpers.isNotFoundError(err)) {
      throw new AgentPolicyNotFoundError(`Agent policy "${request.body.policy_id}" not found`);
    }

    throw err;
  });

  const apiKey = await APIKeyService.generateEnrollmentAPIKey(soClient, esClient, {
    name: request.body.name,
    expiration: request.body.expiration,
    agentPolicyId: request.body.policy_id,
  });

  const body: PostEnrollmentAPIKeyResponse = { item: apiKey, action: 'created' };

  return response.ok({ body });
};

export const deleteEnrollmentApiKeyHandler: RequestHandler<
  TypeOf<typeof DeleteEnrollmentAPIKeyRequestSchema.params>
> = async (context, request, response) => {
  try {
    const useSpaceAwareness = await isSpaceAwarenessEnabled();
    const coreContext = await context.core;
    const esClient = coreContext.elasticsearch.client.asInternalUser;
    const currentNamespace = getCurrentNamespace(coreContext.savedObjects.client);
    await APIKeyService.deleteEnrollmentApiKey(
      esClient,
      request.params.keyId,
      false,
      useSpaceAwareness ? currentNamespace : undefined
    );

    const body: DeleteEnrollmentAPIKeyResponse = { action: 'deleted' };

    return response.ok({ body });
  } catch (error) {
    if (error.isBoom && error.output.statusCode === 404) {
      return response.notFound({
        body: { message: `EnrollmentAPIKey ${request.params.keyId} not found` },
      });
    }
    throw error;
  }
};

export const getOneEnrollmentApiKeyHandler: RequestHandler<
  TypeOf<typeof GetOneEnrollmentAPIKeyRequestSchema.params>
> = async (context, request, response) => {
  // Use kibana_system and depend on authz checks on HTTP layer to prevent abuse

  try {
    const coreContext = await context.core;
    const esClient = coreContext.elasticsearch.client.asInternalUser;
    const currentNamespace = getCurrentNamespace(coreContext.savedObjects.client);
    const useSpaceAwareness = await isSpaceAwarenessEnabled();

    const apiKey = await APIKeyService.getEnrollmentAPIKey(
      esClient,
      request.params.keyId,
      useSpaceAwareness ? currentNamespace : undefined
    );
    const body: GetOneEnrollmentAPIKeyResponse = { item: apiKey };

    return response.ok({ body });
  } catch (error) {
    if (error.isBoom && error.output.statusCode === 404) {
      return response.notFound({
        body: { message: `EnrollmentAPIKey ${request.params.keyId} not found` },
      });
    }

    throw error;
  }
};

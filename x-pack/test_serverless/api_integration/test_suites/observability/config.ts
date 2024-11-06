/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { CA_CERT_PATH, KBN_CERT_PATH, KBN_KEY_PATH } from '@kbn/dev-utils';
import { createTestConfig } from '../../config.base';
import { services as apmServices } from './apm_api_integration/common/services';
import { services as datasetQualityServices } from './dataset_quality_api_integration/common/services';

export default createTestConfig({
  serverlessProject: 'oblt',
  testFiles: [require.resolve('.')],
  junit: {
    reportName: 'Serverless Observability API Integration Tests',
  },
  suiteTags: { exclude: ['skipSvlOblt'] },
  services: { ...apmServices, ...datasetQualityServices },

  // include settings from project controller
  // https://github.com/elastic/project-controller/blob/main/internal/project/observability/config/elasticsearch.yml
  esServerArgs: ['xpack.ml.dfa.enabled=false'],
  kbnServerArgs: [
    // defined in MKI control plane
    '--xpack.uptime.service.manifestUrl=mockDevUrl',
    // useful for testing (also enabled in MKI QA)
    '--coreApp.allowDynamicConfigOverrides=true',
    '--xpack.dataUsage.enabled=true',
    // dataUsage.autoops* config is set in kibana controller
    '--xpack.dataUsage.autoops.enabled=true',
    '--xpack.dataUsage.autoops.api.url=http://localhost:9000',
    `--xpack.dataUsage.autoops.api.tls.certificate=${KBN_CERT_PATH}`,
    `--xpack.dataUsage.autoops.api.tls.key=${KBN_KEY_PATH}`,
    `--xpack.dataUsage.autoops.api.tls.ca=${CA_CERT_PATH}`,
  ],
});

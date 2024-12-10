/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { Chart, Metric, Settings } from '@elastic/charts';
import { EuiIcon, EuiPanel, type UseEuiTheme, useEuiTheme } from '@elastic/eui';
import type { PartialTheme, Theme } from '@elastic/charts';
import { i18n } from '@kbn/i18n';
import { COMPARATORS } from '@kbn/alerting-comparators';

export interface ChartProps {
  theme?: UseEuiTheme<{}>;
  baseTheme: Theme;
}

export interface Props {
  chartProps: ChartProps;
  comparator: COMPARATORS | string;
  id: string;
  thresholds: number[];
  title: string;
  value: number;
  valueFormatter: (d: number) => string;
  warning?: {
    thresholds: number[];
    comparator: COMPARATORS;
  };
}

export const Threshold = ({
  chartProps: { theme, baseTheme },
  comparator,
  id,
  thresholds,
  title,
  value,
  valueFormatter,
  warning,
}: Props) => {
  const { euiTheme } = useEuiTheme();
  const color = euiTheme.colors.backgroundBaseDanger;

  return (
    <EuiPanel
      paddingSize="none"
      style={{
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        minWidth: '100%',
      }}
      hasShadow={false}
      data-test-subj={`threshold-${thresholds.join('-')}-${value}`}
    >
      <Chart>
        <Settings theme={theme as PartialTheme} baseTheme={baseTheme} locale={i18n.getLocale()} />
        <Metric
          id={id}
          data={[
            [
              {
                title,
                extra: (
                  <>
                    {i18n.translate('xpack.infra.alerting.thresholdExtraTitle', {
                      values: {
                        comparator,
                        threshold: thresholds.map((t) => valueFormatter(t)).join(' - '),
                      },
                      defaultMessage: `Alert when {comparator} {threshold}`,
                    })}
                    <br />
                    {warning &&
                      i18n.translate('xpack.infra.alerting.warningExtraTitle', {
                        values: {
                          comparator: warning.comparator,
                          threshold: warning.thresholds.map((t) => valueFormatter(t)).join(' - '),
                        },
                        defaultMessage: `Warn when {comparator} {threshold}`,
                      })}
                  </>
                ),
                color,
                value,
                valueFormatter,
                icon: ({ width, height, color: iconColor }) => (
                  <EuiIcon width={width} height={height} color={iconColor} type="alert" />
                ),
              },
            ],
          ]}
        />
      </Chart>
    </EuiPanel>
  );
};

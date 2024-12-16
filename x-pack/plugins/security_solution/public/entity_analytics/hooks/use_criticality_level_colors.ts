/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { useEuiTheme } from '@elastic/eui';
import type { CriticalityLevelWithUnassigned } from '../../../common/entity_analytics/asset_criticality/types';
// TODO: update these colors once severity color palette is available
export const useCriticalityLevelColors = (): Record<CriticalityLevelWithUnassigned, string> => {
  const { euiTheme } = useEuiTheme();
  return {
     // low_impact: euiTheme.colors.vis.euiColorVisSuccess0,
     unassigned: euiTheme.colors.vis.euiColorVisNeutral0, // TODO: this is a closest guess based on severity colors, change to grey20 when available
     low_impact: euiTheme.flags.hasVisColorAdjustment
      ? '#54B399'
      : euiTheme.colors.vis.euiColorVisSuccess0,
      medium_impact: euiTheme.flags.hasVisColorAdjustment
      ? 'D6BF57'
      : euiTheme.colors.vis.euiColorVis9,
      high_impact: euiTheme.flags.hasVisColorAdjustment
      ? '#DA8B45'
      : euiTheme.colors.vis.euiColorVisWarm1,
    extreme_impact: euiTheme.flags.hasVisColorAdjustment
      ? '#F66D64'
      : euiTheme.colors.vis.euiColorVis6,
  };
};

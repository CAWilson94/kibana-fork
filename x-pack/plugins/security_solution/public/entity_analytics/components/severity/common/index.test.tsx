/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { render } from '@testing-library/react';
import React from 'react';

import { TestProviders } from '../../../../common/mock';

import type { EuiHealthProps } from '@elastic/eui';
import { EuiHealth } from '@elastic/eui';

import { RiskSeverity } from '../../../../../common/search_strategy';
import { RiskScoreLevel } from '.';
import { RISK_SEVERITY_COLOUR } from '../../../common/utils';

jest.mock('@elastic/eui', () => {
  const original = jest.requireActual('@elastic/eui');
  return {
    ...jest.requireActual('@elastic/eui'),
    EuiHealth: jest.fn((props: EuiHealthProps) => <original.EuiHealth {...props} />),
  };
});

describe('RiskScore', () => {
  const context = {};
  it('renders critical severity risk score', () => {
    const { container } = render(
      <TestProviders>
        <RiskScoreLevel severity={RiskSeverity.Critical} />
      </TestProviders>
    );

    expect(container).toHaveTextContent(RiskSeverity.Critical);

    expect(EuiHealth as jest.Mock).toHaveBeenLastCalledWith(
      expect.objectContaining({ color: RISK_SEVERITY_COLOUR.Critical }),
      context
    );
  });

  it('renders hight severity risk score', () => {
    const { container } = render(
      <TestProviders>
        <RiskScoreLevel severity={RiskSeverity.High} />
      </TestProviders>
    );

    expect(container).toHaveTextContent(RiskSeverity.High);

    expect(EuiHealth as jest.Mock).toHaveBeenLastCalledWith(
      expect.objectContaining({ color: RISK_SEVERITY_COLOUR.High }),
      context
    );
  });

  it('renders moderate severity risk score', () => {
    const { container } = render(
      <TestProviders>
        <RiskScoreLevel severity={RiskSeverity.Moderate} />
      </TestProviders>
    );

    expect(container).toHaveTextContent(RiskSeverity.Moderate);

    expect(EuiHealth as jest.Mock).toHaveBeenLastCalledWith(
      expect.objectContaining({ color: RISK_SEVERITY_COLOUR.Moderate }),
      context
    );
  });

  it('renders low severity risk score', () => {
    const { container } = render(
      <TestProviders>
        <RiskScoreLevel severity={RiskSeverity.Low} />
      </TestProviders>
    );

    expect(container).toHaveTextContent(RiskSeverity.Low);

    expect(EuiHealth as jest.Mock).toHaveBeenLastCalledWith(
      expect.objectContaining({ color: RISK_SEVERITY_COLOUR.Low }),
      context
    );
  });

  it('renders unknown severity risk score', () => {
    const { container } = render(
      <TestProviders>
        <RiskScoreLevel severity={RiskSeverity.Unknown} />
      </TestProviders>
    );

    expect(container).toHaveTextContent(RiskSeverity.Unknown);

    expect(EuiHealth as jest.Mock).toHaveBeenLastCalledWith(
      expect.objectContaining({ color: RISK_SEVERITY_COLOUR.Unknown }),
      context
    );
  });

  it("doesn't render background-color when hideBackgroundColor is true", () => {
    const { queryByTestId } = render(
      <TestProviders>
        <RiskScoreLevel severity={RiskSeverity.Critical} hideBackgroundColor />
      </TestProviders>
    );

    expect(queryByTestId('risk-score')).toHaveStyleRule('background-color', undefined);
  });
});

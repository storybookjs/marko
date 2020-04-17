import React, { useCallback } from 'react';

import { styled } from '@storybook/theming';

import { ActionBar, Icons, ScrollArea } from '@storybook/components';

import { AxeResults } from 'axe-core';
import { useChannel, useParameter, useStorybookState } from '@storybook/api';
import { Report } from './Report';
import { Tabs } from './Tabs';

import { useA11yContext } from './A11yContext';
import { EVENTS } from '../constants';
import { A11yParameters } from '../params';

export enum RuleType {
  VIOLATION,
  PASS,
  INCOMPLETION,
}

const Icon = styled(Icons)({
  height: 12,
  width: 12,
  marginRight: 4,
});

const RotatingIcon = styled(Icon)<{}>(({ theme }) => ({
  animation: `${theme.animation.rotate360} 1s linear infinite;`,
}));

const Passes = styled.span<{}>(({ theme }) => ({
  color: theme.color.positive,
}));

const Violations = styled.span<{}>(({ theme }) => ({
  color: theme.color.negative,
}));

const Incomplete = styled.span<{}>(({ theme }) => ({
  color: theme.color.warning,
}));

const Centered = styled.span<{}>({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});

type Status = 'initial' | 'manual' | 'running' | 'error' | 'ran' | 'ready';

export const A11YPanel: React.FC = () => {
  const [status, setStatus] = React.useState<Status>('initial');
  const [error, setError] = React.useState<unknown>(undefined);
  const { setResults, results } = useA11yContext();
  const { passes, incomplete, violations } = results;
  const { storyId } = useStorybookState();
  const { manual } = useParameter<Pick<A11yParameters, 'manual'>>('a11y', {
    manual: false,
  });

  React.useEffect(() => {
    setStatus(manual ? 'manual' : 'initial');
  }, [manual]);

  const handleResult = (axeResults: AxeResults) => {
    setStatus('ran');
    setResults(axeResults);

    setTimeout(() => {
      if (status === 'ran') {
        setStatus('ready');
      }
    }, 900);
  };

  const handleError = useCallback((err: unknown) => {
    setStatus('error');
    setError(err);
  }, []);

  const emit = useChannel({
    [EVENTS.RESULT]: handleResult,
    [EVENTS.ERROR]: handleError,
  });

  const handleManual = useCallback(() => {
    setStatus('running');
    emit(EVENTS.MANUAL, storyId);
  }, [storyId]);

  return (
    <>
      {status === 'initial' && <Centered>Initializing...</Centered>}
      {status === 'manual' && (
        <>
          <Centered>Manually run the accessibility scan.</Centered>
          <ActionBar key="actionbar" actionItems={[{ title: 'Run test', onClick: handleManual }]} />
        </>
      )}
      {status === 'running' && (
        <Centered>
          <RotatingIcon inline icon="sync" /> Please wait while the accessibility scan is running
          ...
        </Centered>
      )}
      {(status === 'ready' || status === 'ran') && (
        <>
          <ScrollArea vertical horizontal>
            <Tabs
              key="tabs"
              tabs={[
                {
                  label: <Violations>{violations.length} Violations</Violations>,
                  panel: (
                    <Report
                      items={violations}
                      type={RuleType.VIOLATION}
                      empty="No accessibility violations found."
                    />
                  ),
                  items: violations,
                  type: RuleType.VIOLATION,
                },
                {
                  label: <Passes>{passes.length} Passes</Passes>,
                  panel: (
                    <Report
                      items={passes}
                      type={RuleType.PASS}
                      empty="No accessibility checks passed."
                    />
                  ),
                  items: passes,
                  type: RuleType.PASS,
                },
                {
                  label: <Incomplete>{incomplete.length} Incomplete</Incomplete>,
                  panel: (
                    <Report
                      items={incomplete}
                      type={RuleType.INCOMPLETION}
                      empty="No accessibility checks incomplete."
                    />
                  ),
                  items: incomplete,
                  type: RuleType.INCOMPLETION,
                },
              ]}
            />
          </ScrollArea>
          <ActionBar
            key="actionbar"
            actionItems={[
              {
                title:
                  status === 'ready' ? (
                    'Rerun tests'
                  ) : (
                    <>
                      <Icon inline icon="check" /> Tests completed
                    </>
                  ),
                onClick: handleManual,
              },
            ]}
          />
        </>
      )}
      {status === 'error' && (
        <Centered>
          The accessibility scan encountered an error.
          <br />
          {error}
        </Centered>
      )}
    </>
  );
};

import React from 'react';
import styled from 'styled-components';
import { FaTable, FaChartBar, FaExclamationTriangle } from 'react-icons/fa';
import { getTypeLabel, getTypeIcon, isNumericType, isCategoricalType } from '../utils/schemaInference';

/**
 * Data Profile Display Component
 * Shows data quality metrics, schema, and column statistics
 */

const ProfileContainer = styled.div`
  width: 100%;
  padding: 24px;
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const ProfileHeader = styled.div`
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border.default};

  h3 {
    font-size: ${props => props.theme.typography.sizes.h3}px;
    font-weight: 600;
    color: ${props => props.theme.colors.text.primary};
    margin: 0 0 16px 0;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const SummaryCard = styled.div`
  background: ${props => props.theme.colors.background.primary};
  padding: 16px;
  border-radius: ${props => props.theme.borderRadius.md};
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'rows':
        return props.theme.colors.primary.main;
      case 'columns':
        return props.theme.colors.secondary.main;
      case 'quality':
        return props.theme.colors.semantic.success.main;
      case 'issues':
        return props.theme.colors.semantic.warning.main;
      default:
        return props.theme.colors.border.default;
    }
  }};

  .label {
    font-size: ${props => props.theme.typography.sizes.small}px;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 8px;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .value {
    font-size: 28px;
    font-weight: 700;
    color: ${props => props.theme.colors.text.primary};
  }

  .unit {
    font-size: ${props => props.theme.typography.sizes.small}px;
    color: ${props => props.theme.colors.text.secondary};
    margin-left: 4px;
  }
`;

const QualityBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.background.tertiary};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;

  .bar {
    height: 100%;
    background: ${props => {
      const score = props.score;
      if (score >= 90) return props.theme.colors.semantic.success.main;
      if (score >= 70) return props.theme.colors.semantic.warning.main;
      return props.theme.colors.semantic.error.main;
    }};
    width: ${props => props.score}%;
    transition: width ${props => props.theme.animations.durations.standard}ms;
  }
`;

const SchemaSection = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h4`
  font-size: ${props => props.theme.typography.sizes.body}px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  .icon {
    color: ${props => props.theme.colors.primary.main};
  }
`;

const ColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`;

const ColumnCard = styled.div`
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.default};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  transition: all ${props => props.theme.animations.durations.standard}ms;

  &:hover {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: ${props => props.theme.shadows.sm};
  }
`;

const ColumnHeader = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.background.tertiary};
  border-bottom: 1px solid ${props => props.theme.colors.border.default};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ColumnTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;

  .type-icon {
    font-size: 18px;
    flex-shrink: 0;
  }

  .name {
    font-weight: 600;
    color: ${props => props.theme.colors.text.primary};
    word-break: break-word;
  }

  .type {
    font-size: ${props => props.theme.typography.sizes.small}px;
    color: ${props => props.theme.colors.text.secondary};
    background: ${props => props.theme.colors.background.secondary};
    padding: 2px 8px;
    border-radius: 3px;
    white-space: nowrap;
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color ${props => props.theme.animations.durations.standard}ms;

  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const ColumnContent = styled.div`
  padding: 16px;
  display: block;

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    font-size: ${props => props.theme.typography.sizes.small}px;

    .label {
      color: ${props => props.theme.colors.text.secondary};
    }

    .value {
      color: ${props => props.theme.colors.text.primary};
      font-weight: 500;
    }
  }

  .stat-separator {
    height: 1px;
    background: ${props => props.theme.colors.border.default};
    margin: 12px 0;
  }

  .top-values {
    margin-top: 12px;
  }

  .top-value-item {
    padding: 6px 0;
    font-size: ${props => props.theme.typography.sizes.small}px;
    display: flex;
    justify-content: space-between;
    color: ${props => props.theme.colors.text.secondary};

    .value-name {
      font-family: monospace;
      color: ${props => props.theme.colors.text.primary};
      flex: 1;
      word-break: break-word;
    }

    .value-count {
      flex-shrink: 0;
      margin-left: 8px;
      background: ${props => props.theme.colors.background.tertiary};
      padding: 2px 6px;
      border-radius: 3px;
    }
  }
`;

const IssuesSection = styled.div`
  margin-top: 32px;
  padding: 16px;
  background: ${props => props.theme.colors.semantic.warning.light};
  border: 1px solid ${props => props.theme.colors.semantic.warning.main};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const IssuesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 8px 0;
    font-size: ${props => props.theme.typography.sizes.small}px;
    color: ${props => props.theme.colors.semantic.warning.dark};
    display: flex;
    gap: 8px;

    &::before {
      content: '⚠️';
      flex-shrink: 0;
    }
  }
`;

const DataPreview = styled.div`
  margin-top: 32px;
  overflow-x: auto;
  margin-bottom: 48px;

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: ${props => props.theme.typography.sizes.small}px;

    th {
      padding: 12px;
      text-align: left;
      background: ${props => props.theme.colors.background.tertiary};
      border-bottom: 2px solid ${props => props.theme.colors.border.default};
      font-weight: 600;
      color: ${props => props.theme.colors.text.primary};
      white-space: nowrap;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid ${props => props.theme.colors.border.default};
      color: ${props => props.theme.colors.text.secondary};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }

    tr:hover td {
      background: ${props => props.theme.colors.background.tertiary};
    }
  }
`;

const DataProfile = ({ profile, data, headers }) => {
  if (!profile || !data) {
    return (
      <ProfileContainer>
        <p>No data to display. Please upload a file first.</p>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <h3>Data Profile & Schema</h3>
      </ProfileHeader>

      {/* Summary Stats */}
      <SummaryGrid>
        <SummaryCard type="rows">
          <div className="label">Total Rows</div>
          <div className="value">{profile.summary.totalRows.toLocaleString()}</div>
        </SummaryCard>

        <SummaryCard type="columns">
          <div className="label">Columns</div>
          <div className="value">{profile.summary.totalColumns}</div>
        </SummaryCard>

        <SummaryCard type="quality">
          <div className="label">Quality Score</div>
          <div className="value">{profile.quality.overall}%</div>
          <QualityBar score={profile.quality.overall}>
            <div className="bar" />
          </QualityBar>
        </SummaryCard>

        <SummaryCard type="issues">
          <div className="label">Issues Detected</div>
          <div className="value">{profile.quality.issues.length}</div>
        </SummaryCard>
      </SummaryGrid>

      {/* Data Quality Metrics */}
      <SummaryGrid>
        <SummaryCard type="quality">
          <div className="label">Completeness</div>
          <div className="value">{profile.quality.completeness}%</div>
        </SummaryCard>

        <SummaryCard type="quality">
          <div className="label">Validity</div>
          <div className="value">{profile.quality.validity}%</div>
        </SummaryCard>
      </SummaryGrid>

         {/* Data Preview */}
      {data.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <SectionTitle>
            <FaChartBar className="icon" /> Data Preview (First 10 Rows)
          </SectionTitle>
          <DataPreview>
            <table>
              <thead>
                <tr>
                  {headers.map(header => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 10).map((row, idx) => (
                  <tr key={idx}>
                    {headers.map(header => (
                      <td key={`${idx}-${header}`}>{row[header]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </DataPreview>
        </div>
      )}

      {/* Schema Information */}
      <SchemaSection>
        <SectionTitle>
          <FaTable className="icon" /> Column Information
        </SectionTitle>

        <ColumnGrid>
          {headers.map((columnName) => {
            const columnProfile = profile.columns[columnName];
            if (!columnProfile) return null;

            return (
              <ColumnCard key={columnName}>
                <ColumnHeader>
                  <ColumnTitle>
                    <span className="type-icon">{getTypeIcon(columnProfile.type)}</span>
                    <div>
                      <div className="name">{columnName}</div>
                      <span className="type">{getTypeLabel(columnProfile.type)}</span>
                    </div>
                  </ColumnTitle>
                </ColumnHeader>

                <ColumnContent>
                  <div className="stat-row">
                    <span className="label">Non-Null</span>
                    <span className="value">
                      {columnProfile.nonNullCount} ({(100 - columnProfile.nullPercentage).toFixed(1)}%)
                    </span>
                  </div>

                  <div className="stat-row">
                    <span className="label">Missing</span>
                    <span className="value">
                      {columnProfile.nullCount} ({columnProfile.nullPercentage}%)
                    </span>
                  </div>

                  <div className="stat-row">
                    <span className="label">Unique</span>
                    <span className="value">{columnProfile.uniqueCount}</span>
                  </div>

                  {columnProfile.duplicatePercentage > 0 && (
                    <div className="stat-row">
                      <span className="label">Duplicates</span>
                      <span className="value">{columnProfile.duplicatePercentage}%</span>
                    </div>
                  )}

                  {columnProfile.stats && (
                    <>
                      <div className="stat-separator" />

                      {isNumericType(columnProfile.type) && (
                        <>
                          <div className="stat-row">
                            <span className="label">Min</span>
                            <span className="value">{columnProfile.stats.min.toLocaleString()}</span>
                          </div>
                          <div className="stat-row">
                            <span className="label">Max</span>
                            <span className="value">{columnProfile.stats.max.toLocaleString()}</span>
                          </div>
                          <div className="stat-row">
                            <span className="label">Mean</span>
                            <span className="value">{columnProfile.stats.mean}</span>
                          </div>
                          <div className="stat-row">
                            <span className="label">Median</span>
                            <span className="value">{columnProfile.stats.median}</span>
                          </div>
                          <div className="stat-row">
                            <span className="label">Std Dev</span>
                            <span className="value">{columnProfile.stats.stdDev}</span>
                          </div>
                        </>
                      )}

                      {isCategoricalType(columnProfile.type) && columnProfile.stats?.topValues && (
                        <div className="top-values">
                          <div className="label" style={{ marginBottom: '8px' }}>
                            Top Values:
                          </div>
                          {columnProfile.stats.topValues.slice(0, 5).map((item, idx) => (
                            <div key={idx} className="top-value-item">
                              <span className="value-name">{item.value}</span>
                              <span className="value-count">{item.count}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </ColumnContent>
              </ColumnCard>
            );
          })}
        </ColumnGrid>
      </SchemaSection>

      {/* Issues Section */}
      {profile.quality.issues.length > 0 && (
        <IssuesSection>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <FaExclamationTriangle />
            <strong>Data Quality Issues Detected</strong>
          </div>
          <IssuesList>
            {profile.quality.issues.map((issue, idx) => (
              <li key={idx}>
                <strong>{issue.column}:</strong> {issue.message}
              </li>
            ))}
          </IssuesList>
        </IssuesSection>
      )}

   
    </ProfileContainer>
  );
};

export default DataProfile;

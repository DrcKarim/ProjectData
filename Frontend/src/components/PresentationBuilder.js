/**
 * Presentation Builder Component
 * Create and edit presentation slides with narrative flow
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import {
  usePresentationStore,
  createDefaultSlide,
  createAnnotation,
  SlideTypes,
  AnnotationTypes,
  PresentationThemes,
} from '../utils/presentationUtils';
import { ChartTypes, createDefaultChartConfig } from '../utils/chartConfig';

const BuilderContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8fafc;
`;

const BuilderHeader = styled.div`
  background: white;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BuilderTitle = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: 1.5rem;
`;

const BuilderActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const BuilderContent = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr 350px;
  flex: 1;
  overflow: hidden;
`;

const SlideList = styled.div`
  background: white;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
  padding: 1rem;
`;

const SlidePreview = styled.div`
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: auto;
`;

const SlideEditor = styled.div`
  background: white;
  border-left: 1px solid #e2e8f0;
  overflow-y: auto;
  padding: 2rem;
`;

const SlideItem = styled.div`
  background: ${(props) => (props.active ? '#eff6ff' : 'white')};
  border: 2px solid ${(props) => (props.active ? '#3b82f6' : '#e2e8f0')};
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    transform: translateX(4px);
  }
`;

const SlideNumber = styled.div`
  background: #3b82f6;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const SlideItemTitle = styled.div`
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
`;

const SlideItemType = styled.div`
  font-size: 0.8rem;
  color: #64748b;
  text-transform: uppercase;
`;

const Button = styled.button`
  background: ${(props) => (props.primary ? '#3b82f6' : 'white')};
  color: ${(props) => (props.primary ? 'white' : '#0f172a')};
  border: 2px solid ${(props) => (props.primary ? '#3b82f6' : '#e2e8f0')};
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${(props) => (props.primary ? '#2563eb' : '#f8fafc')};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const SectionTitle = styled.h3`
  color: #0f172a;
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
`;

const AnnotationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const AnnotationItem = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddButton = styled(Button)`
  width: 100%;
  justify-content: center;
  margin-top: 1rem;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: background 0.2s;

  &:hover {
    background: #fee2e2;
  }
`;

const BulletList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const BulletItem = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

function PresentationBuilder({ data, onStartPresentation }) {
  const {
    slides,
    currentSlide,
    annotations,
    presentationConfig,
    addSlide,
    updateSlide,
    removeSlide,
    reorderSlides,
    goToSlide,
    setPresentationConfig,
    addAnnotation,
    removeAnnotation,
  } = usePresentationStore();

  const [selectedSlide, setSelectedSlide] = useState(currentSlide);
  const currentSlideData = slides[selectedSlide] || null;
  const slideAnnotations = annotations[selectedSlide] || [];

  const handleAddSlide = (type) => {
    const newSlide = createDefaultSlide(type);
    addSlide(newSlide);
    setSelectedSlide(slides.length);
  };

  const handleSelectSlide = (index) => {
    setSelectedSlide(index);
    goToSlide(index);
  };

  const handleUpdateSlide = (field, value) => {
    if (currentSlideData) {
      updateSlide(selectedSlide, { [field]: value });
    }
  };

  const handleUpdateContent = (field, value) => {
    if (currentSlideData) {
      updateSlide(selectedSlide, {
        content: { ...currentSlideData.content, [field]: value },
      });
    }
  };

  const handleAddAnnotation = (type) => {
    const annotation = createAnnotation(type, { x: '50%', y: '50%' }, 'New Annotation');
    addAnnotation(selectedSlide, annotation);
  };

  const handleAddBullet = () => {
    if (currentSlideData && currentSlideData.content.bullets) {
      const bullets = [...currentSlideData.content.bullets, 'New bullet point'];
      handleUpdateContent('bullets', bullets);
    }
  };

  const handleUpdateBullet = (index, value) => {
    if (currentSlideData && currentSlideData.content.bullets) {
      const bullets = [...currentSlideData.content.bullets];
      bullets[index] = value;
      handleUpdateContent('bullets', bullets);
    }
  };

  const handleRemoveBullet = (index) => {
    if (currentSlideData && currentSlideData.content.bullets) {
      const bullets = currentSlideData.content.bullets.filter((_, i) => i !== index);
      handleUpdateContent('bullets', bullets);
    }
  };

  return (
    <BuilderContainer>
      <BuilderHeader>
        <BuilderTitle>📊 Presentation Builder</BuilderTitle>
        <BuilderActions>
          <Button onClick={() => onStartPresentation?.()}>▶️ Present</Button>
          <Button primary onClick={() => handleAddSlide(SlideTypes.CHART)}>
            + Add Slide
          </Button>
        </BuilderActions>
      </BuilderHeader>

      <BuilderContent>
        {/* Slide List */}
        <SlideList>
          <SectionTitle>Slides ({slides.length})</SectionTitle>
          {slides.map((slide, index) => (
            <SlideItem
              key={slide.id}
              active={index === selectedSlide}
              onClick={() => handleSelectSlide(index)}
            >
              <SlideNumber>{index + 1}</SlideNumber>
              <SlideItemTitle>{slide.title || 'Untitled Slide'}</SlideItemTitle>
              <SlideItemType>{slide.type}</SlideItemType>
            </SlideItem>
          ))}

          <AddButton onClick={() => handleAddSlide(SlideTypes.CHART)}>
            + Add Slide
          </AddButton>
        </SlideList>

        {/* Slide Preview */}
        <SlidePreview>
          {currentSlideData ? (
            <div style={{ textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                {currentSlideData.title || 'Untitled Slide'}
              </div>
              <div style={{ marginTop: '1rem' }}>Type: {currentSlideData.type}</div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
              <div>No slide selected</div>
            </div>
          )}
        </SlidePreview>

        {/* Slide Editor */}
        <SlideEditor>
          {currentSlideData ? (
            <>
              <SectionTitle>Edit Slide</SectionTitle>

              <FormGroup>
                <Label>Slide Type</Label>
                <Select
                  value={currentSlideData.type}
                  onChange={(e) => handleUpdateSlide('type', e.target.value)}
                >
                  {Object.values(SlideTypes).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Title</Label>
                <Input
                  type="text"
                  value={currentSlideData.title}
                  onChange={(e) => handleUpdateSlide('title', e.target.value)}
                  placeholder="Slide title"
                />
              </FormGroup>

              <FormGroup>
                <Label>Subtitle</Label>
                <Input
                  type="text"
                  value={currentSlideData.subtitle || ''}
                  onChange={(e) => handleUpdateSlide('subtitle', e.target.value)}
                  placeholder="Slide subtitle (optional)"
                />
              </FormGroup>

              <FormGroup>
                <Label>Speaker Notes</Label>
                <TextArea
                  value={currentSlideData.notes || ''}
                  onChange={(e) => handleUpdateSlide('notes', e.target.value)}
                  placeholder="Add notes for this slide..."
                />
              </FormGroup>

              {/* Content specific to slide type */}
              {currentSlideData.type === SlideTypes.TEXT && (
                <>
                  <FormGroup>
                    <Label>Body Text</Label>
                    <TextArea
                      value={currentSlideData.content.body || ''}
                      onChange={(e) => handleUpdateContent('body', e.target.value)}
                      placeholder="Main text content..."
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Bullet Points</Label>
                    <BulletList>
                      {(currentSlideData.content.bullets || []).map((bullet, index) => (
                        <BulletItem key={index}>
                          <Input
                            type="text"
                            value={bullet}
                            onChange={(e) => handleUpdateBullet(index, e.target.value)}
                            placeholder="Bullet point"
                          />
                          <DeleteButton onClick={() => handleRemoveBullet(index)}>
                            ✕
                          </DeleteButton>
                        </BulletItem>
                      ))}
                    </BulletList>
                    <AddButton onClick={handleAddBullet}>+ Add Bullet</AddButton>
                  </FormGroup>
                </>
              )}

              {currentSlideData.type === SlideTypes.KEY_INSIGHT && (
                <>
                  <FormGroup>
                    <Label>Metric Value</Label>
                    <Input
                      type="text"
                      value={currentSlideData.content.metric?.value || ''}
                      onChange={(e) =>
                        handleUpdateContent('metric', {
                          ...currentSlideData.content.metric,
                          value: e.target.value,
                        })
                      }
                      placeholder="e.g., $2.5M, 45%, 1,250"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Metric Label</Label>
                    <Input
                      type="text"
                      value={currentSlideData.content.metric?.label || ''}
                      onChange={(e) =>
                        handleUpdateContent('metric', {
                          ...currentSlideData.content.metric,
                          label: e.target.value,
                        })
                      }
                      placeholder="e.g., Revenue, Growth Rate"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Insight Text</Label>
                    <TextArea
                      value={currentSlideData.content.insight || ''}
                      onChange={(e) => handleUpdateContent('insight', e.target.value)}
                      placeholder="Key insight or finding..."
                    />
                  </FormGroup>
                </>
              )}

              {currentSlideData.type === SlideTypes.CHART && (
                <FormGroup>
                  <Label>Chart Configuration</Label>
                  <Select
                    onChange={(e) => {
                      if (e.target.value) {
                        const chartConfig = createDefaultChartConfig(e.target.value);
                        handleUpdateContent('chartConfig', chartConfig);
                      }
                    }}
                  >
                    <option value="">Select chart type...</option>
                    {Object.entries(ChartTypes).map(([key, type]) => (
                      <option key={key} value={type.type}>
                        {type.name}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              )}

              {/* Annotations */}
              <SectionTitle style={{ marginTop: '2rem' }}>
                Annotations ({slideAnnotations.length})
              </SectionTitle>

              <FormGroup>
                <Label>Add Annotation</Label>
                <Select onChange={(e) => e.target.value && handleAddAnnotation(e.target.value)}>
                  <option value="">Select annotation type...</option>
                  {Object.entries(AnnotationTypes).map(([key, type]) => (
                    <option key={key} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <AnnotationList>
                {slideAnnotations.map((annotation) => (
                  <AnnotationItem key={annotation.id}>
                    <span>
                      {annotation.type}: {annotation.content}
                    </span>
                    <DeleteButton onClick={() => removeAnnotation(selectedSlide, annotation.id)}>
                      ✕
                    </DeleteButton>
                  </AnnotationItem>
                ))}
              </AnnotationList>

              {/* Delete Slide */}
              <FormGroup style={{ marginTop: '2rem' }}>
                <Button
                  onClick={() => {
                    if (window.confirm('Delete this slide?')) {
                      removeSlide(selectedSlide);
                      setSelectedSlide(Math.max(0, selectedSlide - 1));
                    }
                  }}
                  style={{ background: '#ef4444', borderColor: '#ef4444', color: 'white' }}
                >
                  🗑️ Delete Slide
                </Button>
              </FormGroup>
            </>
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👈</div>
              <div>Select a slide to edit</div>
            </div>
          )}
        </SlideEditor>
      </BuilderContent>
    </BuilderContainer>
  );
}

export default PresentationBuilder;

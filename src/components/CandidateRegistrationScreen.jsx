import { useState } from 'react'
import styled from 'styled-components'
import {
  Field,
  PageContent,
  Panel,
  PanelTitleRow,
  Pill,
  PrimaryButton,
  SecondaryButton,
  SectionHeading,
} from '../styles/primitives'
import { createEmptyForm } from '../utils/electionUtils'
import CandidateListItem from './CandidateListItem'

function CandidateRegistrationScreen({
  candidates,
  onAddCandidate,
  onDeleteCandidate,
  onUpdateCandidate,
}) {
  const [editingId, setEditingId] = useState('')
  const [form, setForm] = useState(() => createEmptyForm(candidates))
  const [message, setMessage] = useState('')

  const editingCandidate = candidates.find((candidate) => candidate.id === editingId)

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
    setMessage('')
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.addEventListener('load', () => {
      setForm((current) => ({
        ...current,
        photoUrl: String(reader.result || ''),
        photoName: file.name,
      }))
    })
    reader.readAsDataURL(file)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const requiredValues = [
      form.number,
      form.name,
      form.className,
      form.pledge,
      form.description,
    ]
    const number = Number(form.number)
    const duplicatedNumber = candidates.some(
      (candidate) => candidate.number === number && candidate.id !== editingId,
    )

    if (requiredValues.some((value) => !String(value).trim())) {
      setMessage('기호, 후보자명, 학년/반, 공약 정보를 모두 입력해 주세요.')
      return
    }

    if (!Number.isInteger(number) || number < 1) {
      setMessage('기호는 1 이상의 숫자로 입력해 주세요.')
      return
    }

    if (duplicatedNumber) {
      setMessage('이미 사용 중인 기호입니다.')
      return
    }

    if (editingId) {
      onUpdateCandidate(editingId, form)
      setMessage(`${form.name} 후보 정보를 수정했습니다.`)
    } else {
      try {
        await onAddCandidate(form)
        setMessage(`${form.name} 후보를 등록했습니다.`)
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : '후보 등록에 실패했습니다.',
        )
        return
      }
    }

    setEditingId('')
    setForm(
      createEmptyForm(
        editingId
          ? candidates
          : [...candidates, { number: Number(form.number) }],
      ),
    )
  }

  function handleReset() {
    setEditingId('')
    setForm(createEmptyForm(candidates))
    setMessage('')
  }

  function handleEdit(candidate) {
    setEditingId(candidate.id)
    setForm({
      number: String(candidate.number),
      name: candidate.name,
      className: candidate.className,
      pledge: candidate.pledge,
      description: candidate.description,
      photoUrl: candidate.photoUrl,
      photoName: candidate.photoName,
    })
    setMessage(`${candidate.name} 후보를 수정 중입니다.`)
  }

  return (
    <PageContent>
      <SectionHeading>
        <h1>후보자 등록</h1>
        <p>후보 기본 정보와 공약을 입력하고 등록된 후보 목록을 관리합니다.</p>
      </SectionHeading>

      <Layout>
        <CandidateForm onSubmit={handleSubmit}>
          <PanelTitleRow>
            <h2>후보 정보 입력</h2>
            {editingCandidate && <Pill>수정 중</Pill>}
          </PanelTitleRow>

          <FormGrid>
            <Field>
              <span>기호</span>
              <input
                inputMode="numeric"
                onChange={(event) => updateForm('number', event.target.value)}
                value={form.number}
              />
            </Field>
            <Field>
              <span>후보자명</span>
              <input
                onChange={(event) => updateForm('name', event.target.value)}
                placeholder="김도윤"
                value={form.name}
              />
            </Field>
            <Field>
              <span>학년/반</span>
              <input
                onChange={(event) => updateForm('className', event.target.value)}
                placeholder="2학년 3반"
                value={form.className}
              />
            </Field>
          </FormGrid>

          <FieldBlock>
            <span>대표 공약</span>
            <input
              onChange={(event) => updateForm('pledge', event.target.value)}
              placeholder="자습실 예약제 도입"
              value={form.pledge}
            />
          </FieldBlock>

          <FieldBlock>
            <span>공약 설명</span>
            <textarea
              maxLength={120}
              onChange={(event) => updateForm('description', event.target.value)}
              placeholder="빈 강의실과 자습실을 온라인으로 예약하고 사용 현황을 확인할 수 있게 합니다."
              value={form.description}
            />
            <small>최대 120자까지 입력</small>
          </FieldBlock>

          <FormBottom>
            <PhotoUpload>
              <span>후보 사진</span>
              <input accept="image/*" onChange={handlePhotoChange} type="file" />
              <strong>
                {form.photoUrl ? (
                  <img alt="" src={form.photoUrl} />
                ) : (
                  <UploadGlyph />
                )}
              </strong>
              <em>{form.photoName || '이미지 선택'}</em>
            </PhotoUpload>

            <FormActions>
              <PrimaryButton type="submit">
                {editingId ? '수정 저장' : '후보 등록'}
              </PrimaryButton>
              <SecondaryButton onClick={handleReset} type="button">
                초기화
              </SecondaryButton>
            </FormActions>
          </FormBottom>

          {message && <FormMessage>{message}</FormMessage>}
        </CandidateForm>

        <CandidateList>
          <PanelTitleRow>
            <h2>등록된 후보</h2>
            <Pill>총 {candidates.length}명</Pill>
          </PanelTitleRow>

          <CandidateStack>
            {candidates.map((candidate) => (
              <CandidateListItem
                candidate={candidate}
                key={candidate.id}
                onDeleteCandidate={onDeleteCandidate}
                onEditCandidate={handleEdit}
              />
            ))}
          </CandidateStack>
        </CandidateList>
      </Layout>
    </PageContent>
  )
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 690px) minmax(420px, 550px);
  gap: clamp(24px, 3.2vw, 40px);
  align-items: start;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`

const CandidateForm = styled(Panel).attrs({ as: 'form' })`
  min-height: 0;
`

const CandidateList = styled(Panel).attrs({ as: 'aside' })`
  min-height: 0;
  max-height: calc(100dvh - 190px);
  overflow: hidden;

  @media (max-width: 1180px) {
    max-height: none;
    overflow: visible;
  }
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 176px;
  gap: clamp(16px, 2vw, 24px);
  margin-bottom: clamp(14px, 2vh, 24px);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

const FieldBlock = styled(Field)`
  margin-bottom: clamp(14px, 2vh, 24px);
`

const FormBottom = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 28px;

  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
  }
`

const PhotoUpload = styled.label`
  display: grid;
  gap: 6px;
  color: #475569;
  font-size: 13px;
  font-weight: 700;

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }

  strong {
    display: grid;
    width: 208px;
    height: clamp(84px, 12vh, 116px);
    place-items: center;
    overflow: hidden;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    cursor: pointer;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  em {
    margin-top: -42px;
    color: #64748b;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    text-align: center;
    pointer-events: none;
  }
`

const UploadGlyph = styled.span`
  display: block;
  width: 62px;
  height: 42px;
  margin-bottom: 24px;
  background: #e2e8f0;
  border-radius: 8px;
`

const FormActions = styled.div`
  display: flex;
  gap: 18px;
  padding-bottom: clamp(8px, 1.8vh, 18px);
`

const FormMessage = styled.p`
  margin: 10px 0 0;
  color: #0f766e;
  font-size: 13px;
  font-weight: 700;
`

const CandidateStack = styled.div`
  display: grid;
  gap: clamp(14px, 2.2vh, 30px);
  max-height: calc(100dvh - 290px);
  overflow: auto;
  padding-right: 2px;

  @media (max-width: 1180px) {
    max-height: none;
    overflow: visible;
  }
`

export default CandidateRegistrationScreen

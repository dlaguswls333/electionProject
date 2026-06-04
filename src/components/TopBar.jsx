import styled from 'styled-components'
import { NavLink, useNavigate } from 'react-router-dom'
import { ROUTES, getHomePath } from '../routes/routePaths'
import { GhostLink, Pill } from '../styles/primitives'

const NAV_ITEMS = [
  { path: ROUTES.candidates, label: '후보자 등록', adminOnly: true },
  { path: ROUTES.stats, label: '투표 현황 집계', adminOnly: true },
  { path: ROUTES.vote, label: '투표', adminOnly: false },
]

function TopBar({ onLogout, user }) {
  const navigate = useNavigate()
  const visibleItems = user
    ? NAV_ITEMS.filter((item) => !item.adminOnly || user.role === 'admin')
    : []

  function handleBrandClick() {
    navigate(getHomePath(user))
  }

  return (
    <Header>
      <Brand onClick={handleBrandClick}>
        <BrandLogo>D</BrandLogo>
        <span>
          <strong>대소고 Vote</strong>
          <small>웹 선거 시스템</small>
        </span>
      </Brand>

      {visibleItems.length > 0 && (
        <Nav aria-label="주요 화면">
          {visibleItems.map((item) => (
            <NavButton
              key={item.path}
              to={item.path}
            >
              {item.label}
            </NavButton>
          ))}
        </Nav>
      )}

      {user ? (
        <SessionBox>
          <Pill>{user.role === 'admin' ? '관리자' : '학생'}</Pill>
          <GhostLink onClick={onLogout}>로그아웃</GhostLink>
        </SessionBox>
      ) : (
        <LoginPill>로그인</LoginPill>
      )}
    </Header>
  )
}

const Header = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  height: 82px;
  padding: 0 40px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 1180px) {
    padding: 0 24px;
  }

  @media (max-width: 760px) {
    height: auto;
    min-height: 82px;
    flex-wrap: wrap;
    gap: 12px;
    padding: 16px;
  }
`

const Brand = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 210px;
  padding: 0;
  color: inherit;
  text-align: left;
  background: transparent;
  cursor: pointer;

  strong {
    display: block;
    color: #0f172a;
    font-size: 18px;
    line-height: 24px;
  }

  small {
    display: block;
    color: #64748b;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
  }

  @media (max-width: 760px) {
    min-width: 0;
  }
`

const BrandLogo = styled.span`
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  color: #ffffff;
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
  background: #0f766e;
  border-radius: 9px;
`

const Nav = styled.nav`
  position: absolute;
  left: 50%;
  display: flex;
  align-items: stretch;
  height: 82px;
  transform: translateX(-50%);

  @media (max-width: 1180px) {
    position: static;
    height: 82px;
    margin-left: 32px;
    transform: none;
  }

  @media (max-width: 760px) {
    order: 3;
    width: 100%;
    height: 48px;
    margin-left: 0;
    overflow-x: auto;
  }
`

const NavButton = styled(NavLink)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 112px;
  padding: 0 14px;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;

  &::after {
    position: absolute;
    right: 18px;
    bottom: 0;
    left: 18px;
    height: 3px;
    background: transparent;
    border-radius: 2px;
    content: '';
  }

  &.active {
    color: #0f766e;
    font-weight: 800;
  }

  &.active::after {
    background: #0f766e;
  }

  @media (max-width: 760px) {
    min-width: max-content;
  }
`

const SessionBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
`

const LoginPill = styled(Pill)`
  margin-left: auto;
`

export default TopBar

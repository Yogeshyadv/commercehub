import React, { useState } from 'react';
import { Search, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { catalogService } from '../../../services/catalogService';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────────────────────────────────────────
   SCALED PREVIEW CANVAS
   Designs are authored at 2× native size then scale(0.5) to fit the card.
   This gives crisp, detailed miniature store layouts at any card width.
───────────────────────────────────────────────────────────────────────────── */
const S = ({ bg = '#fff', children }) => (
  <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', background: bg }}>
    <div style={{
      width: '200%', height: '200%',
      transformOrigin: 'top left',
      transform: 'scale(0.5)',
      position: 'absolute', top: 0, left: 0,
      fontFamily: 'system-ui,-apple-system,sans-serif',
      overflow: 'hidden',
      pointerEvents: 'none',
      userSelect: 'none',
    }}>
      {children}
    </div>
  </div>
);

/* ─── Primitive helpers ──────────────────────────────────────────────────── */
// Line: simulates a text line
const L = ({ w = '80%', h = 10, c = '#ddd', r = 3, s = {} }) =>
  <div style={{ width: w, height: h, background: c, borderRadius: r, flexShrink: 0, ...s }} />;

// Rectangle: image blocks, panels, cards
const Rect = ({ w = '100%', h = 60, bg = '#eee', r = 0, s = {} }) =>
  <div style={{ width: w, height: h, background: bg, borderRadius: r, flexShrink: 0, ...s }} />;

// Horizontal flex row
const Row = ({ children, g = 8, a = 'center', j = 'flex-start', s = {} }) =>
  <div style={{ display: 'flex', alignItems: a, justifyContent: j, gap: g, ...s }}>{children}</div>;

// Vertical flex column
const Col = ({ children, g = 0, s = {} }) =>
  <div style={{ display: 'flex', flexDirection: 'column', gap: g, ...s }}>{children}</div>;

// Button placeholder
const Btn = ({ bg = '#111', w = 80, h = 28, r = 4, outline, outlineColor, s = {} }) =>
  outline
    ? <div style={{ width: w, height: h, border: '1.5px solid ' + (outlineColor || '#111'), borderRadius: r, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...s }}>
        <L w="52%" h={8} c={outlineColor || '#111'} r={2} />
      </div>
    : <div style={{ width: w, height: h, background: bg, borderRadius: r, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...s }}>
        <L w="52%" h={8} c="rgba(255,255,255,0.88)" r={2} />
      </div>;

// Grid layout
const G = ({ cols = 3, gap = 10, s = {}, children }) =>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + cols + ', 1fr)', gap, ...s }}>{children}</div>;

/* ══════════════════════════════════════════════════════════════════════════════
   1. MINIMAL LUXE — Fashion / Luxury Apparel
══════════════════════════════════════════════════════════════════════════════ */
function MinimalLuxePreview() {
  return (
    <S bg="#ffffff">
      {/* Announcement bar */}
      <Row j="center" s={{ background: '#111', height: 26 }}>
        <L w={220} h={8} c="rgba(255,255,255,0.5)" />
      </Row>
      {/* Navigation */}
      <Row j="space-between" a="center" s={{ padding: '14px 32px', borderBottom: '1px solid #ebebeb' }}>
        <Row g={22}>
          {[52, 46, 46, 54].map((w, i) => <L key={i} w={w} h={9} c="#c4c4c4" />)}
        </Row>
        <L w={120} h={16} c="#111" r={0} />
        <Row g={18}>
          <L w={38} h={9} c="#c4c4c4" />
          <div style={{ width: 22, height: 22, borderRadius: 11, border: '1.5px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <L w={10} h={10} c="#ccc" r={5} />
          </div>
          <div style={{ width: 22, height: 22, borderRadius: 11, border: '1.5px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <L w={10} h={10} c="#ccc" r={5} />
          </div>
        </Row>
      </Row>

      {/* Hero */}
      <Row a="stretch" g={0}>
        <Col g={0} s={{ flex: 1, padding: '28px 36px', justifyContent: 'center', background: '#fafafa' }}>
          <L w={80} h={8} c="#c8c8c8" r={2} />
          <div style={{ height: 10 }} />
          <L w="88%" h={26} c="#111" r={1} />
          <div style={{ height: 5 }} />
          <L w="70%" h={12} c="#111" r={1} />
          <div style={{ height: 8 }} />
          <L w="65%" h={10} c="#999" r={2} />
          <div style={{ height: 20 }} />
          <Row g={10}>
            <Btn bg="#111" w={124} h={40} r={0} />
            <Btn w={112} h={40} r={0} outline outlineColor="#222" />
          </Row>
        </Col>
        <div style={{ position: 'relative', width: 250 }}>
          <Rect w={250} h={170} bg="#e8e2da" r={0} />
          <div style={{ position: 'absolute', bottom: 14, right: 14, background: '#fff', padding: '6px 12px', borderRadius: 0 }}>
            <L w={60} h={8} c="#888" r={1} />
            <div style={{ height: 4 }} />
            <L w={80} h={11} c="#111" r={1} />
          </div>
        </div>
      </Row>

      {/* Filter strip */}
      <Row g={8} s={{ padding: '12px 32px', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
        {[true, false, false, false, false, false, false].map((active, i) => (
          <div key={i} style={{ padding: '6px 18px', background: active ? '#111' : 'transparent', border: '1.5px solid ' + (active ? '#111' : '#e0e0e0'), borderRadius: 20, flexShrink: 0 }}>
            <L w={[34, 44, 40, 50, 36, 52, 32][i]} h={8} c={active ? 'rgba(255,255,255,0.9)' : '#bbb'} />
          </div>
        ))}
      </Row>

      {/* Product grid */}
      <G cols={4} gap={16} s={{ padding: '20px 32px' }}>
        {['#f4f2ef', '#eceae4', '#f0ece6', '#e8e4de'].map((bg, i) => (
          <div key={i}>
            <Rect h={100} bg={bg} r={2} />
            <div style={{ height: 9 }} />
            <L w="85%" h={10} c="#222" r={1} />
            <div style={{ height: 5 }} />
            <L w="55%" h={8} c="#aaa" r={1} />
            <div style={{ height: 7 }} />
            <L w="42%" h={11} c="#555" r={1} />
          </div>
        ))}
      </G>
    </S>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   2. DARK PREMIUM — Luxury / High-end / Jewellery
══════════════════════════════════════════════════════════════════════════════ */
function DarkPremiumPreview() {
  const gold = '#c9a84c';
  const goldDim = '#8a6f2e';
  const darkBg = '#0a0a0a';
  const cardBg = '#131313';
  const border = '#1e1e1e';
  return (
    <S bg={darkBg}>
      {/* Nav */}
      <Row j="space-between" a="center" s={{ padding: '16px 30px', borderBottom: '1px solid ' + border }}>
        <Row g={22}>
          {[46, 40, 40, 48].map((w, i) => <L key={i} w={w} h={9} c="#282828" />)}
        </Row>
        <L w={130} h={18} c={gold} r={1} s={{ boxShadow: '0 0 14px rgba(201,168,76,0.4)' }} />
        <Row g={18}>
          <L w={38} h={9} c="#282828" />
          <div style={{ width: 24, height: 24, borderRadius: '50%', border: '1.5px solid #282828', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <L w={12} h={12} c="#2a2a2a" r={6} />
          </div>
        </Row>
      </Row>

      {/* Hero */}
      <div style={{ position: 'relative', height: 148, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0e04 50%, #0d0a04 100%)' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '42%', backgroundImage: 'linear-gradient(135deg, #1a1206, #0d0804)', clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0 100%)' }} />
        <div style={{ position: 'relative', padding: '0 30px', zIndex: 1 }}>
          <L w={88} h={8} c={goldDim} r={2} />
          <div style={{ height: 10 }} />
          <L w={250} h={24} c="#f0f0e8" r={1} />
          <div style={{ height: 6 }} />
          <L w={190} h={12} c="#f0f0e8" r={1} />
          <div style={{ height: 8 }} />
          <L w={160} h={9} c="rgba(255,255,255,0.3)" r={2} />
          <div style={{ height: 20 }} />
          <Row g={12}>
            <Btn bg={gold} w={118} h={38} r={1} s={{ boxShadow: '0 0 22px rgba(201,168,76,0.45)' }} />
            <Btn w={106} h={38} r={1} outline outlineColor={gold} s={{ boxShadow: '0 0 12px rgba(201,168,76,0.15)' }} />
          </Row>
        </div>
      </div>

      {/* Section heading */}
      <Row j="space-between" a="center" s={{ padding: '14px 30px 8px' }}>
        <Row g={10} a="center">
          <div style={{ width: 3, height: 22, background: gold, borderRadius: 2 }} />
          <L w={150} h={15} c="#e8e8de" r={1} />
        </Row>
        <L w={70} h={9} c={gold} r={1} />
      </Row>

      {/* Products 2-col */}
      <G cols={2} gap={14} s={{ padding: '4px 30px 18px' }}>
        {['#141414', '#121018'].map((bg, i) => (
          <div key={i} style={{ background: bg, border: '1px solid ' + border, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: 70 }}>
              <Rect h={70} bg={i === 0 ? '#1a1206' : '#10080d'} r={0} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
            </div>
            <div style={{ padding: '10px 12px' }}>
              <L w="72%" h={11} c="#d8d8d0" r={1} />
              <div style={{ height: 5 }} />
              <L w="50%" h={9} c="#888" r={1} />
              <div style={{ height: 10 }} />
              <Row j="space-between" a="center">
                <L w={80} h={14} c={gold} r={1} s={{ boxShadow: '0 0 6px rgba(201,168,76,0.3)' }} />
                <Btn bg={gold} w={88} h={28} r={2} />
              </Row>
            </div>
          </div>
        ))}
      </G>
    </S>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   3. BOLD COMMERCE — General eCommerce / Mass Market
══════════════════════════════════════════════════════════════════════════════ */
function BoldCommercePreview() {
  const blue = '#1a73e8';
  const orange = '#fa7c17';
  return (
    <S bg="#ffffff">
      {/* Top bar */}
      <Row j="space-between" a="center" s={{ background: blue, padding: '11px 26px' }}>
        <L w={108} h={18} c="rgba(255,255,255,0.95)" r={2} />
        <div style={{ flex: 1, margin: '0 20px', height: 34, background: 'rgba(255,255,255,0.14)', borderRadius: 24, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8 }}>
          <div style={{ width: 16, height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <L w={8} h={8} c="rgba(255,255,255,0.6)" r={4} />
          </div>
          <L w={130} h={8} c="rgba(255,255,255,0.4)" />
        </div>
        <Row g={8}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 34, height: 34, borderRadius: 17, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <L w={16} h={16} c="rgba(255,255,255,0.65)" r={8} />
            </div>
            <div style={{ position: 'absolute', top: 1, right: 1, width: 10, height: 10, background: orange, borderRadius: '50%', border: '2px solid ' + blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <L w={4} h={4} c="#fff" r={2} />
            </div>
          </div>
          <Btn bg={orange} w={108} h={34} r={20} s={{ boxShadow: '0 2px 10px rgba(250,124,23,0.4)' }} />
        </Row>
      </Row>

      {/* Nav row */}
      <Row g={0} s={{ padding: '0 26px', borderBottom: '2px solid #e8eaed' }}>
        {[true, false, false, false, false, false].map((active, i) => (
          <div key={i} style={{ padding: '12px 18px', borderBottom: active ? '2.5px solid ' + blue : '2.5px solid transparent', marginBottom: -2 }}>
            <L w={[48, 66, 52, 60, 54, 62][i]} h={9} c={active ? blue : '#5f6368'} />
          </div>
        ))}
      </Row>

      {/* Category pills */}
      <Row g={8} s={{ padding: '10px 26px', background: '#f8f9fa', borderBottom: '1px solid #e8eaed' }}>
        {[true, false, false, false, false, false, false].map((active, i) => (
          <div key={i} style={{ padding: '5px 16px', background: active ? blue : '#e8eaed', borderRadius: 20, flexShrink: 0 }}>
            <L w={[36, 52, 44, 60, 48, 54, 34][i]} h={8} c={active ? '#fff' : '#777'} />
          </div>
        ))}
      </Row>

      {/* Products 4-col */}
      <G cols={4} gap={12} s={{ padding: '12px 26px 16px' }}>
        {[['#fce8e6', '#dc2626', '30% OFF'], ['#e8f0fe', blue, ''], ['#fff3e0', orange, 'HOT'], ['#e6f4ea', '#1a7f3c', 'NEW']].map(([imgBg, accent, badge], i) => (
          <div key={i} style={{ border: '1px solid #e8eaed', borderRadius: 10, overflow: 'hidden', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ position: 'relative', height: 74, background: imgBg }}>
              {badge && (
                <div style={{ position: 'absolute', top: 6, left: 6, background: accent, borderRadius: 5, padding: '2px 7px' }}>
                  <L w={badge.length * 5.5} h={7} c="#fff" r={1} />
                </div>
              )}
            </div>
            <div style={{ padding: '8px 9px' }}>
              <L w="90%" h={9} c="#222" r={1} />
              <div style={{ height: 4 }} />
              <Row a="center" g={4}>
                {[0,1,2,3,4].map(j => <div key={j} style={{ width: 9, height: 9, borderRadius: '50%', background: '#fbbf24' }} />)}
                <L w={20} h={7} c="#c0c0c0" r={1} />
              </Row>
              <div style={{ height: 5 }} />
              <Row j="space-between" a="center">
                <L w="48%" h={12} c="#111" r={1} />
                <L w="32%" h={9} c="#c0c0c0" r={1} />
              </Row>
              <div style={{ height: 6 }} />
              <Btn bg={orange} w="100%" h={28} r={7} />
            </div>
          </div>
        ))}
      </G>
    </S>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   4. TECH SPECS — Electronics / Gaming / Computers
══════════════════════════════════════════════════════════════════════════════ */
function TechSpecsPreview() {
  const navy = '#0a1628';
  const panel = '#0d2137';
  const cyan = '#00d4ff';
  const border = '#1a3a56';
  return (
    <S bg={navy}>
      {/* Nav */}
      <Row j="space-between" a="center" s={{ background: navy, padding: '14px 22px', borderBottom: '1px solid ' + border }}>
        <Row g={8} a="center">
          <Rect w={30} h={30} bg={cyan} r={7} s={{ boxShadow: '0 0 14px rgba(0,212,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          <L w={110} h={16} c={cyan} r={2} s={{ boxShadow: '0 0 10px rgba(0,212,255,0.3)' }} />
        </Row>
        <div style={{ flex: 1, margin: '0 18px', height: 32, background: panel, border: '1px solid ' + border, borderRadius: 7, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}>
          <L w={14} h={14} c={border} r={7} />
          <L w={110} h={8} c={border} />
        </div>
        <Row g={10}>
          <Btn bg={cyan} w={96} h={32} r={7} s={{ boxShadow: '0 0 14px rgba(0,212,255,0.4)' }} />
        </Row>
      </Row>

      {/* Body */}
      <Row a="flex-start" g={0}>
        {/* Sidebar */}
        <div style={{ width: 116, background: panel, borderRight: '1px solid ' + border, padding: '10px 0', flexShrink: 0, minHeight: 240 }}>
          {['GPU', 'CPU', 'SSD', 'RAM', 'Monitors', 'Phones', 'Bundles'].map((_, i) => (
            <Row key={i} g={7} a="center" s={{ padding: '8px 12px', background: i === 0 ? '#0f2844' : 'transparent', borderLeft: '3px solid ' + (i === 0 ? cyan : 'transparent') }}>
              <L w={12} h={12} c={i === 0 ? cyan : border} r={3} s={i === 0 ? { boxShadow: '0 0 6px rgba(0,212,255,0.5)' } : {}} />
              <L w={[30, 24, 22, 22, 44, 30, 34][i]} h={8} c={i === 0 ? '#cce8f4' : '#2a4a6b'} />
            </Row>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: '12px 14px' }}>
          {/* Featured product */}
          <div style={{ background: panel, border: '1px solid ' + border, borderRadius: 8, padding: '10px', marginBottom: 10, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Rect w={100} h={86} bg="#091520" r={6} s={{ border: '1px solid ' + border, flexShrink: 0 }} />
            <Col g={0} s={{ flex: 1 }}>
              <L w={70} h={8} c="rgba(0,212,255,0.6)" r={2} />
              <div style={{ height: 5 }} />
              <L w="92%" h={14} c="#d0e8ff" r={2} />
              <div style={{ height: 4 }} />
              <L w="72%" h={9} c="#5a88a8" r={2} />
              <div style={{ height: 8 }} />
              <Row g={5}>
                {[0,1,2].map(i => <Rect key={i} w={28} h={28} bg="#0f2844" r={5} s={{ border: '1px solid ' + border }} />)}
              </Row>
              <div style={{ height: 10 }} />
              <Row j="space-between" a="center">
                <L w={90} h={18} c={cyan} r={2} s={{ boxShadow: '0 0 8px rgba(0,212,255,0.35)' }} />
                <Btn bg={cyan} w={90} h={32} r={7} s={{ boxShadow: '0 0 12px rgba(0,212,255,0.4)' }} />
              </Row>
            </Col>
          </div>

          {/* Specs table */}
          <div style={{ background: panel, border: '1px solid ' + border, borderRadius: 7, overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ background: '#0f2844', padding: '7px 12px', borderBottom: '1px solid ' + border }}>
              <L w={90} h={9} c={cyan} r={2} />
            </div>
            {[0, 1, 2, 3].map(i => (
              <Row key={i} j="space-between" s={{ padding: '7px 12px', borderBottom: i < 3 ? '1px solid #0c1c2c' : 'none' }}>
                <L w={[52, 42, 38, 46][i]} h={8} c="#3a6070" />
                <L w={[90, 76, 66, 100][i]} h={8} c={i === 0 ? '#9abccc' : '#2a5060'} />
              </Row>
            ))}
          </div>

          {/* Related products */}
          <G cols={3} gap={8}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ background: panel, border: '1px solid ' + border, borderRadius: 6, overflow: 'hidden' }}>
                <Rect h={38} bg="#091520" r={0} />
                <div style={{ padding: '6px 7px' }}>
                  <L w="85%" h={8} c="#7ab0c8" r={1} />
                  <div style={{ height: 3 }} />
                  <L w="55%" h={10} c={cyan} r={1} />
                </div>
              </div>
            ))}
          </G>
        </div>
      </Row>
    </S>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   5. ARTISAN MARKET — Handmade / Vintage / Craft
══════════════════════════════════════════════════════════════════════════════ */
function ArtisanMarketPreview() {
  const cream = '#faf3e0';
  const brown = '#6b3a1f';
  const amber = '#c4956a';
  const border = '#e8d4b8';
  return (
    <S bg={cream}>
      {/* Nav */}
      <Row j="space-between" a="center" s={{ background: cream, padding: '14px 28px', borderBottom: '2px solid ' + border }}>
        <Row g={22}>
          {[46, 52, 44, 50].map((w, i) => <L key={i} w={w} h={9} c={amber} />)}
        </Row>
        <Col g={3} s={{ alignItems: 'center' }}>
          <L w={130} h={20} c={brown} r={2} />
          <L w={90} h={7} c={amber} r={1} />
        </Col>
        <Row g={14}>
          <L w={38} h={9} c={amber} />
          <div style={{ width: 24, height: 24, borderRadius: 12, border: '1.5px solid #e0c8a0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <L w={12} h={12} c="#e0c8a0" r={6} />
          </div>
        </Row>
      </Row>

      {/* Hero */}
      <div style={{ position: 'relative', height: 100, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #8b5e3c 0%, #c4a47c 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: 'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)' }} />
        <Col g={8} s={{ alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <L w={90} h={8} c="rgba(255,255,255,0.65)" r={2} />
          <L w={270} h={24} c="#fff" r={2} />
          <Btn bg="#fff" w={120} h={34} r={2} s={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
        </Col>
      </div>

      {/* Section heading */}
      <Row j="space-between" a="center" s={{ padding: '12px 28px 8px' }}>
        <Row g={10} a="center">
          <div style={{ width: 4, height: 22, background: brown, borderRadius: 2 }} />
          <L w={160} h={15} c={brown} r={1} />
        </Row>
        <L w={64} h={9} c={amber} r={1} />
      </Row>

      {/* Masonry-style product grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr', gridTemplateRows: 'min-content min-content', gap: 12, padding: '0 28px 18px', alignItems: 'start' }}>
        {/* Large featured card spanning 2 rows */}
        <div style={{ gridRow: '1 / 3', background: '#fff', border: '1px solid ' + border, borderRadius: 6, overflow: 'hidden' }}>
          <Rect h={158} bg="#f0e2c8" r={0} />
          <div style={{ padding: '10px' }}>
            <L w="82%" h={11} c={brown} r={1} />
            <div style={{ height: 5 }} />
            <L w="56%" h={9} c={amber} r={1} />
            <div style={{ height: 8 }} />
            <Btn bg={brown} w="100%" h={30} r={3} />
          </div>
        </div>
        {/* Smaller cards */}
        {[['#f0dcc8', 64], ['#e8d4b4', 80], ['#ecdcc6', 70], ['#e6d4b2', 78]].map(([bg, h], i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid ' + border, borderRadius: 5, overflow: 'hidden' }}>
            <Rect h={h} bg={bg} r={0} />
            <div style={{ padding: '7px 8px' }}>
              <L w="84%" h={9} c={brown} r={1} />
              <div style={{ height: 4 }} />
              <Row j="space-between" a="center">
                <L w="50%" h={10} c={amber} r={1} />
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px solid ' + border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <L w={10} h={10} c={amber} r={5} />
                </div>
              </Row>
            </div>
          </div>
        ))}
      </div>
    </S>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   6. FLASH SALE — Promotions / Limited-time Deals
══════════════════════════════════════════════════════════════════════════════ */
function FlashSalePreview() {
  const red = '#dc2626';
  const darkRed = '#991b1b';
  const yellow = '#fbbf24';
  return (
    <S bg="#fff">
      {/* Urgent header */}
      <Row j="space-between" a="center" s={{ background: red, padding: '11px 24px' }}>
        <Row g={10} a="center">
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: yellow, boxShadow: '0 0 10px rgba(251,191,36,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <L w={10} h={10} c="#b45309" r={5} />
          </div>
          <L w={100} h={15} c="#fff" r={2} />
        </Row>
        {/* Countdown */}
        <Row g={4} a="center">
          <L w={58} h={8} c="rgba(255,255,255,0.7)" r={1} />
          {['28', ':', '14', ':', '52'].map((_, i) => (
            <div key={i} style={{ width: i % 2 === 0 ? 30 : 12, height: i % 2 === 0 ? 30 : 22, background: i % 2 === 0 ? darkRed : 'transparent', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <L w={i % 2 === 0 ? 18 : 5} h={i % 2 === 0 ? 14 : 10} c={i % 2 === 0 ? '#fff' : 'rgba(255,255,255,0.7)'} r={2} />
            </div>
          ))}
        </Row>
        <L w={96} h={14} c="rgba(255,255,255,0.9)" r={2} />
      </Row>

      {/* Nav */}
      <Row j="space-between" a="center" s={{ padding: '10px 24px', borderBottom: '1px solid #f0f0f0' }}>
        <L w={108} h={16} c="#111" r={2} />
        <Row g={18}>
          {[50, 44, 38, 44, 50].map((w, i) => <L key={i} w={w} h={9} c="#555" />)}
        </Row>
        <div style={{ position: 'relative' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#f5f5f5', border: '1.5px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <L w={12} h={12} c="#ccc" r={6} />
          </div>
          <div style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, background: red, borderRadius: '50%', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <L w={4} h={4} c="#fff" r={2} />
          </div>
        </div>
      </Row>

      {/* Sale banner */}
      <div style={{ background: 'linear-gradient(90deg, #7f1d1d, #dc2626, #7f1d1d)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <L w={140} h={20} c="#fff" r={2} />
        <div style={{ width: 1.5, height: 22, background: 'rgba(255,255,255,0.3)' }} />
        <L w={96} h={13} c={yellow} r={2} s={{ boxShadow: '0 0 8px rgba(251,191,36,0.4)' }} />
        <div style={{ width: 1.5, height: 22, background: 'rgba(255,255,255,0.3)' }} />
        <L w={110} h={10} c="rgba(255,255,255,0.75)" r={2} />
      </div>

      {/* Products Grid */}
      <G cols={4} gap={10} s={{ padding: '10px 24px 16px' }}>
        {['#fee2e2', '#fef3c7', '#d1fae5', '#ede9fe', '#fee2e2', '#fef3c7', '#d1fae5', '#ede9fe'].map((bg, i) => (
          <div key={i} style={{ border: '1px solid #fee2e2', borderRadius: 9, overflow: 'hidden', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ position: 'relative', height: 62, background: bg }}>
              <div style={{ position: 'absolute', top: 5, left: 5, background: red, borderRadius: 5, padding: '2px 6px' }}>
                <L w={26} h={7} c="#fff" r={1} />
              </div>
            </div>
            <div style={{ padding: '7px 7px 8px' }}>
              <L w="90%" h={8} c="#222" r={1} />
              <div style={{ height: 4 }} />
              <Row j="space-between" a="center">
                <L w="42%" h={12} c={red} r={1} />
                <L w="32%" h={8} c="#ccc" r={1} />
              </Row>
              <div style={{ height: 5 }} />
              <Btn bg={red} w="100%" h={24} r={6} />
            </div>
          </div>
        ))}
      </G>
    </S>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   7. FRESH GROCERY — Supermarket / Food & Beverages
══════════════════════════════════════════════════════════════════════════════ */
function FreshGroceryPreview() {
  const green = '#16a34a';
  const lightGreen = '#dcfce7';
  const freshGreen = '#86efac';
  return (
    <S bg="#ffffff">
      {/* Delivery promise bar */}
      <Row j="center" s={{ background: green, height: 26 }}>
        <L w={270} h={9} c="rgba(255,255,255,0.75)" />
      </Row>

      {/* Nav */}
      <Row j="space-between" a="center" s={{ padding: '12px 24px', borderBottom: '2px solid ' + lightGreen }}>
        <Row g={8} a="center">
          <Rect w={32} h={32} bg={green} r={9} />
          <L w={108} h={17} c={green} r={2} />
        </Row>
        <div style={{ flex: 1, margin: '0 16px', height: 34, background: '#f0fdf4', border: '1.5px solid ' + lightGreen, borderRadius: 22, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}>
          <L w={15} h={15} c={freshGreen} r={7} />
          <L w={130} h={8} c={freshGreen} />
        </div>
        <Row g={10}>
          <div style={{ height: 34, background: lightGreen, borderRadius: 20, padding: '0 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <L w={16} h={16} c={green} r={8} />
            <L w={18} h={10} c={green} r={1} />
          </div>
        </Row>
      </Row>

      {/* Body */}
      <Row a="flex-start" g={0}>
        {/* Sidebar */}
        <div style={{ width: 112, background: '#f8fffe', borderRight: '1.5px solid #e6f9ed', padding: '10px 0', flexShrink: 0, minHeight: 250 }}>
          {[true, false, false, false, false, false].map((active, i) => (
            <Row key={i} g={7} a="center" s={{ padding: '8px 12px', background: active ? lightGreen : 'transparent', borderLeft: '3px solid ' + (active ? green : 'transparent') }}>
              <L w={12} h={12} c={active ? green : freshGreen} r={3} />
              <L w={[32, 48, 28, 30, 22, 44][i]} h={8} c={active ? green : '#6ee7a0'} />
            </Row>
          ))}
          <div style={{ height: 1, background: '#e6f9ed', margin: '7px 0' }} />
          {[false, false, false].map((_, i) => (
            <Row key={i} g={7} a="center" s={{ padding: '7px 12px' }}>
              <L w={11} h={11} c={freshGreen} r={3} />
              <L w={[36, 42, 50][i]} h={8} c="#86efac" />
            </Row>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: '10px 14px' }}>
          {/* Featured banner */}
          <div style={{ background: 'linear-gradient(135deg, ' + green + ', #4ade80)', borderRadius: 12, padding: '12px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Col g={6}>
              <L w={80} h={8} c="rgba(255,255,255,0.7)" r={2} />
              <L w={168} h={18} c="#fff" r={2} />
              <div style={{ height: 4 }} />
              <div style={{ height: 28, background: '#fff', borderRadius: 14, padding: '0 14px', display: 'inline-flex', alignItems: 'center' }}>
                <L w={70} h={9} c={green} />
              </div>
            </Col>
            <Rect w={72} h={64} bg="rgba(255,255,255,0.18)" r={10} />
          </div>

          {/* Product grid */}
          <G cols={4} gap={8}>
            {['#dcfce7', '#d1fae5', '#a7f3d0', '#6ee7b7', '#dcfce7', '#d1fae5', '#a7f3d0', '#bbf7d0'].map((bg, i) => (
              <div key={i} style={{ background: '#f0fdf4', border: '1.5px solid ' + lightGreen, borderRadius: 9, overflow: 'hidden' }}>
                <Rect h={46} bg={bg} r={0} />
                <div style={{ padding: '5px 6px' }}>
                  <L w="88%" h={8} c="#166534" r={1} />
                  <div style={{ height: 3 }} />
                  <Row j="space-between" a="center">
                    <L w="46%" h={11} c={green} r={1} />
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: green, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(22,163,74,0.4)' }}>
                      <L w={12} h={12} c="#fff" r={6} />
                    </div>
                  </Row>
                </div>
              </div>
            ))}
          </G>
        </div>
      </Row>
    </S>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   8. CORPORATE B2B — Wholesale / Procurement / Enterprise
══════════════════════════════════════════════════════════════════════════════ */
function CorporateB2BPreview() {
  const navy = '#0a2540';
  const blue2 = '#2563eb';
  const slate = '#334155';
  const borderColor = '#e2e8f0';
  return (
    <S bg="#f8fafc">
      {/* Top bar */}
      <Row j="space-between" a="center" s={{ background: navy, padding: '10px 28px' }}>
        <Row g={8} a="center">
          <Rect w={28} h={28} bg={blue2} r={6} />
          <L w={120} h={14} c="rgba(255,255,255,0.9)" r={2} />
        </Row>
        <Row g={22}>
          {[50, 42, 50, 56].map((w, i) => <L key={i} w={w} h={8} c="rgba(255,255,255,0.4)" />)}
        </Row>
        <Row g={10}>
          <Btn w={96} h={30} r={6} outline outlineColor="rgba(255,255,255,0.3)" s={{ borderRadius: 6 }} />
          <Btn bg={blue2} w={104} h={30} r={6} />
        </Row>
      </Row>

      {/* Sub-nav */}
      <Row j="space-between" a="center" s={{ background: '#fff', padding: '0 28px', borderBottom: '1px solid ' + borderColor }}>
        <Row g={0}>
          {[true, false, false, false].map((active, i) => (
            <div key={i} style={{ padding: '12px 18px', borderBottom: active ? '2.5px solid ' + blue2 : '2.5px solid transparent', marginBottom: -1 }}>
              <L w={[52, 64, 56, 72][i]} h={9} c={active ? blue2 : '#64748b'} />
            </div>
          ))}
        </Row>
        <Row g={8}>
          <div style={{ width: 38, height: 30, background: '#f1f5f9', border: '1px solid ' + borderColor, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <L w={14} h={14} c="#94a3b8" r={3} />
          </div>
          <Btn bg={navy} w={112} h={30} r={6} />
        </Row>
      </Row>

      {/* Trust badges */}
      <Row g={0} s={{ background: '#eff6ff', borderBottom: '1px solid #dbeafe', padding: '8px 28px' }}>
        {[0, 1, 2, 3].map(i => (
          <Row key={i} g={7} a="center" s={{ flex: 1, paddingRight: 14, borderRight: i < 3 ? '1px solid #dbeafe' : 'none', marginRight: i < 3 ? 14 : 0 }}>
            <Rect w={18} h={18} bg={blue2} r={5} />
            <L w={[62, 74, 56, 68][i]} h={9} c="#1e40af" r={1} />
          </Row>
        ))}
      </Row>

      {/* Product table */}
      <div style={{ margin: '10px 28px', background: '#fff', border: '1px solid ' + borderColor, borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        {/* Table header */}
        <Row a="center" s={{ background: '#f1f5f9', padding: '9px 16px', borderBottom: '1px solid ' + borderColor, gap: 0 }}>
          {[{ w: '30%', lw: 54 }, { w: '14%', lw: 26 }, { w: '15%', lw: 44 }, { w: '15%', lw: 44 }, { w: '12%', lw: 26 }, { w: '14%', lw: 0 }].map((col, i) => (
            <div key={i} style={{ width: col.w, flexShrink: 0, paddingRight: 8 }}>
              {col.lw > 0 && <L w={col.lw} h={8} c="#64748b" />}
            </div>
          ))}
        </Row>
        {/* Rows */}
        {[0, 1, 2, 3, 4].map(rowIdx => (
          <Row key={rowIdx} a="center" s={{ padding: '10px 16px', borderBottom: rowIdx < 4 ? '1px solid #f1f5f9' : 'none', background: rowIdx % 2 === 0 ? '#fff' : '#fafbfc', gap: 0 }}>
            <Row g={8} a="center" s={{ width: '30%', flexShrink: 0 }}>
              <Rect w={34} h={30} bg="#f1f5f9" r={5} s={{ flexShrink: 0 }} />
              <Col g={3}>
                <L w={74} h={9} c={slate} r={1} />
                <L w={52} h={7} c="#94a3b8" r={1} />
              </Col>
            </Row>
            <div style={{ width: '14%', flexShrink: 0 }}><L w={46} h={7} c="#94a3b8" r={1} /></div>
            <div style={{ width: '15%', flexShrink: 0 }}><L w={42} h={11} c={slate} r={1} /></div>
            <div style={{ width: '15%', flexShrink: 0 }}><L w={52} h={10} c={blue2} r={1} /></div>
            <div style={{ width: '12%', flexShrink: 0 }}><L w={36} h={7} c="#94a3b8" r={1} /></div>
            <div style={{ width: '14%', flexShrink: 0 }}>
              <Btn bg={navy} w="100%" h={26} r={6} />
            </div>
          </Row>
        ))}
      </div>
    </S>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   9. EDITORIAL FOCUS — Lifestyle / Magazine / Blog
══════════════════════════════════════════════════════════════════════════════ */
function EditorialPreview() {
  const red = '#e83e3e';
  return (
    <S bg="#fefefe">
      {/* Top category strip */}
      <Row j="center" g={22} s={{ background: '#fefefe', padding: '9px 28px', borderBottom: '1px solid #f0f0f0' }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ borderBottom: i === 2 ? '1.5px solid #111' : 'none', paddingBottom: i === 2 ? 2 : 0 }}>
            <L w={[50, 60, 46, 56, 50, 58][i]} h={8} c={i === 2 ? '#111' : '#aaa'} />
          </div>
        ))}
      </Row>

      {/* Masthead */}
      <Row j="center" s={{ padding: '14px 28px', borderBottom: '3px solid #111' }}>
        <L w={200} h={24} c="#111" r={0} />
      </Row>

      {/* Issue line */}
      <Row j="space-between" a="center" s={{ padding: '7px 28px', borderBottom: '1px solid #e8e8e8', background: '#fafafa' }}>
        <L w={110} h={8} c="#bbb" r={1} />
        <Row g={14}>
          {[46, 80, 56].map((w, i) => <L key={i} w={w} h={8} c={['#bbb', '#111', '#bbb'][i]} />)}
        </Row>
      </Row>

      {/* Content */}
      <Row a="flex-start" g={0} s={{ padding: '14px 28px' }}>
        {/* Featured story */}
        <div style={{ flex: 2.2, paddingRight: 22, borderRight: '1px solid #e0e0e0' }}>
          <Rect h={116} bg="#f0ece4" r={3} />
          <div style={{ height: 10 }} />
          <L w={82} h={9} c={red} r={2} />
          <div style={{ height: 6 }} />
          <L w="95%" h={20} c="#111" r={1} />
          <div style={{ height: 4 }} />
          <L w="88%" h={14} c="#333" r={1} />
          <div style={{ height: 8 }} />
          <L w="78%" h={9} c="#888" r={1} />
          <div style={{ height: 4 }} />
          <L w="72%" h={9} c="#aaa" r={1} />
          <div style={{ height: 10 }} />
          <Row j="space-between" a="center">
            <Row g={8} a="center">
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e8e8e8' }} />
              <L w={72} h={8} c="#888" r={1} />
            </Row>
            <L w={62} h={8} c={red} r={1} />
          </Row>
        </div>

        {/* Article stack */}
        <Col g={0} s={{ flex: 1, paddingLeft: 20 }}>
          {[0, 1, 2].map(i => (
            <Row key={i} g={10} a="flex-start" s={{ paddingBottom: 13, marginBottom: 13, borderBottom: i < 2 ? '1px solid #eee' : 'none' }}>
              <Rect w={56} h={46} bg={['#f5f0e6', '#eceaf6', '#eaf0ec'][i]} r={3} s={{ flexShrink: 0 }} />
              <Col g={0}>
                <L w={64} h={7} c={red} r={2} />
                <div style={{ height: 4 }} />
                <L w="95%" h={10} c="#111" r={1} />
                <div style={{ height: 3 }} />
                <L w="85%" h={9} c="#444" r={1} />
                <div style={{ height: 6 }} />
                <L w={62} h={7} c="#aaa" r={1} />
              </Col>
            </Row>
          ))}
        </Col>
      </Row>

      {/* Product strip */}
      <div style={{ borderTop: '2px solid #111', padding: '10px 28px' }}>
        <Row j="space-between" a="center" s={{ marginBottom: 8 }}>
          <L w={88} h={12} c="#111" r={1} />
          <L w={62} h={8} c="#888" r={1} />
        </Row>
        <Row g={12}>
          {[0, 1, 2, 3, 4].map(i => (
            <Col key={i} g={0} s={{ flex: 1 }}>
              <Rect h={46} bg={['#f5f3ee', '#f0eef5', '#f5eef0', '#eef5f0', '#f3eef5'][i]} r={3} />
              <div style={{ height: 5 }} />
              <L w="88%" h={8} c="#222" r={1} />
              <div style={{ height: 3 }} />
              <L w="56%" h={10} c="#555" r={1} />
            </Col>
          ))}
        </Row>
      </div>
    </S>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   10. NEON STREET — Streetwear / Youth / Urban Culture
══════════════════════════════════════════════════════════════════════════════ */
function NeonStreetPreview() {
  const hotPink = '#f72585';
  const sky = '#4cc9f0';
  const acidGreen = '#b5e853';
  const darkBg = '#0f0225';
  const panel = '#1a0635';
  const border = '#2d0d50';
  return (
    <S bg={darkBg}>
      {/* Nav */}
      <Row j="space-between" a="center" s={{ background: darkBg, padding: '14px 26px', borderBottom: '1px solid ' + border }}>
        <Row g={20}>
          {[46, 50, 40, 46].map((w, i) => <L key={i} w={w} h={9} c="#3d1466" />)}
        </Row>
        <L w={136} h={22} c={hotPink} r={2} s={{ boxShadow: '0 0 18px rgba(247,37,133,0.65)' }} />
        <Row g={10}>
          <Btn bg={hotPink} w={96} h={32} r={5} s={{ boxShadow: '0 0 16px rgba(247,37,133,0.55)' }} />
        </Row>
      </Row>

      {/* Hero */}
      <div style={{ position: 'relative', height: 118, overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 26px' }}>
        {/* Background blobs */}
        <div style={{ position: 'absolute', right: 60, top: -40, width: 150, height: 150, borderRadius: '50%', background: hotPink, opacity: 0.08, filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', left: 80, bottom: -40, width: 100, height: 100, borderRadius: '50%', background: sky, opacity: 0.1, filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '30%', background: panel, clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)', borderLeft: '1px solid ' + border }} />

        {/* Hero text */}
        <Col g={0} s={{ position: 'relative', zIndex: 1, flex: 1 }}>
          <Row g={7} a="center">
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: hotPink, boxShadow: '0 0 12px ' + hotPink, flexShrink: 0 }} />
            <L w={88} h={9} c={hotPink} r={2} />
          </Row>
          <div style={{ height: 8 }} />
          <L w={250} h={28} c="#ffffff" r={2} />
          <div style={{ height: 6 }} />
          <L w={190} h={10} c="rgba(255,255,255,0.35)" r={2} />
          <div style={{ height: 14 }} />
          <Row g={10}>
            <Btn bg={hotPink} w={116} h={36} r={5} s={{ boxShadow: '0 0 18px rgba(247,37,133,0.55)' }} />
            <Btn w={104} h={36} r={5} outline outlineColor={hotPink} s={{ boxShadow: '0 0 12px rgba(247,37,133,0.2)' }} />
          </Row>
        </Col>

        {/* Hero image area */}
        <div style={{ position: 'relative', width: 130, height: 100, flexShrink: 0, zIndex: 1 }}>
          <Rect w={120} h={100} bg="#1e0640" r={10} s={{ border: '1.5px solid #3d0d6b', position: 'absolute', right: 0 }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 10, height: 3, background: hotPink, borderRadius: 2, boxShadow: '0 0 10px ' + hotPink }} />
        </div>
      </div>

      {/* Category pills */}
      <Row g={8} s={{ padding: '10px 26px', overflowX: 'hidden' }}>
        {[true, false, false, false, false, false].map((active, i) => (
          <div key={i} style={{ padding: '6px 16px', background: active ? hotPink : 'transparent', border: '1.5px solid ' + (active ? hotPink : border), borderRadius: 22, flexShrink: 0, boxShadow: active ? '0 0 12px rgba(247,37,133,0.4)' : 'none' }}>
            <L w={[32, 42, 52, 36, 44, 54][i]} h={8} c={active ? '#fff' : '#3d1466'} />
          </div>
        ))}
      </Row>

      {/* Product cards */}
      <G cols={3} gap={10} s={{ padding: '4px 26px 16px' }}>
        {[[hotPink, '#1c0838'], [sky, '#081430'], [acidGreen, '#0d1c08'], [hotPink, '#1a0630'], [sky, '#08121c'], [acidGreen, '#101808']].map(([accent, imgBg], i) => (
          <div key={i} style={{ background: panel, border: '1.5px solid ' + accent + '22', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: 54, background: imgBg }}>
              {/* Neon bottom line */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2.5, background: accent, boxShadow: '0 0 10px ' + accent }} />
            </div>
            <div style={{ padding: '8px 9px' }}>
              <L w="80%" h={9} c="rgba(255,255,255,0.82)" r={1} />
              <div style={{ height: 5 }} />
              <Row j="space-between" a="center">
                <L w="46%" h={12} c={accent} r={1} s={{ boxShadow: '0 0 6px ' + accent + '55' }} />
                <div style={{ width: 28, height: 28, background: accent + '1a', border: '1px solid ' + accent + '55', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 8px ' + accent + '30' }}>
                  <L w={12} h={12} c={accent} r={6} />
                </div>
              </Row>
            </div>
          </div>
        ))}
      </G>
    </S>
  );
}

function PastelBeautyPreview() {
  const pink = '#d63f7c';
  const softBg = '#fef6f9';
  const card = '#fff';
  const border = '#fce7f3';
  const lavender = '#f3e8ff';
  return (
    <S bg={softBg}>
      {/* Nav */}
      <Row j="space-between" a="center" s={{ background: card, padding: '12px 26px', borderBottom: '2px solid ' + border }}>
        <L w={100} h={20} c={pink} r={10} />
        <Row g={16}>
          {[40, 50, 44, 40].map((w, i) => <L key={i} w={w} h={8} c="#c084a8" />)}
        </Row>
        <Row g={8}>
          <Btn bg={pink} w={80} h={28} r={14} />
        </Row>
      </Row>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(120deg, #fce7f3 0%, #f3e8ff 100%)', padding: '24px 26px', display: 'flex', alignItems: 'center', gap: 20 }}>
        <Col g={8} s={{ flex: 1 }}>
          <L w={80} h={9} c={pink} r={12} />
          <L w={220} h={28} c="#3d1a2e" r={4} />
          <L w={170} h={9} c="#a05072" r={4} />
          <div style={{ height: 6 }} />
          <Row g={8}>
            <Btn bg={pink} w={110} h={34} r={17} />
            <Btn w={90} h={34} r={17} outline outlineColor={pink} />
          </Row>
        </Col>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <Rect w={70} h={100} bg={border} r={14} />
          <Rect w={70} h={100} bg={lavender} r={14} />
        </div>
      </div>

      {/* Category pills */}
      <Row g={8} s={{ padding: '10px 26px' }}>
        {[true, false, false, false, false].map((a, i) => (
          <div key={i} style={{ padding: '5px 14px', background: a ? pink : '#fce7f3', borderRadius: 20 }}>
            <L w={[34, 44, 38, 50, 42][i]} h={7} c={a ? '#fff' : pink} />
          </div>
        ))}
      </Row>

      {/* Products */}
      <G cols={3} gap={10} s={{ padding: '4px 26px 16px' }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ background: card, border: '1.5px solid ' + border, borderRadius: 14, overflow: 'hidden' }}>
            <Rect w="100%" h={60} bg={i % 2 === 0 ? '#fce7f3' : lavender} />
            <div style={{ padding: '7px 9px' }}>
              <L w="70%" h={8} c="#3d1a2e" r={2} />
              <div style={{ height: 4 }} />
              <Row j="space-between" a="center">
                <L w="40%" h={11} c={pink} r={2} />
                <Btn bg={pink} w={28} h={28} r={14} />
              </Row>
            </div>
          </div>
        ))}
      </G>
    </S>
  );
}

function SportsFitnessPreview() {
  const orange = '#f97316';
  const darkBg = '#0f172a';
  const card = '#1e293b';
  const border = '#334155';
  const yellow = '#fbbf24';
  return (
    <S bg={darkBg}>
      {/* Nav */}
      <Row j="space-between" a="center" s={{ background: '#09090b', padding: '12px 26px', borderBottom: '2px solid ' + orange }}>
        <Row g={6} a="center">
          <div style={{ width: 28, height: 28, background: orange, borderRadius: 4, flexShrink: 0 }} />
          <L w={80} h={16} c="#fff" r={2} />
        </Row>
        <Row g={14}>
          {[44, 52, 46, 44].map((w, i) => <L key={i} w={w} h={8} c="#94a3b8" />)}
        </Row>
        <Btn bg={orange} w={88} h={30} r={4} />
      </Row>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '20px 26px', display: 'flex', alignItems: 'stretch', gap: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, left: '40%', width: 200, height: 200, background: orange, borderRadius: '50%', opacity: 0.07, filter: 'blur(48px)' }} />
        <Col g={8} s={{ flex: 1, zIndex: 1 }}>
          <div style={{ background: orange, display: 'inline-block', padding: '3px 10px', borderRadius: 3, width: 'fit-content' }}>
            <L w={80} h={7} c="#fff" />
          </div>
          <L w={220} h={28} c="#f1f5f9" r={2} />
          <L w={160} h={8} c="#94a3b8" r={2} />
          <div style={{ height: 8 }} />
          <Row g={10}>
            <Btn bg={orange} w={110} h={36} r={4} s={{ boxShadow: '0 4px 20px rgba(249,115,22,0.4)' }} />
            <Btn w={100} h={36} r={4} outline outlineColor={border} />
          </Row>
        </Col>
        <Rect w={140} h={120} bg={card} r={8} s={{ border: '2px solid ' + border, flexShrink: 0, zIndex: 1 }} />
      </div>

      {/* Category strip */}
      <Row g={0} s={{ background: '#0a0a0b', borderTop: '1px solid ' + border, borderBottom: '1px solid ' + border, overflow: 'hidden' }}>
        {[true, false, false, false, false, false].map((a, i) => (
          <div key={i} style={{ padding: '8px 20px', background: a ? orange : 'transparent', borderRight: '1px solid ' + border }}>
            <L w={[36, 46, 40, 54, 44, 36][i]} h={8} c={a ? '#fff' : '#64748b'} />
          </div>
        ))}
      </Row>

      {/* Products */}
      <G cols={3} gap={10} s={{ padding: '12px 26px 16px' }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ background: card, border: '1px solid ' + border, borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ height: 58, background: '#0f172a', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: i % 3 === 0 ? orange : i % 3 === 1 ? yellow : '#e2e8f0' }} />
            </div>
            <div style={{ padding: '8px 9px' }}>
              <L w="75%" h={8} c="#e2e8f0" r={2} />
              <div style={{ height: 5 }} />
              <Row j="space-between" a="center">
                <L w={50} h={12} c={orange} r={2} />
                <Btn bg={orange} w={26} h={26} r={4} />
              </Row>
            </div>
          </div>
        ))}
      </G>
    </S>
  );
}

function RealEstatePreview() {
  const navy = '#1e3a5f';
  const green = '#B91C1C';
  const bg = '#f9fafb';
  const card = '#fff';
  return (
    <S bg={bg}>
      {/* Nav */}
      <Row j="space-between" a="center" s={{ background: card, padding: '12px 26px', borderBottom: '2px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <L w={120} h={20} c={navy} r={2} />
        <Row g={18}>
          {[48, 56, 50, 48, 62].map((w, i) => <L key={i} w={w} h={8} c="#6b7280" />)}
        </Row>
        <Row g={8}>
          <Btn w={90} h={30} r={4} outline outlineColor={navy} />
          <Btn bg={navy} w={90} h={30} r={4} />
        </Row>
      </Row>

      {/* Hero banner */}
      <div style={{ background: 'linear-gradient(135deg, ' + navy + ' 0%, #2d4e7a 100%)', padding: '28px 26px', color: '#fff' }}>
        <Row j="space-between" a="center">
          <Col g={10}>
            <L w={160} h={10} c="#93c5fd" r={2} />
            <L w={260} h={30} c="#fff" r={3} />
            <L w={200} h={9} c="#bfdbfe" r={2} />
            <div style={{ height: 8 }} />
            {/* Search bar mockup */}
            <div style={{ background: '#fff', borderRadius: 8, display: 'flex', overflow: 'hidden', width: 280 }}>
              <div style={{ flex: 1, padding: '10px 14px' }}>
                <L w="80%" h={8} c="#9ca3af" />
              </div>
              <Btn bg={green} w={70} h={38} r={0} />
            </div>
          </Col>
        </Row>
      </div>

      {/* Stats strip */}
      <Row g={0} s={{ background: card, borderBottom: '1px solid #e5e7eb' }}>
        {['120+ Listings', 'Buy & Rent', 'Verified', 'Top Locations'].map((_, i) => (
          <div key={i} style={{ flex: 1, padding: '10px', textAlign: 'center', borderRight: i < 3 ? '1px solid #e5e7eb' : 'none' }}>
            <L w={28} h={14} c={navy} r={2} s={{ margin: '0 auto' }} />
            <div style={{ height: 3 }} />
            <L w={50} h={7} c="#9ca3af" r={2} s={{ margin: '0 auto' }} />
          </div>
        ))}
      </Row>

      {/* Property cards — 2 col */}
      <G cols={2} gap={12} s={{ padding: '14px 26px 16px' }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ background: card, border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ height: 72, background: '#dbeafe', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 8, left: 8, background: green, borderRadius: 4, padding: '2px 8px' }}>
                <L w={34} h={7} c="#fff" />
              </div>
            </div>
            <div style={{ padding: '10px 12px' }}>
              <L w="80%" h={9} c={navy} r={2} />
              <div style={{ height: 4 }} />
              <L w="55%" h={7} c="#6b7280" r={2} />
              <div style={{ height: 6 }} />
              <Row j="space-between" a="center">
                <L w={70} h={14} c={green} r={2} />
                <L w={50} h={7} c="#9ca3af" r={2} />
              </Row>
            </div>
          </div>
        ))}
      </G>
    </S>
  );
}

function KidsPlayfulPreview() {
  const orange = '#ea580c';
  const yellow = '#fbbf24';
  const sky = '#38bdf8';
  const bg = '#fffbeb';
  const card = '#fff';
  return (
    <S bg={bg}>
      {/* Nav */}
      <Row j="space-between" a="center" s={{ background: card, padding: '12px 26px', borderBottom: '3px solid ' + yellow, borderRadius: '0 0 16px 16px' }}>
        <Row g={8} a="center">
          <div style={{ width: 28, height: 28, background: yellow, borderRadius: '50%', flexShrink: 0 }} />
          <L w={90} h={18} c={orange} r={8} />
        </Row>
        <Row g={10}>
          {[38, 46, 40].map((w, i) => <L key={i} w={w} h={8} c="#9ca3af" r={10} />)}
        </Row>
        <Btn bg={orange} w={86} h={30} r={20} />
      </Row>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(120deg, #fef3c7 0%, #e0f2fe 100%)', padding: '20px 26px', display: 'flex', alignItems: 'center', gap: 16, borderRadius: '0 0 24px 24px' }}>
        <Col g={8} s={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[orange, yellow, sky].map((c, i) => (
              <div key={i} style={{ width: 14, height: 14, background: c, borderRadius: '50%' }} />
            ))}
          </div>
          <L w={200} h={28} c={orange} r={8} />
          <L w={160} h={8} c="#78350f" r={4} />
          <div style={{ height: 6 }} />
          <Row g={8}>
            <Btn bg={orange} w={100} h={34} r={20} />
            <Btn bg={yellow} w={100} h={34} r={20} />
          </Row>
        </Col>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          <Rect w={90} h={60} bg="#fed7aa" r={16} />
          <Rect w={90} h={60} bg="#bae6fd" r={16} />
        </div>
      </div>

      {/* Category pills */}
      <Row g={8} s={{ padding: '12px 26px' }}>
        {[true, false, false, false, false].map((a, i) => (
          <div key={i} style={{ padding: '6px 14px', background: a ? orange : card, border: '2px solid ' + [orange, yellow, sky, orange, yellow][i], borderRadius: 20 }}>
            <L w={[30, 40, 34, 44, 36][i]} h={7} c={a ? '#fff' : orange} />
          </div>
        ))}
      </Row>

      {/* Products — 4 col */}
      <G cols={4} gap={8} s={{ padding: '4px 26px 16px' }}>
        {[orange, yellow, sky, orange, yellow, sky, orange, yellow].map((c, i) => (
          <div key={i} style={{ background: card, border: '2px solid ' + c + '55', borderRadius: 16, overflow: 'hidden' }}>
            <Rect w="100%" h={50} bg={c + '22'} />
            <div style={{ padding: '6px 7px' }}>
              <L w="75%" h={7} c="#1c1917" r={4} />
              <div style={{ height: 3 }} />
              <L w="45%" h={9} c={orange} r={4} />
            </div>
          </div>
        ))}
      </G>
    </S>
  );
}

function PharmacyHealthPreview() {
  const blue = '#0284c7';
  const green = '#16a34a';
  const bg = '#f0f9ff';
  const card = '#fff';
  const border = '#bae6fd';
  return (
    <S bg={bg}>
      {/* Top bar */}
      <div style={{ background: blue, padding: '5px 26px' }}>
        <Row j="space-between" a="center">
          <L w={160} h={7} c="rgba(255,255,255,0.8)" />
          <Row g={12}>
            <L w={50} h={7} c="rgba(255,255,255,0.8)" />
            <L w={60} h={7} c="rgba(255,255,255,0.8)" />
          </Row>
        </Row>
      </div>

      {/* Nav */}
      <Row j="space-between" a="center" s={{ background: card, padding: '10px 26px', borderBottom: '1px solid ' + border }}>
        <Row g={10} a="center">
          <div style={{ width: 30, height: 30, background: blue, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <L w={16} h={16} c="#fff" r={1} />
          </div>
          <L w={110} h={18} c={blue} r={2} />
        </Row>
        <Row g={14}>
          {[48, 56, 50, 60].map((w, i) => <L key={i} w={w} h={8} c="#0c4a6e" />)}
        </Row>
        <Row g={8}>
          <Btn bg={green} w={80} h={28} r={4} />
          <Btn bg={blue} w={80} h={28} r={4} />
        </Row>
      </Row>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, ' + blue + ' 0%, #0369a1 100%)', padding: '20px 26px', display: 'flex', alignItems: 'center', gap: 20 }}>
        <Col g={8} s={{ flex: 1, color: '#fff' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', display: 'inline-block', padding: '3px 10px', borderRadius: 3, width: 'fit-content' }}>
            <L w={90} h={7} c="#fff" />
          </div>
          <L w={230} h={26} c="#fff" r={3} />
          <L w={180} h={8} c="rgba(255,255,255,0.75)" r={2} />
          <div style={{ height: 6 }} />
          <Row g={10}>
            <Btn bg="#fff" w={110} h={34} r={4} />
            <Btn bg={green} w={110} h={34} r={4} />
          </Row>
        </Col>
        <Rect w={120} h={100} bg="rgba(255,255,255,0.12)" r={10} />
      </div>

      {/* Category bar */}
      <Row g={0} s={{ background: card, borderBottom: '1px solid ' + border, overflowX: 'hidden' }}>
        {[true, false, false, false, false, false].map((a, i) => (
          <div key={i} style={{ padding: '8px 18px', background: a ? blue + '11' : 'transparent', borderBottom: a ? '2px solid ' + blue : '2px solid transparent', borderRight: '1px solid ' + border }}>
            <L w={[34, 46, 40, 52, 44, 50][i]} h={8} c={a ? blue : '#6b7280'} />
          </div>
        ))}
      </Row>

      {/* Products — 4 col */}
      <G cols={4} gap={8} s={{ padding: '12px 26px 16px' }}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={i} style={{ background: card, border: '1px solid ' + border, borderRadius: 8, overflow: 'hidden' }}>
            <Rect w="100%" h={48} bg={blue + '14'} />
            <div style={{ padding: '6px 7px' }}>
              <L w="70%" h={7} c="#0c4a6e" r={2} />
              <div style={{ height: 3 }} />
              <Row j="space-between" a="center">
                <L w={38} h={10} c={blue} r={2} />
                <Btn bg={blue} w={24} h={24} r={4} />
              </Row>
            </div>
          </div>
        ))}
      </G>
    </S>
  );
}

function JewelleryGoldPreview() {
  const gold = '#d4a017';
  const darkBg = '#1a0e00';
  const card = '#241400';
  const text = '#f5e6c8';
  const rose = '#c9a55a';
  return (
    <S bg={darkBg}>
      {/* Top bar */}
      <div style={{ background: '#0e0700', padding: '5px 26px', borderBottom: '1px solid #3a2200' }}>
        <Row j="center">
          <L w={200} h={7} c={gold} />
        </Row>
      </div>

      {/* Nav */}
      <Row j="space-between" a="center" s={{ background: darkBg, padding: '14px 26px', borderBottom: '1px solid #3a2200' }}>
        <div style={{ width: 40, height: 1, background: gold }} />
        <L w={120} h={22} c={gold} r={2} s={{ textAlign: 'center' }} />
        <Row g={16}>
          {[38, 46, 40, 38].map((w, i) => <L key={i} w={w} h={8} c={rose} />)}
        </Row>
      </Row>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0e0700 0%, #241400 50%, #0e0700 100%)', padding: '24px 26px', display: 'flex', alignItems: 'center', gap: 20, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(212,160,23,0.06) 0%, transparent 70%)' }} />
        <Col g={10} s={{ flex: 1, zIndex: 1 }}>
          <L w={60} h={8} c={gold} r={2} />
          <L w={230} h={28} c={text} r={2} />
          <L w={180} h={8} c={rose} r={2} />
          <div style={{ height: 8 }} />
          <Row g={10}>
            <div style={{ padding: '8px 22px', background: gold, borderRadius: 2 }}>
              <L w={80} h={9} c={darkBg} />
            </div>
            <div style={{ padding: '8px 22px', border: '1px solid ' + gold, borderRadius: 2 }}>
              <L w={80} h={9} c={gold} />
            </div>
          </Row>
        </Col>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, zIndex: 1 }}>
          <Rect w={70} h={100} bg={card} r={4} s={{ border: '1px solid #3a2200' }} />
          <Rect w={70} h={100} bg={card} r={4} s={{ border: '1px solid #3a2200' }} />
        </div>
      </div>

      {/* Products */}
      <G cols={3} gap={10} s={{ padding: '14px 26px 16px' }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ background: card, border: '1px solid #3a2200', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: 62, background: '#0e0700', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1.5, background: gold }} />
            </div>
            <div style={{ padding: '8px 10px' }}>
              <L w="75%" h={8} c={text} r={1} />
              <div style={{ height: 4 }} />
              <Row j="space-between" a="center">
                <L w={44} h={11} c={gold} r={1} />
                <div style={{ width: 26, height: 26, border: '1px solid ' + gold, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <L w={10} h={10} c={gold} r={5} />
                </div>
              </Row>
            </div>
          </div>
        ))}
      </G>
    </S>
  );
}

function AutoPartsPreview() {
  const red = '#ef4444';
  const darkBg = '#18181b';
  const card = '#27272a';
  const border = '#3f3f46';
  const yellow = '#fbbf24';
  return (
    <S bg={darkBg}>
      {/* Top bar */}
      <div style={{ background: '#09090b', padding: '5px 26px', borderBottom: '1px solid ' + border }}>
        <Row j="space-between" a="center">
          <L w={140} h={7} c="#71717a" />
          <Row g={14}>
            <L w={50} h={7} c="#71717a" />
            <L w={50} h={7} c={red} />
          </Row>
        </Row>
      </div>

      {/* Nav */}
      <Row j="space-between" a="center" s={{ background: '#0a0a0b', padding: '12px 26px', borderBottom: '3px solid ' + red }}>
        <Row g={8} a="center">
          <div style={{ width: 32, height: 32, background: red, borderRadius: 4, flexShrink: 0 }} />
          <L w={100} h={18} c="#fff" r={2} />
        </Row>
        <Row g={12}>
          {[44, 52, 46, 58, 44].map((w, i) => <L key={i} w={w} h={8} c="#a1a1aa" />)}
        </Row>
        <Row g={8}>
          <Btn bg={border} w={40} h={32} r={4} />
          <Btn bg={red} w={90} h={32} r={4} />
        </Row>
      </Row>

      {/* Hero */}
      <div style={{ background: '#09090b', padding: '20px 26px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Col g={8} s={{ flex: 1 }}>
          <div style={{ background: red, display: 'inline-block', padding: '3px 10px', borderRadius: 2, width: 'fit-content' }}>
            <L w={100} h={7} c="#fff" />
          </div>
          <L w={230} h={26} c="#f4f4f5" r={2} />
          <L w={170} h={8} c="#71717a" r={2} />
          <div style={{ height: 8 }} />
          <Row g={10}>
            <Btn bg={red} w={110} h={36} r={4} />
            <Btn bg={border} w={100} h={36} r={4} />
          </Row>
        </Col>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flexShrink: 0 }}>
          {[red, yellow, '#ef4444', '#71717a'].map((c, i) => (
            <Rect key={i} w={60} h={52} bg={card} r={4} s={{ border: '1px solid ' + c + '44' }} />
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <Row g={0} s={{ background: '#0a0a0b', borderBottom: '1px solid ' + border }}>
        {[true, false, false, false, false].map((a, i) => (
          <div key={i} style={{ padding: '8px 18px', background: a ? red : 'transparent', borderRight: '1px solid ' + border }}>
            <L w={[34, 50, 44, 56, 48][i]} h={8} c={a ? '#fff' : '#71717a'} />
          </div>
        ))}
      </Row>

      {/* Products */}
      <G cols={3} gap={10} s={{ padding: '12px 26px 16px' }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ background: card, border: '1px solid ' + border, borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ height: 56, background: '#0a0a0b', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 6, right: 6, background: yellow, borderRadius: 2, padding: '2px 6px' }}>
                <L w={24} h={6} c="#000" />
              </div>
            </div>
            <div style={{ padding: '8px 9px' }}>
              <L w="78%" h={7} c="#f4f4f5" r={2} />
              <div style={{ height: 3 }} />
              <L w="50%" h={6} c="#71717a" r={2} />
              <div style={{ height: 5 }} />
              <Row j="space-between" a="center">
                <L w={44} h={11} c={red} r={2} />
                <Btn bg={red} w={26} h={26} r={4} />
              </Row>
            </div>
          </div>
        ))}
      </G>
    </S>
  );
}

function FurnitureHomePreview() {
  const walnut = '#a16207';
  const sage = '#4d7c5a';
  const bg = '#fafaf9';
  const card = '#fff';
  const border = '#e7e5e4';
  return (
    <S bg={bg}>
      {/* Nav */}
      <Row j="space-between" a="center" s={{ background: card, padding: '14px 26px', borderBottom: '1px solid ' + border }}>
        <L w={120} h={20} c={walnut} r={2} />
        <Row g={20}>
          {[44, 54, 48, 44, 58].map((w, i) => <L key={i} w={w} h={8} c="#57534e" />)}
        </Row>
        <Row g={10}>
          <Btn w={40} h={32} r={4} outline outlineColor={border} />
          <Btn bg={walnut} w={80} h={32} r={4} />
        </Row>
      </Row>

      {/* Hero */}
      <Row g={0} s={{ height: 140, overflow: 'hidden' }}>
        <div style={{ flex: 1.4, background: 'linear-gradient(120deg, #fef3c7 0%, #fefce8 100%)', padding: '24px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
          <L w={100} h={8} c={walnut} r={2} />
          <L w={200} h={28} c="#1c1917" r={3} />
          <L w={160} h={8} c="#78716c" r={2} />
          <div style={{ height: 6 }} />
          <Row g={10}>
            <Btn bg={walnut} w={110} h={34} r={4} />
            <Btn w={90} h={34} r={4} outline outlineColor={walnut} />
          </Row>
        </div>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Rect w="50%" h="100%" bg="#dbeafe" r={0} />
          <Rect w="50%" h="100%" bg="#d1fae5" r={0} />
        </div>
      </Row>

      {/* Category pills */}
      <Row g={8} s={{ padding: '12px 26px', background: card, borderBottom: '1px solid ' + border }}>
        {[true, false, false, false, false, false].map((a, i) => (
          <div key={i} style={{ padding: '6px 16px', background: a ? walnut : 'transparent', border: '1.5px solid ' + (a ? walnut : border), borderRadius: 4 }}>
            <L w={[34, 46, 52, 40, 56, 44][i]} h={7} c={a ? '#fff' : '#57534e'} />
          </div>
        ))}
      </Row>

      {/* Products — 3 col */}
      <G cols={3} gap={12} s={{ padding: '14px 26px 16px' }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ background: card, border: '1px solid ' + border, borderRadius: 8, overflow: 'hidden' }}>
            <Rect w="100%" h={68} bg={i % 3 === 0 ? '#fef3c7' : i % 3 === 1 ? '#f0fdf4' : '#eff6ff'} />
            <div style={{ padding: '10px 11px' }}>
              <L w="72%" h={8} c="#1c1917" r={2} />
              <div style={{ height: 5 }} />
              <L w="44%" h={7} c="#78716c" r={2} />
              <div style={{ height: 6 }} />
              <Row j="space-between" a="center">
                <L w={52} h={12} c={walnut} r={2} />
                <Btn bg={walnut} w={76} h={28} r={4} />
              </Row>
            </div>
          </div>
        ))}
      </G>
    </S>
  );
}

function PetStorePreview() {
  const teal = '#0d9488';
  const orange = '#fb923c';
  const bg = '#f0fdf4';
  const card = '#fff';
  const border = '#bbf7d0';
  return (
    <S bg={bg}>
      {/* Nav */}
      <Row j="space-between" a="center" s={{ background: card, padding: '12px 26px', borderBottom: '2px solid ' + border }}>
        <Row g={8} a="center">
          <div style={{ width: 28, height: 28, background: teal, borderRadius: '50%', flexShrink: 0 }} />
          <L w={90} h={18} c={teal} r={8} />
        </Row>
        <Row g={16}>
          {[40, 50, 44, 52].map((w, i) => <L key={i} w={w} h={8} c="#057056" />)}
        </Row>
        <Row g={8}>
          <Btn w={40} h={30} r={15} outline outlineColor={teal} />
          <Btn bg={teal} w={80} h={30} r={15} />
        </Row>
      </Row>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(120deg, #ccfbf1 0%, #fef3c7 100%)', padding: '22px 26px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Col g={8} s={{ flex: 1 }}>
          <Row g={6} a="center">
            <div style={{ width: 16, height: 16, background: orange, borderRadius: '50%', flexShrink: 0 }} />
            <L w={100} h={8} c="#0f766e" r={4} />
          </Row>
          <L w={230} h={28} c="#065f46" r={4} />
          <L w={170} h={8} c="#0d9488" r={4} />
          <div style={{ height: 8 }} />
          <Row g={10}>
            <Btn bg={teal} w={110} h={34} r={17} />
            <Btn bg={orange} w={110} h={34} r={17} />
          </Row>
        </Col>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <Rect w={70} h={100} bg="#ccfbf1" r={16} />
          <Rect w={70} h={100} bg="#fed7aa" r={16} />
        </div>
      </div>

      {/* Category strip */}
      <Row g={8} s={{ padding: '10px 26px', background: card, borderBottom: '1px solid ' + border }}>
        {[true, false, false, false, false, false].map((a, i) => (
          <div key={i} style={{ padding: '5px 14px', background: a ? teal : '#f0fdf4', border: '1.5px solid ' + (a ? teal : border), borderRadius: 20 }}>
            <L w={[30, 38, 34, 44, 40, 36][i]} h={7} c={a ? '#fff' : teal} />
          </div>
        ))}
      </Row>

      {/* Products */}
      <G cols={3} gap={10} s={{ padding: '12px 26px 16px' }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ background: card, border: '1.5px solid ' + border, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ height: 58, background: i % 2 === 0 ? '#ccfbf1' : '#fed7aa', position: 'relative' }}>
              {i % 3 === 0 && (
                <div style={{ position: 'absolute', top: 6, left: 6, background: orange, borderRadius: 8, padding: '2px 6px' }}>
                  <L w={26} h={6} c="#fff" />
                </div>
              )}
            </div>
            <div style={{ padding: '7px 9px' }}>
              <L w="72%" h={8} c="#065f46" r={2} />
              <div style={{ height: 4 }} />
              <Row j="space-between" a="center">
                <L w={40} h={11} c={teal} r={2} />
                <Btn bg={teal} w={28} h={28} r={14} />
              </Row>
            </div>
          </div>
        ))}
      </G>
    </S>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   TEMPLATE REGISTRY
══════════════════════════════════════════════════════════════════════════════ */
const TEMPLATES = [
  {
    id: 'minimal-luxe',
    name: 'Minimal Luxe',
    category: 'Fashion',
    badge: 'Popular',
    badgeColor: 'bg-gray-900 text-white',
    desc: 'Elegant white-space layout with oversized typography, announcement bar, and clean 4-column product grid. Perfect for premium fashion brands.',
    Preview: MinimalLuxePreview,
  },
  {
    id: 'dark-premium',
    name: 'Dark Premium',
    category: 'Luxury',
    badge: 'Trending',
    badgeColor: 'bg-yellow-700 text-white',
    desc: 'Pure black canvas with gold accents, diagonal hero cut, and editorial 2-column product tiles. Ideal for luxury goods, watches, and jewellery.',
    Preview: DarkPremiumPreview,
  },
  {
    id: 'bold-commerce',
    name: 'Bold Commerce',
    category: 'General',
    badge: 'Best Seller',
    badgeColor: 'bg-blue-600 text-white',
    desc: 'High-energy electric blue header with orange CTAs, category ribbon, star ratings, and dense conversion-focused 4-column grid.',
    Preview: BoldCommercePreview,
  },
  {
    id: 'tech-specs',
    name: 'Tech Specs',
    category: 'Electronics',
    badge: 'New',
    badgeColor: 'bg-cyan-500 text-black',
    desc: 'Deep navy command-center UI with cyan highlights, sidebar navigator, featured product hero, and full specs table. Built for electronics brands.',
    Preview: TechSpecsPreview,
  },
  {
    id: 'artisan-market',
    name: 'Artisan Market',
    category: 'Handmade',
    badge: null,
    badgeColor: '',
    desc: 'Warm cream tones with earthy textures, bamboo-inspired nav, and a Pinterest-style masonry grid. Crafted for handmade goods and artisans.',
    Preview: ArtisanMarketPreview,
  },
  {
    id: 'flash-sale',
    name: 'Flash Sale',
    category: 'Sale',
    badge: 'High Convert',
    badgeColor: 'bg-red-600 text-white',
    desc: 'Red-alert urgency header with countdown timers, gradient sale banners, and bold discount badges. Engineers maximum FOMO and impulse buys.',
    Preview: FlashSalePreview,
  },
  {
    id: 'fresh-grocery',
    name: 'Fresh Grocery',
    category: 'Food',
    badge: null,
    badgeColor: '',
    desc: 'White + green freshness with delivery promise bar, category sidebar, featured hero, and dense product grid with one-tap add buttons.',
    Preview: FreshGroceryPreview,
  },
  {
    id: 'corporate-b2b',
    name: 'Corporate B2B',
    category: 'B2B',
    badge: 'Enterprise',
    badgeColor: 'bg-slate-700 text-white',
    desc: 'Navy professional header with trust badges, structured table layout featuring SKU, unit price, tier pricing, and MOQ — built for wholesale buyers.',
    Preview: CorporateB2BPreview,
  },
  {
    id: 'editorial',
    name: 'Editorial Focus',
    category: 'Lifestyle',
    badge: 'Premium',
    badgeColor: 'bg-purple-600 text-white',
    desc: 'Magazine-style masthead with a featured story hero left, stacked article cards right, and curated product strip. For lifestyle and content brands.',
    Preview: EditorialPreview,
  },
  {
    id: 'neon-street',
    name: 'Neon Street',
    category: 'Streetwear',
    badge: 'Trending',
    badgeColor: 'bg-pink-600 text-white',
    desc: 'Ultra-dark purple background with neon pink, cyan, and acid-green glowing accents. Asymmetric layout built for streetwear and youth fashion.',
    Preview: NeonStreetPreview,
  },
  {
    id: 'pastel-beauty',
    name: 'Pastel Beauty',
    category: 'Beauty',
    badge: 'New',
    badgeColor: 'bg-pink-500 text-white',
    desc: 'Soft pink and lavender tones with rounded pill CTAs, pastel hero gradient, and delicate 3-column product grid. Perfect for cosmetics, skincare, and wellness brands.',
    Preview: PastelBeautyPreview,
  },
  {
    id: 'sports-fitness',
    name: 'Sports & Fitness',
    category: 'Sports',
    badge: 'Popular',
    badgeColor: 'bg-orange-600 text-white',
    desc: 'Dark slate canvas with electric orange accents, bold typography, category strip, and high-contrast product cards. Built for athletic apparel and fitness gear.',
    Preview: SportsFitnessPreview,
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    category: 'Real Estate',
    badge: 'Professional',
    badgeColor: 'bg-red-700 text-white',
    desc: 'Clean white layout with navy and green accents, integrated search bar, statistics strip, and wide 2-column property listing cards. Ideal for agents and developers.',
    Preview: RealEstatePreview,
  },
  {
    id: 'kids-playful',
    name: 'Kids & Playful',
    category: 'Kids',
    badge: 'Fun',
    badgeColor: 'bg-amber-500 text-white',
    desc: 'Warm yellow background with orange, sky-blue, and colorful rounded card grid. Inviting and energetic layout designed for children\'s products and toy stores.',
    Preview: KidsPlayfulPreview,
  },
  {
    id: 'pharmacy-health',
    name: 'Pharmacy & Health',
    category: 'Health',
    badge: 'Trusted',
    badgeColor: 'bg-sky-600 text-white',
    desc: 'Crisp medical-blue header with green accents, professional top bar, category tabs, and dense 4-column product grid. Ideal for pharmacies and health supply stores.',
    Preview: PharmacyHealthPreview,
  },
  {
    id: 'jewellery-gold',
    name: 'Jewellery & Gold',
    category: 'Jewellery',
    badge: 'Luxury',
    badgeColor: 'bg-yellow-700 text-white',
    desc: 'Dark mahogany background with warm gold typography, champagne hero gradient, and minimal serif-styled product cards. Crafted for fine jewellery and luxury accessories.',
    Preview: JewelleryGoldPreview,
  },
  {
    id: 'auto-parts',
    name: 'Auto & Parts',
    category: 'Automotive',
    badge: 'Industrial',
    badgeColor: 'bg-red-600 text-white',
    desc: 'Industrial zinc-dark layout with bold red accents, yellow badge tags, and a rugged product grid featuring part numbers and stock indicators.',
    Preview: AutoPartsPreview,
  },
  {
    id: 'furniture-home',
    name: 'Furniture & Home',
    category: 'Home & Decor',
    badge: 'Trending',
    badgeColor: 'bg-amber-700 text-white',
    desc: 'Warm Nordic minimalism with walnut brown accents, pastel-tinted hero split, and airy 3-column product cards. Designed for furniture, decor, and interior lifestyle brands.',
    Preview: FurnitureHomePreview,
  },
  {
    id: 'pet-store',
    name: 'Pet Store',
    category: 'Pets',
    badge: 'New',
    badgeColor: 'bg-teal-600 text-white',
    desc: 'Fresh teal and warm orange palette with rounded cards, cheerful hero gradient, and a welcoming 3-column product grid. Built for pet supply and animal care shops.',
    Preview: PetStorePreview,
  },
];

const ALL_CATEGORIES = ['All', 'Fashion', 'Luxury', 'General', 'Electronics', 'Handmade', 'Sale', 'Food', 'B2B', 'Lifestyle', 'Streetwear', 'Beauty', 'Sports', 'Real Estate', 'Kids', 'Health', 'Jewellery', 'Automotive', 'Home & Decor', 'Pets'];

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function TemplateSelect() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [creatingId, setCreatingId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  // Name + cover modal state
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [catalogName, setCatalogName] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const filtered = TEMPLATES.filter(t =>
    (activeCategory === 'All' || t.category === activeCategory) &&
    (!search || t.name.toLowerCase().includes(search.toLowerCase()))
  );

  const openModal = (template) => {
    setSelectedTemplate(template);
    setCatalogName('');
    setCoverFile(null);
    setCoverPreview(null);
  };

  const closeModal = () => {
    setSelectedTemplate(null);
    setCoverFile(null);
    setCoverPreview(null);
  };

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleCreate = async () => {
    if (!selectedTemplate || creatingId) return;
    const template = selectedTemplate;
    setCreatingId(template.id);
    try {
      const name = catalogName.trim() || ('New ' + template.name + ' Catalog');
      const response = await catalogService.createCatalog({ name, template: template.id });
      if (!response || !response.data) {
        toast.error('Unexpected response from server.');
        return;
      }
      const catalogId = response.data._id;
      if (coverFile) {
        try {
          await catalogService.uploadCoverImage(catalogId, coverFile);
        } catch {
          // Non-fatal — catalog still created
        }
      }
      toast.success('Catalogue created! Opening editor...');
      navigate('/dashboard/catalogues/' + catalogId + '/edit');
    } catch (err) {
      const msg =
        (err && err.response && err.response.data && err.response.data.message) ||
        'Failed to create catalogue. Please try again.';
      toast.error(msg);
    } finally {
      setCreatingId(null);
    }
  };

  return (
    <>
    <div className="bg-[#f4f6f8] min-h-screen w-full">

      {/* ── Page Header ───────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <button
              onClick={() => navigate('/dashboard/catalogs')}
              className="group text-xs text-gray-400 hover:text-gray-700 mb-2 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to Catalogues
            </button>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Choose a Template</h1>
            <p className="text-gray-500 text-sm mt-1">
              {TEMPLATES.length} professionally designed starting points — all fully customizable.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060] transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-10 pt-8 pb-20 flex flex-col xl:flex-row gap-8">

        {/* Sidebar */}
        <aside className="w-full xl:w-52 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 xl:sticky xl:top-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">Category</p>
            <ul className="space-y-0.5">
              {ALL_CATEGORIES.map(cat => {
                const count = cat === 'All'
                  ? TEMPLATES.length
                  : TEMPLATES.filter(t => t.category === cat).length;
                return (
                  <li key={cat}>
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                        activeCategory === cat
                          ? 'bg-[#008060]/10 text-[#008060] font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-xs tabular-nums ${activeCategory === cat ? 'text-[#008060]' : 'text-gray-400'}`}>
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Template Grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-400 py-24 text-sm">
              No templates match your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(template => {
                const isHovered = hoveredId === template.id;
                const isCreating = creatingId === template.id;

                return (
                  <div
                    key={template.id}
                    onMouseEnter={() => setHoveredId(template.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group"
                    style={{ willChange: 'transform' }}
                  >
                    {/* Preview area */}
                    <div className="relative h-44 bg-gray-50 border-b border-gray-100 overflow-hidden">
                      <div className="absolute inset-0">
                        <template.Preview />
                      </div>

                      {/* Hover overlay with preview label */}
                      <div
                        className="absolute inset-0 transition-opacity duration-300 flex items-center justify-center"
                        style={{ opacity: isHovered ? 1 : 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(1.5px)' }}
                      >
                        <span className="bg-white text-gray-900 font-semibold text-[13px] px-5 py-2 rounded-xl shadow-xl"
                          style={{ transform: isHovered ? 'translateY(0)' : 'translateY(8px)', transition: 'transform 0.3s ease' }}>
                          Live Preview
                        </span>
                      </div>

                      {/* Badge */}
                      {template.badge && (
                        <div className="absolute top-3 right-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md ${template.badgeColor}`}>
                            {template.badge}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card content */}
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-gray-900 text-[15px] leading-tight">{template.name}</h3>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2.5">{template.category}</p>
                      <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-4">{template.desc}</p>

                      <button
                        onClick={() => openModal(template)}
                        disabled={!!creatingId}
                        className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          background: isHovered ? '#006e52' : '#008060',
                          color: '#fff',
                          boxShadow: isHovered && !creatingId ? '0 4px 14px rgba(0,128,96,0.4)' : 'none',
                        }}
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* ── Create Catalogue Modal ──────────────────────────────────── */}
    {selectedTemplate && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
        onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          {/* Modal header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#008060]/10 flex items-center justify-center text-lg">🗂️</div>
              <div>
                <h2 className="text-base font-bold text-gray-900">New Catalogue</h2>
                <p className="text-xs text-gray-400 mt-0.5">Using <span className="font-semibold text-gray-600">{selectedTemplate.name}</span> template</p>
              </div>
            </div>
          </div>

          {/* Modal body */}
          <div className="px-6 py-5 space-y-5">
            {/* Name field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Catalogue Name <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={catalogName}
                onChange={e => setCatalogName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder={`New ${selectedTemplate.name} Catalog`}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008060]/25 focus:border-[#008060] transition-all bg-gray-50"
                autoFocus
              />
              <p className="text-[11px] text-gray-400 mt-1.5">You can rename it anytime in the editor.</p>
            </div>

            {/* Cover image upload */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Cover / Background Image <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              {coverPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 h-36">
                  <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-sm leading-none transition-colors"
                  >×</button>
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                    {coverFile.name}
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]); }}
                  onClick={() => document.getElementById('cover-upload-input').click()}
                  className="relative border-2 border-dashed rounded-xl h-32 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
                  style={{
                    borderColor: dragOver ? '#008060' : '#e5e7eb',
                    background: dragOver ? '#f0fdf8' : '#fafafa',
                  }}
                >
                  <div className="text-2xl">🖼️</div>
                  <p className="text-xs font-semibold text-gray-500">
                    {dragOver ? 'Drop to upload' : 'Drag & drop or click to upload'}
                  </p>
                  <p className="text-[10px] text-gray-400">JPG, PNG, WEBP · Max 5MB</p>
                </div>
              )}
              <input
                id="cover-upload-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => handleFileSelect(e.target.files[0])}
              />
            </div>
          </div>

          {/* Modal footer */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={closeModal}
              disabled={!!creatingId}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!!creatingId}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: '#008060', boxShadow: creatingId ? 'none' : '0 4px 14px rgba(0,128,96,0.35)' }}
            >
              {creatingId ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>🚀 Create Catalogue</>
              )}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

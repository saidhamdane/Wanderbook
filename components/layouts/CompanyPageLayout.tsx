'use client';

import type { LayoutProps } from '@/lib/magazine/types';
import { getActivityLabel, resolveActivityProfile } from '@/lib/magazine/resolveActivityProfile';
import { PageRoot } from './layout-utils';

function firstValue(...values: Array<string | undefined>): string {
  return values.find((value) => value && value.trim().length > 0)?.trim() || '';
}

function paragraphs(value: string): string[] {
  return value.split(/\n+/).map((line) => line.trim()).filter(Boolean);
}

function looksEnglish(value: string): boolean {
  const lower = value.toLowerCase();
  return (
    lower.startsWith('the ') ||
    lower.includes(' the ') ||
    lower.includes('unleash') ||
    lower.includes('explore ') ||
    /\byour\b/.test(lower)
  );
}

function spanishCompanyFallbacks(businessName: string, island: string, rawActivityType: string) {
  const profile = resolveActivityProfile({ activityType: rawActivityType }, 'es');
  const activity = profile.activityLabel;
  return {
    title: `La experiencia con ${businessName}`,
    subtitle: activity && island ? `${activity} en ${island}` : activity,
    body: `Esta pagina presenta a ${businessName} dentro de una experiencia de ${activity.toLowerCase()} pensada para viajeros de ${island || 'Fuerteventura'}. El contenido mantiene el foco en la actividad, el contexto local y los detalles que convierten el viaje en un recuerdo propio.`,
    summary: `${businessName} crea una experiencia de ${activity.toLowerCase()} conectada con la isla y sus viajeros.`,
    trustLine: 'Los viajeros destacan el trato cercano y la experiencia vivida.',
    ctaLine: `Reserva tu proxima experiencia con ${businessName}.`,
  };
}

export default function CompanyPageLayout({ slots, palette, fonts, partner, language }: LayoutProps) {
  const businessName = firstValue(partner?.businessName, slots['company-name']);
  if (!partner || !businessName) return null;

  const isSpanish = language === 'es';
  const island = firstValue(partner.mainIsland, slots['partner-main-island']);
  const rawActivityType = firstValue(
    partner.activityLabel,
    partner.resolvedActivityType,
    slots['partner-resolved-activity-type'],
    partner.activityType,
    partner.aiDetectedActivityType,
    slots['partner-activity-type'],
    partner.businessType,
  );
  const activityType = getActivityLabel(rawActivityType, language);
  const spanishFallback = spanishCompanyFallbacks(businessName, island, rawActivityType);
  const safeSpanish = (value: string | undefined, fallback: string) =>
    isSpanish && value && looksEnglish(value) ? fallback : value;
  const titleFallback = isSpanish
    ? spanishFallback.title
    : `The ${businessName} Experience`;
  const title = firstValue(
    safeSpanish(partner.aiCompanyPageTitle, spanishFallback.title),
    titleFallback
  );
  const subtitle = firstValue(
    safeSpanish(partner.aiCompanyPageSubtitle, spanishFallback.subtitle),
    activityType && island ? (isSpanish ? `${activityType} en ${island}` : `${activityType} on ${island}`) : ''
  );
  const body = firstValue(
    safeSpanish(partner.aiCompanyPageBody, spanishFallback.body),
    safeSpanish(partner.aiCompanySummary, spanishFallback.summary),
    isSpanish ? spanishFallback.body : ''
  );
  const trustLine = safeSpanish(partner.aiCompanyTrustLine, spanishFallback.trustLine);
  const ctaLine = safeSpanish(partner.aiCompanyFinalCtaLine, spanishFallback.ctaLine);
  const contextLine = firstValue(partner.aiIslandContextLine);
  const activityDescription = firstValue(
    safeSpanish(partner.aiActivityDescription, trustLine || spanishFallback.trustLine),
    trustLine,
    ctaLine
  );
  const themes = Array.isArray(partner.aiPositiveReviewThemes) ? partner.aiPositiveReviewThemes.filter(Boolean).slice(0, 6) : [];
  const demoCompanyImage = firstValue(
    typeof partner.demoCompanyImage === 'string' ? partner.demoCompanyImage : undefined,
    slots['company-photo']
  );
  const photos = demoCompanyImage
    ? [{ reference: 'demo-company-image', proxyUrl: demoCompanyImage }]
    : Array.isArray(partner.googlePhotos) ? partner.googlePhotos.slice(0, 3) : [];
  const rating = typeof partner.googleRating === 'number' ? partner.googleRating : undefined;
  const reviewCount = typeof partner.googleReviewCount === 'number' ? partner.googleReviewCount : undefined;

  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${palette.background} 0%, ${palette.light} 100%)`,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, padding: '72px 58px 52px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {island && (
            <span style={{
              border: `1px solid ${palette.accent}`,
              color: palette.accent,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              padding: '7px 10px',
            }}>
              {island}
            </span>
          )}
          {activityType && (
            <span style={{
              background: palette.primary,
              color: palette.background,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '8px 11px',
            }}>
              {activityType}
            </span>
          )}
        </div>

        <div
          style={{
            marginTop: 30,
            fontFamily: fonts.body,
            color: palette.accent,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          {businessName}
        </div>

        <h1
          style={{
            margin: '12px 0 0',
            maxWidth: 620,
            fontFamily: fonts.heading,
            fontSize: 58,
            lineHeight: 0.98,
            color: palette.primary,
            fontWeight: 900,
            overflowWrap: 'anywhere',
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p style={{
            margin: '18px 0 0',
            maxWidth: 560,
            fontFamily: fonts.subheading,
            fontSize: 20,
            lineHeight: 1.35,
            color: palette.text,
            fontWeight: 700,
          }}>
            {subtitle}
          </p>
        )}

        {rating !== undefined && (
          <div style={{
            marginTop: 18,
            color: palette.primary,
            fontSize: 15,
            fontWeight: 800,
          }}>
            ★ {rating.toFixed(1)}{reviewCount ? ` · ${reviewCount} ${isSpanish ? 'reseñas' : 'reviews'}` : ''}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: photos.length ? '1.15fr 0.85fr' : '1fr', gap: 28, marginTop: 32 }}>
          <div>
            {paragraphs(body).map((line, index) => (
              <p
                key={index}
                style={{
                  margin: index === 0 ? 0 : '16px 0 0',
                  maxWidth: 610,
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: palette.text,
                }}
              >
                {line}
              </p>
            ))}

            {contextLine && (
              <p style={{
                margin: '22px 0 0',
                maxWidth: 610,
                fontSize: 17,
                lineHeight: 1.5,
                color: palette.primary,
                fontStyle: 'italic',
                fontWeight: 600,
              }}>
                {contextLine}
              </p>
            )}

            {activityDescription && (
              <p style={{
                margin: '18px 0 0',
                maxWidth: 610,
                fontSize: 13,
                lineHeight: 1.7,
                color: palette.text,
                opacity: 0.82,
              }}>
                {activityDescription}
              </p>
            )}
          </div>

          {photos.length > 0 && (
            <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
              {photos.map((photo, index) => (
                <img
                  key={photo.reference || index}
                  src={photo.proxyUrl}
                  alt=""
                  onError={(event) => { event.currentTarget.style.display = 'none'; }}
                  style={{
                    width: '100%',
                    height: index === 0 ? 210 : 135,
                    objectFit: 'cover',
                    display: 'block',
                    border: `8px solid ${palette.background}`,
                    boxShadow: '0 18px 42px rgba(0,0,0,0.16)',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {themes.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <div style={{
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: palette.accent,
            }}>
              {isSpanish ? 'Los huespedes destacan:' : 'Guests love:'}
            </div>
            <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {themes.map((theme) => (
                <span
                  key={theme}
                  style={{
                    border: `1px solid ${palette.primary}`,
                    color: palette.primary,
                    padding: '8px 10px',
                    fontSize: 12,
                    fontWeight: 800,
                    lineHeight: 1.2,
                  }}
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageRoot>
  );
}

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'UniPlanner Pro - Free Tools for University Students';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 40%, #7c3aed 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '999px',
            padding: '8px 20px',
            marginBottom: '28px',
          }}
        >
          <span style={{ color: '#fbbf24', fontSize: '18px' }}>★</span>
          <span style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>
            12 Free Tools · No Signup Required
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '80px',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-2px',
            lineHeight: 1.1,
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          UniPlanner Pro
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '30px',
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
            marginBottom: '40px',
          }}
        >
          Free Academic Tools for University Students
        </div>

        {/* Tool pills */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '900px',
          }}
        >
          {['Schedule Maker', 'GPA Calculator', 'Pomodoro Timer', 'Attendance Tracker', 'Flashcards'].map(
            (tool) => (
              <div
                key={tool}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 500,
                }}
              >
                {tool}
              </div>
            )
          )}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '18px',
          }}
        >
          myunischedule.com
        </div>
      </div>
    ),
    { ...size }
  );
}

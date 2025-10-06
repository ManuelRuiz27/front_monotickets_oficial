'use client';
import { useEffect, useRef, useState } from 'react';
import { api } from '@api/monotickets-sdk';
import { upsert, CheckinPayload } from '../lib/idb';
import { useOfflineQueue } from '../lib/offlineQueue';
import { playBeep } from '../lib/sounds';
import { useUI } from '../lib/uiStore';
import { useInside } from '../lib/insideStore';
import React from 'react';

declare global {
  interface Window {
    BarcodeDetector?: any;
  }
}

type Status = 'idle' | 'valid' | 'duplicate' | 'invalid';

/**
 * QRScanner component handles scanning QR codes using the BarcodeDetector API
 * when available, with a fallback to manual input.  It manages offline
 * queuing, plays audio cues, triggers vibrations, and updates occupancy
 * information through the inside store.
 */
export function QRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [manual, setManual] = useState('');
  const { enqueue, online, setToast } = useOfflineQueue();
  const { gate, passType } = useUI();
  const { setFromCheckin } = useInside();

  useEffect(() => {
    let stream: MediaStream;
    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        loopDetect();
      } catch {
        setToast({ kind: 'warn', message: 'No se pudo acceder a la cámara. Usa entrada manual.' });
      }
    };
    start();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loopDetect = async () => {
    if (!window.BarcodeDetector || !videoRef.current) return;
    const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const tick = async () => {
      const v = videoRef.current!;
      if (v.readyState >= 2) {
        canvas.width = v.videoWidth;
        canvas.height = v.videoHeight;
        ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
        try {
          const barcodes = await detector.detect(canvas);
          if (barcodes?.[0]?.rawValue) await handleCode(barcodes[0].rawValue);
        } catch {
          // ignore detection errors
        }
      }
      requestAnimationFrame(tick);
    };
    tick();
  };

  const handleCode = async (code: string) => {
    // Debounce identical codes within 1.5s
    if ((handleCode as any)._last === code && Date.now() - (handleCode as any)._ts < 1500) return;
    (handleCode as any)._last = code;
    (handleCode as any)._ts = Date.now();

    const payloadLocal: CheckinPayload = {
      id: crypto.randomUUID(),
      code,
      ts: Date.now(),
      gate,
      passType: passType || null,
    };

    // store local check-in immediately for history
    await upsert('checkins', payloadLocal);

    if (!online) {
      setStatus('valid');
      navigator.vibrate?.(60);
      playBeep('offline');
      enqueue(payloadLocal);
      setToast({ kind: 'info', message: 'Guardado offline. Se sincronizará.' });
      // update UI for offline local event only
      useInside.getState().setFromCheckin({
        id: 'unknown',
        name: '—',
        passType,
        alreadyEntered: undefined,
        lastCheckinAt: null,
        status: 'valid',
      });
      return;
    }

    try {
      const { data } = await api.post('/staff/checkin', {
        code,
        gate,
        passType: passType || undefined,
      });
      const serverStatus: Status =
        data?.status === 'duplicate'
          ? 'duplicate'
          : data?.status === 'invalid'
            ? 'invalid'
            : 'valid';
      setStatus(serverStatus);
      const lastPerson = {
        id: data?.person?.id || 'unknown',
        name: data?.person?.name || 'Invitado',
        passType: data?.person?.passType || passType || null,
        alreadyEntered: !!data?.alreadyEntered,
        lastCheckinAt: data?.lastCheckinAt || null,
        status: serverStatus,
      };
      useInside.getState().setFromCheckin(lastPerson, data?.insideCount);
      if (serverStatus === 'valid') {
        navigator.vibrate?.(60);
        if (data?.alreadyEntered) {
          playBeep('reentry');
          setToast({ kind: 'warn', message: 'Ya había ingresado anteriormente ⚠️' });
        } else {
          playBeep('ok');
          setToast({ kind: 'success', message: 'Acceso válido ✅' });
        }
      } else if (serverStatus === 'duplicate') {
        navigator.vibrate?.([50, 50, 50]);
        playBeep('reentry');
        setToast({ kind: 'warn', message: 'Código duplicado ⚠️' });
      } else if (serverStatus === 'invalid') {
        navigator.vibrate?.([120, 80, 120]);
        playBeep('err');
        setToast({ kind: 'error', message: 'Código no válido ❌' });
      }
    } catch {
      // treat as offline if network fails after we thought we were online
      setStatus('valid');
      enqueue(payloadLocal);
      navigator.vibrate?.(60);
      playBeep('offline');
      setToast({ kind: 'info', message: 'Sin conexión. Registro en cola.' });
      useInside.getState().setFromCheckin({
        id: 'unknown',
        name: '—',
        passType,
        alreadyEntered: undefined,
        lastCheckinAt: null,
        status: 'valid',
      });
    }
  };

  const submitManual = async () => {
    if (!manual.trim()) return;
    await handleCode(manual.trim());
    setManual('');
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="bg-black/40 rounded-lg border border-white/10 p-3">
        <video ref={videoRef} className="w-full rounded-lg aspect-video object-cover" />
        <div className="mt-3 flex gap-2">
          <input
            className="bg-white/5 border border-white/10 rounded p-2 flex-1"
            placeholder={`Ingresar código manual… (${gate}${passType ? ` • ${passType}` : ''})`}
            value={manual}
            onChange={(e) => setManual(e.target.value)}
          />
          <button
            onClick={submitManual}
            className="px-4 py-2 rounded bg-white/10 hover:bg-white/20"
          >
            Validar
          </button>
        </div>
      </div>
      <div className="rounded-lg border border-white/10 p-4 bg-black/20">
        <h3 className="font-semibold mb-2">Estado</h3>
        <div
          className="h-40 rounded flex items-center justify-center text-2xl font-bold"
          style={{
            background:
              status === 'valid'
                ? '#052e1b'
                : status === 'duplicate'
                  ? '#3a2b06'
                  : status === 'invalid'
                    ? '#3b0b0b'
                    : '#0f172a',
          }}
        >
          {status === 'idle' && 'Esperando…'}
          {status === 'valid' && '✅ VÁLIDO'}
          {status === 'duplicate' && '⚠️ DUPLICADO'}
          {status === 'invalid' && '❌ NO VÁLIDO'}
        </div>
        <p className="text-xs opacity-70 mt-3">
          Muestra si la persona ya había ingresado y actualiza el aforo con datos del servidor.
        </p>
      </div>
    </div>
  );
}

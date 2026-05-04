"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface PromptPayQRProps {
  phoneNumber: string;
  amount: number;
}

/**
 * สร้าง PromptPay QR payload ตามมาตรฐาน EMVCo
 * Format: 00020101021229370016A0000006770101110113{phone}5802TH5303764540{amount}6304{crc}
 */
function generatePromptPayPayload(phone: string, amount: number): string {
  const formatTT = (tag: string, value: string) => {
    const len = value.length.toString().padStart(2, "0");
    return `${tag}${len}${value}`;
  };

  const phoneClean = phone.replace(/[^0-9]/g, "");
  const paddedPhone = phoneClean.padStart(13, "0").slice(-13);
  const amountStr = amount.toFixed(2);

  const data = [
    formatTT("00", "01"),
    "010212",
    formatTT("29", formatTT("00", "A000000677010111") + formatTT("01", paddedPhone)),
    formatTT("58", "TH"),
    formatTT("53", "764"),
    formatTT("54", amountStr),
    "6304",
  ].join("");

  const crc = crc16(data);
  return data + crc.toString(16).toUpperCase().padStart(4, "0");
}

function crc16(str: string): number {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
    crc &= 0xffff;
  }
  return crc;
}

export default function PromptPayQR({ phoneNumber, amount }: PromptPayQRProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const payload = generatePromptPayPayload(phoneNumber, amount);
    QRCode.toCanvas(canvasRef.current, payload, {
      width: 220,
      margin: 2,
      color: { dark: "#1a1a2e", light: "#ffffff" },
    });
  }, [phoneNumber, amount]);

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas ref={canvasRef} className="rounded-xl" />
      <div className="text-center">
        <p className="text-sm text-gray-500">สแกน QR เพื่อชำระเงิน</p>
        <p className="text-lg font-bold text-gray-900">฿{amount.toLocaleString()}</p>
        <p className="text-xs text-gray-400 mt-1">พร้อมเพย์: {phoneNumber}</p>
      </div>
    </div>
  );
}

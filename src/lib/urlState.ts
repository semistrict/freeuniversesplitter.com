/**
 * URL state management with basic obfuscation
 * Serializes state -> simple encrypt -> base64 -> URL fragment
 */

// Simple XOR cipher for obfuscation (not real security, just anti-tampering)
const SECRET_KEY = "FreeUniverseSplitter2024";

function simpleEncrypt(text: string): string {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        const keyChar = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
        result += String.fromCharCode(char ^ keyChar);
    }
    return result;
}

function simpleDecrypt(encrypted: string): string {
    // XOR is symmetric, so decryption is the same as encryption
    return simpleEncrypt(encrypted);
}

function base64Encode(str: string): string {
    try {
        return btoa(unescape(encodeURIComponent(str)));
    } catch {
        return "";
    }
}

function base64Decode(str: string): string {
    try {
        return decodeURIComponent(escape(atob(str)));
    } catch {
        return "";
    }
}

export function encodeState(state: any): string {
    try {
        const json = JSON.stringify(state);
        const encrypted = simpleEncrypt(json);
        const encoded = base64Encode(encrypted);
        return encoded;
    } catch {
        return "";
    }
}

export function decodeState<T>(encoded: string): T | null {
    try {
        const decoded = base64Decode(encoded);
        const decrypted = simpleDecrypt(decoded);
        return JSON.parse(decrypted) as T;
    } catch {
        return null;
    }
}

export function setUrlState(state: any) {
    if (typeof window !== 'undefined') {
        const encoded = encodeState(state);
        if (encoded) {
            window.location.hash = encoded;
        }
    }
}

export function getUrlState<T>(): T | null {
    if (typeof window !== 'undefined') {
        const hash = window.location.hash.substring(1); // Remove the #
        if (hash) {
            return decodeState<T>(hash);
        }
    }
    return null;
}

export function clearUrlState() {
    if (typeof window !== 'undefined') {
        window.location.hash = "";
    }
}

export async function shareResult(title: string, text: string, url?: string) {
    if (typeof window !== 'undefined') {
        const shareData = {
            title: title,
            text: text,
            url: url || window.location.href
        };
        
        // Try native share (iOS share sheet)
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                return true;
            } catch (error) {
                // User cancelled or error occurred
                if (error.name !== 'AbortError') {
                    console.error('Share failed:', error);
                }
            }
        }
    }
    return false;
}

// Types for different modes
export interface Magic8BallState {
    type: 'magic8ball';
    response: string;
    timestamp: number;
}

export interface IChingState {
    type: 'iching';
    hexagramNumber: number;
    timestamp: number;
}

export interface UniverseState {
    type: 'universe';
    alternatives: [string, string];
    weights: [number, number];
    result: string;
    timestamp: number;
}